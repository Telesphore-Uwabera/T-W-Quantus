import { Router } from "express";
import { getDb } from "../db/mongo";
import { serializeProject, serializePerspective } from "../lib/projectDoc";

const NEWS_CACHE_MS = 5 * 60 * 1000;
const API_TIMEOUT_MS = 3000;
const DB_MAX_TIME_MS = 12000;
const PUBLIC_LIST_LIMIT = 100;
let newsCache: { at: number; articles: unknown[] } | null = null;

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source?: string;
};

type ServiceSlug =
  | "quantity-surveying"
  | "construction-management"
  | "project-management"
  | "construction-technical-services";

const SERVICE_NEWS_KEYWORDS: Record<ServiceSlug, string[]> = {
  "quantity-surveying": [
    "quantity surveying",
    "cost plan",
    "cost planning",
    "cost estimate",
    "cost control",
    "bill of quantities",
    "boq",
    "final account",
    "variation",
    "valuation",
    "measurement",
  ],
  "construction-management": [
    "construction management",
    "site supervision",
    "site coordination",
    "quality assurance",
    "quality control",
    "hse",
    "health and safety",
    "safety",
    "program",
    "programme",
    "schedule",
    "milestone",
  ],
  "project-management": [
    "project management",
    "feasibility",
    "stakeholder",
    "procurement",
    "tender",
    "contract",
    "risk management",
    "commissioning",
    "handover",
  ],
  "construction-technical-services": [
    "construction",
    "civil",
    "structural",
    "infrastructure",
    "mep",
    "mechanical",
    "electrical",
    "hvac",
    "plumbing",
    "fire system",
    "renovation",
    "repairs",
    "fit-out",
    "materials",
    "building",
    "architecture",
    "engineering",
    "urban development",
    "real estate",
    "housing",
  ],
};

const SERVICE_SLUGS = Object.keys(SERVICE_NEWS_KEYWORDS) as ServiceSlug[];

function normalizeText(v: unknown): string {
  if (!v || typeof v !== "string") return "";
  return v.toLowerCase();
}

function matchesAny(text: string, needles: string[]): boolean {
  if (!text) return false;
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

async function fetchWithTimeout(input: string, init?: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: init?.signal ?? controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function loadNews() {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return { articles: [], configured: false as const };
  }
  if (newsCache && Date.now() - newsCache.at < NEWS_CACHE_MS) {
    return { articles: newsCache.articles, configured: true as const, cached: true as const };
  }
  const q = [
    "construction industry",
    "quantity surveying",
    "civil engineering",
    "infrastructure project",
    "building development Africa",
    "real estate Rwanda",
    "construction management",
  ].join(" OR ");
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "100");
  url.searchParams.set("apiKey", key);
  const res = await fetchWithTimeout(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI ${res.status}: ${text}`);
  }
  const data = (await res.json()) as {
    articles?: Array<{
      title: string;
      description?: string;
      url: string;
      urlToImage?: string;
      publishedAt: string;
      source?: { name?: string };
    }>;
  };
  const articles: NewsArticle[] = (data.articles ?? [])
    .filter(a => a.urlToImage && a.urlToImage.startsWith('http')) // Only articles with images
    .map((a) => ({
      title: a.title,
      description: a.description ?? "",
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: a.source?.name,
    }));
  newsCache = { at: Date.now(), articles };
  return { articles, configured: true as const };
}

export function createPublicApiRouter() {
  const r = Router();

  r.get("/projects", async (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    try {
      const db = await getDb();
      const list = await db
        .collection("projects")
        .find({ published: true })
        .project({ title: 1, slug: 1, summary: 1, location: 1, sector: 1, year: 1, imageUrl: 1, imageUrls: 1, sortOrder: 1, createdAt: 1, startDate: 1, published: 1 })
        .maxTimeMS(DB_MAX_TIME_MS)
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(PUBLIC_LIST_LIMIT)
        .toArray();
      res.json(list.map((doc) => serializeProject(doc)).filter(Boolean));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured" });
        return;
      }
      if (msg.includes("timed out") || msg.includes("MongoServerSelection") || msg.includes("ECONNREFUSED")) {
        res.status(503).json({ error: "Database temporarily unavailable. Please retry." });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  r.get("/projects/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    try {
      const slug = String(req.params.slug ?? "").trim();
      if (!slug) {
        res.status(400).json({ error: "Invalid slug" });
        return;
      }
      const db = await getDb();
      const doc = await db.collection("projects").findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
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

  r.get("/perspectives", async (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    try {
      const db = await getDb();
      const list = await db
        .collection("perspectives")
        .find({ published: true })
        .project({ title: 1, slug: 1, summary: 1, category: 1, date: 1, imageUrl: 1, imageUrls: 1, createdAt: 1, published: 1 })
        .maxTimeMS(DB_MAX_TIME_MS)
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(PUBLIC_LIST_LIMIT)
        .toArray();
      res.json(list.map((doc) => serializePerspective(doc)).filter(Boolean));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured" });
        return;
      }
      if (msg.includes("timed out") || msg.includes("MongoServerSelection") || msg.includes("ECONNREFUSED")) {
        res.status(503).json({ error: "Database temporarily unavailable. Please retry." });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

  r.get("/perspectives/:slug", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    try {
      const slug = String(req.params.slug ?? "").trim();
      if (!slug) {
        res.status(400).json({ error: "Invalid slug" });
        return;
      }
      const db = await getDb();
      const doc = await db.collection("perspectives").findOne({ slug, published: true }, { maxTimeMS: DB_MAX_TIME_MS });
      const out = serializePerspective(doc);
      if (!out) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(out);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Return 503 Service Unavailable on database errors instead of 500
      if (msg.includes("MONGODB_URI") || msg.includes("timed out") || msg.includes("MongoServerSelection")) {
        res.status(503).json({ error: "Database temporarily unavailable" });
        return;
      }
      res.status(500).json({ error: msg });
    }
  });

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
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : "",
        service: service ? String(service).trim() : "",
        message: String(message).trim(),
        source: "contact_page",
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
          email: email.trim().toLowerCase(),
          source: "footer_newsletter",
          createdAt: now,
        });
      } catch (err: unknown) {
        const code = err && typeof err === "object" && "code" in err ? (err as { code: number }).code : 0;
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

  r.get("/news", async (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    try {
      const result = await loadNews();
      res.json(result);
    } catch (e) {
      res.status(502).json({
        error: e instanceof Error ? e.message : String(e),
        articles: [],
        configured: !!process.env.NEWS_API_KEY,
      });
    }
  });

  /**
   * Service-related news only (used by Perspectives & News).
   * Optional `?service=<slug>` further narrows the feed to a single service pillar.
   */
  r.get("/news/services", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    try {
      const serviceParam = typeof req.query.service === "string" ? req.query.service.trim() : "";
      const service = (SERVICE_SLUGS.includes(serviceParam as ServiceSlug)
        ? (serviceParam as ServiceSlug)
        : undefined);

      const result = await loadNews();
      const articles = (result.articles as NewsArticle[] | undefined) ?? [];
      const filtered = filterServiceNews(articles, service).slice(0, 12);

      res.json({
        ...result,
        articles: filtered,
        service: service ?? null,
      });
    } catch (e) {
      res.status(502).json({
        error: e instanceof Error ? e.message : String(e),
        articles: [],
        configured: !!process.env.NEWS_API_KEY,
        service: null,
      });
    }
  });

  return r;
}
