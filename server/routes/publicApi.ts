import { Router } from "express";
import { getDb } from "../db/mongo";

const NEWS_CACHE_MS = 15 * 60 * 1000;
let newsCache: { at: number; articles: unknown[] } | null = null;

async function loadNews() {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return { articles: [], configured: false as const };
  }
  if (newsCache && Date.now() - newsCache.at < NEWS_CACHE_MS) {
    return { articles: newsCache.articles, configured: true as const, cached: true as const };
  }
  const q = [
    "construction management",
    "quantity surveying",
    "civil engineering",
    "building construction",
    "infrastructure Africa",
  ].join(" OR ");
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "12");
  url.searchParams.set("apiKey", key);
  const res = await fetch(url.toString());
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
  const articles = (data.articles ?? []).map((a) => ({
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
    try {
      const db = await getDb();
      const list = await db
        .collection("projects")
        .find({ published: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .toArray();
      res.json(
        list.map((doc) => ({
          ...doc,
          _id: String(doc._id),
          createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
          updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
        })),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("MONGODB_URI")) {
        res.status(503).json({ error: "Database not configured", items: [] });
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

  return r;
}
