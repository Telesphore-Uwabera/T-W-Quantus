/**
 * dataCache.ts — Background in-memory cache for all public data.
 *
 * Polls MongoDB (projects + perspectives) and NewsAPI continuously so every
 * HTTP request — list pages AND individual detail pages — is served from RAM
 * with zero DB round-trip. The first fetch runs immediately on server boot,
 * meaning data is ready before any visitor arrives.
 *
 * Two snapshots per collection:
 *   _projectsList / _perspectivesList  — lightweight list projection (home + grid pages)
 *   _projectsBySlug / _perspectivesBySlug — full documents (detail pages)
 *
 * Intervals:
 *   projects / perspectives  — every 2 minutes
 *   news                     — every 5 minutes  (NewsAPI rate-limit friendly)
 *
 * Stale protection: if a refresh fails, the previous good snapshot is kept
 * and an error is logged. Callers always see the last known-good data.
 */

import { getDb } from "../db/mongo";
import { serializeProject, serializePerspective } from "./projectDoc";
import type { ProjectDoc, PerspectiveDoc } from "../../shared/cms";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source?: string;
};

export type NewsPayload = {
  articles: NewsArticle[];
  configured: boolean;
  cached?: boolean;
};

// ─── Intervals ────────────────────────────────────────────────────────────────

const DB_POLL_INTERVAL_MS   = 2 * 60 * 1000; // 2 min
const NEWS_POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 min
const DB_MAX_TIME_MS        = 12000;
const PUBLIC_LIST_LIMIT     = 100;
const NEWS_API_TIMEOUT_MS   = 8000;

// ─── In-memory snapshots ──────────────────────────────────────────────────────

// Lists  (lightweight — used by home page / grid pages)
let _projectsList:     ProjectDoc[]     = [];
let _perspectivesList: PerspectiveDoc[] = [];

// Slug maps  (full documents — used by detail pages)
let _projectsBySlug:     Map<string, ProjectDoc>     = new Map();
let _perspectivesBySlug: Map<string, PerspectiveDoc> = new Map();

// News
let _news:    NewsPayload = { articles: [], configured: false };

// Timestamps
let _projectsAt:     number = 0;
let _perspectivesAt: number = 0;
let _newsAt:         number = 0;

// ─── Public read accessors ────────────────────────────────────────────────────

/** Lightweight list — home page & portfolio grid */
export function getCachedProjects():     ProjectDoc[]     { return _projectsList; }
export function getCachedPerspectives(): PerspectiveDoc[] { return _perspectivesList; }

/** Full document by slug — detail pages. Returns undefined if not yet cached. */
export function getCachedProjectBySlug(slug: string):     ProjectDoc     | undefined { return _projectsBySlug.get(slug); }
export function getCachedPerspectiveBySlug(slug: string): PerspectiveDoc | undefined { return _perspectivesBySlug.get(slug); }

export function getCachedNews(): NewsPayload { return _news; }

