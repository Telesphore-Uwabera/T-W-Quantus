/**
 * publicApi.ts — Public-facing read-only API.
 *
 * ALL read endpoints — list pages, home-page sections, AND individual detail
 * pages — are served from the in-memory background cache in dataCache.ts.
 * Zero DB round-trip on any public request. Data is pre-warmed on boot and
 * continuously refreshed every 2 min (projects/perspectives) / 5 min (news).
 *
 * Cache-miss fallback: if an item isn't in the slug map yet (brand-new publish
 * before the next poll), the route falls back to a live DB query so nothing
 * is ever "missing" immediately after publishing.
 *
 * Write endpoints (POST /contact, /newsletter) always go live to the DB.
 */

import { Router } from "express";
import { getDb } from "../db/mongo";
import { serializeProject, serializePerspective } from "../lib/projectDoc";
import {
  getCachedProjects,
  getCachedPerspectives,
  getCachedProjectBySlug,
  getCachedPerspectiveBySlug,
  getCachedNews,
  type NewsArticle,
} from "../lib/dataCache";

const DB_MAX_TIME_MS = 12000;

// ─── Service-news keyword filter ──────────────────────────────────────────────

type ServiceSlug =
  | "quantity-surveying"
  | "construction-management"
  | "project-management"
  | "construction-technical-services";

const SERVICE_NEWS_KEYWORDS: Record<ServiceSlug, string[]> = {
  "quantity-surveying": [
    "quantity surveying", "cost plan", "cost planning", "cost estimate",
    "cost control", "bill of quantities", "boq", "final account",
    "variation", "valuation", "measurement",
  ],
  "construction-management": [
    "construction management", "site supervision", "site coordination",
    "quality assurance", "quality control", "hse", "health and safety",
    "safety", "program", "programme", "schedule", "milestone",
  ],
  "project-management": [
    "project management", "feasibility", "stakeholder", "procurement",
    "tender", "contract", "risk management", "commissioning", "handover",
  ],
  "construction-technical-services": [
    "construction", "civil", "structural", "infrastructure", "mep",
    "mechanical", "electrical", "hvac", "plumbing", "fire system",
    "renovation", "repairs", "fit-out", "materials", "building",
    "architecture", "engineering", "urban development", "real estate", "housing",
  ],
};

const SERVICE_SLUGS = Object.keys(SERVICE_NEWS_KEYWORDS) as ServiceSlug[];

function normalizeText(v: unknown): string {
  return typeof v === "string" ? v.toLowerCase() : "";
}

function matchesAny(text: string, needles: string[]): boolean {
  return needles.some((k) => text.includes(k.toLowerCase()));
}

function filterServiceNews(articles: NewsArticle[], service?: ServiceSlug): NewsArticle[] {
  const baseNeedles = SERVICE_SLUGS.flatMap((s) => SERVICE_NEWS_KEYWORDS[s]);
  const needles = service ? SERVICE_NEWS_KEYWORDS[service] : baseNeedles;
  return articles.filter((a) => {
    const hay = `${normalizeText(a.title)} ${normalizeText(a.description)} ${normalizeText(a.source)}`;
    return matchesAny(hay, needles);
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function createPublicApiRouter() {
  const r = Router();
  const BOOT_TIME = Date.now(); // used to gate DB fallback to boot grace window

  // ── GET /projects — served from background cache (instant) ────────────────
  r.get("/projects", (_req, res) => {
    // Short max-age: the real freshness is guaranteed by the server-side poller.
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const projects = getCachedProjects();
    res.json(projects);
  });

  // ── GET /projects/:slug — cache-first, 404 guard, boot-only DB fallback ──
  r.get("/projects/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const slug = String(req.params.slug ?? "").trim();
    if (!slug) {
      res.status(400).json({ error: "Invalid slug" });
      return;
    }

    // ① Hit — return from slug map immediately (no DB)
    const hit = getCachedProjectBySlug(slug);
    if (hit) {
      res.json(hit);
      return;
    }

    // ② Miss — only attempt a live DB fallback in the first 30 s after boot
    //    (covers the window before the initial warm-up finishes).
    //    After that the cache is authoritative: miss = 404, no DB call at all.
    const BOOT_GRACE_MS = 30_000;
    if (Date.now() - BOOT_TIME > BOOT_GRACE_MS) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    try {
      const db = await getDb();
      const doc = await db
        .collection("projects")
        .findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
      const out = serializeProject(doc);
      if (!out) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(out);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured" });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  // ── GET /perspectives — served from background cache (instant) ────────────
  r.get("/perspectives", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const perspectives = getCachedPerspectives();
    res.json(perspectives);
  });

  // ── GET /perspectives/:slug — cache-first, 404 guard, boot-only DB fallback
  r.get("/perspectives/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const slug = String(req.params.slug ?? "").trim();
    if (!slug) {
      res.status(400).json({ error: "Invalid slug" });
      return;
    }

    // ① Hit — return from slug map immediately
    const hit = getCachedPerspectiveBySlug(slug);
    if (hit) {
      res.json(hit);
      return;
    }

    // ② Miss — only use DB fallback within 30 s of boot; after that, 404 instantly
    const BOOT_GRACE_MS = 30_000;
    if (Date.now() - BOOT_TIME > BOOT_GRACE_MS) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    try {
      const db = await getDb();
      const doc = await db
        .collection("perspectives")
        .findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
      const out = serializePerspective(doc);
      if (!out) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(out);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI") || msg.includes("timed out") || msg.includes("MongoServerSelection")) {
        res.status(503).json({ error: "Database temporarily unavailable" });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  // ── POST /contact ─────────────────────────────────────────────────────────
  r.post("/contact", async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body ?? {};
      if (!name || !email || !message) {
        res.status(400).json({ error: "name, email, and message are required" });
        return;
      }
      const db = await getDb();
      const now = new Date();
      const doc = {
        name:    String(name).trim(),
        email:   String(email).trim(),
        phone:   phone   ? String(phone).trim()   : "",
        service: service ? String(service).trim() : "",
        message: String(message).trim(),
        source:  "contact_page",
        createdAt: now,
      };
      const result = await db.collection("contacts").insertOne(doc);
      res.json({ ok: true, id: String(result.insertedId) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured" });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  // ── POST /newsletter ──────────────────────────────────────────────────────
  r.post("/newsletter", async (req, res) => {
    try {
      const email = req.body?.email;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ error: "Valid email required" });
        return;
      }
      const db = await getDb();
      const now = new Date();
      try {
        await db.collection("subscriptions").insertOne({
          email:     email.trim().toLowerCase(),
          source:    "footer_newsletter",
          createdAt: now,
        });
      } catch (err: unknown) {
        const code =
          err && typeof err === "object" && "code" in err
            ? (err as { code: number }).code
            : 0;
        if (code === 11000) {
          res.json({ ok: true, duplicate: true });
          return;
        }
        throw err;
      }
      res.json({ ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured" });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  // ── GET /news — full feed from background cache ───────────────────────────
  r.get("/news", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(getCachedNews());
  });

  // ── GET /news/services — filtered feed from background cache ─────────────
  r.get("/news/services", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

    const serviceParam =
      typeof req.query.service === "string" ? req.query.service.trim() : "";
    const service = SERVICE_SLUGS.includes(serviceParam as ServiceSlug)
      ? (serviceParam as ServiceSlug)
      : undefined;

    const cached = getCachedNews();
    const filtered = filterServiceNews(cached.articles as NewsArticle[], service).slice(0, 12);

    res.json({
      ...cached,
      articles: filtered,
      service: service ?? null,
    });
  });

  return r;
}
