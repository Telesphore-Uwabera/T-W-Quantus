/**
 * publicApi.ts — Public-facing read-only API.
 *
 * Strategy: cache-first, always-DB fallback.
 *   • The background cache (dataCache.ts) warms on boot and polls every 2 min
 *     (projects/perspectives) / 5 min (news).  When the cache is populated,
 *     every request is served from RAM — zero DB round-trip.
 *   • If the cache is empty or a slug is not found in the map, a live DB query
 *     is ALWAYS performed.  This guarantees the UI displays real data even
 *     during boot, cold-starts, dev mode, or any cache warm-up delay.
 *
 * Write endpoints (POST /contact, /newsletter) always go directly to the DB.
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

const DB_MAX_TIME_MS = 12_000;
const DB_LIST_LIMIT  = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dbError(e: unknown): { status: number; message: string } {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("MONGODB_URI")) return { status: 503, message: "Database not configured" };
  if (msg.includes("timed out") || msg.includes("MongoServerSelection")) {
    return { status: 503, message: "Database temporarily unavailable" };
  }
  return { status: 500, message: msg };
}

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

  // ── GET /projects ─────────────────────────────────────────────────────────
  r.get("/projects", async (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");

    // Serve from in-memory cache when populated (the fast path)
    const cached = getCachedProjects();
    if (cached.length > 0) {
      res.json(cached);
      return;
    }

    // Cache empty — go directly to the database
    try {
      const db  = await getDb();
      const raw = await db
        .collection("projects")
        .find({ published: true })
        .maxTimeMS(DB_MAX_TIME_MS)
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(DB_LIST_LIMIT)
        .toArray();
      res.json(raw.map((d) => serializeProject(d)).filter(Boolean));
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
    }
  });

  // ── GET /projects/:slug ───────────────────────────────────────────────────
  r.get("/projects/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const slug = String(req.params.slug ?? "").trim();
    if (!slug) { res.status(400).json({ error: "Invalid slug" }); return; }

    // Serve from cache when available
    const hit = getCachedProjectBySlug(slug);
    if (hit) { res.json(hit); return; }

    // Not in cache — query the database directly
    try {
      const db  = await getDb();
      const doc = await db
        .collection("projects")
        .findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
      const out = serializeProject(doc);
      if (!out) { res.status(404).json({ error: "Not found" }); return; }
      res.json(out);
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
    }
  });

  // ── GET /perspectives ─────────────────────────────────────────────────────
  r.get("/perspectives", async (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");

    // Serve from in-memory cache when populated
    const cached = getCachedPerspectives();
    if (cached.length > 0) {
      res.json(cached);
      return;
    }

    // Cache empty — go directly to the database
    try {
      const db  = await getDb();
      const raw = await db
        .collection("perspectives")
        .find({ published: true })
        .maxTimeMS(DB_MAX_TIME_MS)
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(DB_LIST_LIMIT)
        .toArray();
      res.json(raw.map((d) => serializePerspective(d)).filter(Boolean));
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
    }
  });

  // ── GET /perspectives/:slug ───────────────────────────────────────────────
  r.get("/perspectives/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
    const slug = String(req.params.slug ?? "").trim();
    if (!slug) { res.status(400).json({ error: "Invalid slug" }); return; }

    // Serve from cache when available
    const hit = getCachedPerspectiveBySlug(slug);
    if (hit) { res.json(hit); return; }

    // Not in cache — query the database directly
    try {
      const db  = await getDb();
      const doc = await db
        .collection("perspectives")
        .findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
      const out = serializePerspective(doc);
      if (!out) { res.status(404).json({ error: "Not found" }); return; }
      res.json(out);
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
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
      const db  = await getDb();
      const now = new Date();
      const doc = {
        name:      String(name).trim(),
        email:     String(email).trim(),
        phone:     phone    ? String(phone).trim()    : "",
        service:   service  ? String(service).trim()  : "",
        message:   String(message).trim(),
        source:    "contact_page",
        createdAt: now,
      };
      const result = await db.collection("contacts").insertOne(doc);
      res.json({ ok: true, id: String(result.insertedId) });
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
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
      const db  = await getDb();
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
            ? (err as { code: number }).code : 0;
        if (code === 11000) { res.json({ ok: true, duplicate: true }); return; }
        throw err;
      }
      res.json({ ok: true });
    } catch (e) {
      const { status, message } = dbError(e);
      res.status(status).json({ error: message });
    }
  });

  // ── GET /news ─────────────────────────────────────────────────────────────
  r.get("/news", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(getCachedNews());
  });

  // ── GET /news/services ────────────────────────────────────────────────────
  r.get("/news/services", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

    const serviceParam =
      typeof req.query.service === "string" ? req.query.service.trim() : "";
    const service = SERVICE_SLUGS.includes(serviceParam as ServiceSlug)
      ? (serviceParam as ServiceSlug)
      : undefined;

    const cached   = getCachedNews();
    const filtered = filterServiceNews(cached.articles as NewsArticle[], service).slice(0, 12);

    res.json({ ...cached, articles: filtered, service: service ?? null });
  });

  return r;
}