export function cacheAges() {
  const now = Date.now();
  return {
    projectsAgeMs:     now - _projectsAt,
    perspectivesAgeMs: now - _perspectivesAt,
    newsAgeMs:         now - _newsAt,
  };
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function refreshProjects(): Promise<void> {
  const db = await getDb();

  // Full documents for the slug map (detail pages need description, clientName, etc.)
  const rawFull = await db
    .collection("projects")
    .find({ published: true })
    .maxTimeMS(DB_MAX_TIME_MS)
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(PUBLIC_LIST_LIMIT)
    .toArray();

  const full = rawFull
    .map((d) => serializeProject(d))
    .filter((d): d is ProjectDoc => d !== null);

  // Lightweight list (subset of fields) for the list/home page
  const list: ProjectDoc[] = full.map((p) => ({
    _id:       p._id,
    title:     p.title,
    slug:      p.slug,
    summary:   p.summary,
    location:  p.location,
    sector:    p.sector,
    year:      p.year,
    imageUrl:  p.imageUrl,
    imageUrls: p.imageUrls,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt,
    startDate: p.startDate,
    published: p.published,
    // detail fields left undefined — keeps list payload small
  } as ProjectDoc));

  // Rebuild slug map
  const map = new Map<string, ProjectDoc>();
  for (const p of full) map.set(p.slug, p);

  _projectsList   = list;
  _projectsBySlug = map;
  _projectsAt     = Date.now();
  console.log(`[cache] projects refreshed — ${full.length} items`);
}

async function refreshPerspectives(): Promise<void> {
  const db = await getDb();

  // Full documents (content field needed for detail pages)
  const rawFull = await db
    .collection("perspectives")
    .find({ published: true })
    .maxTimeMS(DB_MAX_TIME_MS)
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(PUBLIC_LIST_LIMIT)
    .toArray();

  const full = rawFull
    .map((d) => serializePerspective(d))
    .filter((d): d is PerspectiveDoc => d !== null);

  // Lightweight list for grid/home page
  const list: PerspectiveDoc[] = full.map((p) => ({
    _id:       p._id,
    title:     p.title,
    slug:      p.slug,
    summary:   p.summary,
    category:  p.category,
    date:      p.date,
    imageUrl:  p.imageUrl,
    imageUrls: p.imageUrls,
    createdAt: p.createdAt,
    published: p.published,
    sortOrder: p.sortOrder,
    // content left out of list payload
  } as PerspectiveDoc));

  // Rebuild slug map
  const map = new Map<string, PerspectiveDoc>();
  for (const p of full) map.set(p.slug, p);

  _perspectivesList   = list;
  _perspectivesBySlug = map;
  _perspectivesAt     = Date.now();
  console.log(`[cache] perspectives refreshed — ${full.length} items`);
}

async function refreshNews(): Promise<void> {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    _news = { articles: [], configured: false };
    return;
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NEWS_API_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
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
      .filter((a) => a.urlToImage && a.urlToImage.startsWith("http"))
      .map((a) => ({
        title:       a.title,
        description: a.description ?? "",
        url:         a.url,
        urlToImage:  a.urlToImage,
        publishedAt: a.publishedAt,
        source:      a.source?.name,
      }));

    _news   = { articles, configured: true };
    _newsAt = Date.now();
    console.log(`[cache] news refreshed — ${articles.length} articles`);
  } finally {
    clearTimeout(timer);
  }
}

// ─── Resilient wrappers (keep stale data on error) ───────────────────────────

async function safeRefreshProjects(): Promise<void> {
  try {
    await refreshProjects();
  } catch (err) {
    console.error("[cache] projects refresh failed:", err instanceof Error ? err.message : err);
  }
}

async function safeRefreshPerspectives(): Promise<void> {
  try {
    await refreshPerspectives();
  } catch (err) {
    console.error("[cache] perspectives refresh failed:", err instanceof Error ? err.message : err);
  }
}

async function safeRefreshNews(): Promise<void> {
  try {
    await refreshNews();
  } catch (err) {
    console.error("[cache] news refresh failed:", err instanceof Error ? err.message : err);
  }
}

// ─── Startup ──────────────────────────────────────────────────────────────────

let _started = false;

/**
 * Call once after the server starts listening.
 * Runs an immediate full refresh then schedules continuous background polling.
 */
export function startDataCache(): void {
  if (_started) return;
  _started = true;

  console.log("[cache] starting background data cache...");

  // Immediate warm-up — all three in parallel
  void Promise.all([
    safeRefreshProjects(),
    safeRefreshPerspectives(),
    safeRefreshNews(),
  ]).then(() => {
    console.log("[cache] initial warm-up complete ✓");
  });

  // Continuous background polling
  setInterval(safeRefreshProjects,     DB_POLL_INTERVAL_MS);
  setInterval(safeRefreshPerspectives, DB_POLL_INTERVAL_MS);
  setInterval(safeRefreshNews,         NEWS_POLL_INTERVAL_MS);

  console.log(
    `[cache] polling: projects+perspectives every ${DB_POLL_INTERVAL_MS / 1000}s, ` +
    `news every ${NEWS_POLL_INTERVAL_MS / 1000}s`,
  );
}

/**
 * Force an immediate refresh. Called by admin routes after create/update/delete
 * so published changes appear on the site within milliseconds.
 */
export async function invalidateCache(
  target: "projects" | "perspectives" | "news" | "all" = "all",
): Promise<void> {
  const jobs: Promise<void>[] = [];
  if (target === "projects"     || target === "all") jobs.push(safeRefreshProjects());
  if (target === "perspectives" || target === "all") jobs.push(safeRefreshPerspectives());
  if (target === "news"         || target === "all") jobs.push(safeRefreshNews());
  await Promise.all(jobs);
}
