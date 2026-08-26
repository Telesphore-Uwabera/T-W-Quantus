import "./loadEnv";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initIndexes } from "./db/mongo";
import { createPublicApiRouter } from "./routes/publicApi";
import { createAdminApiRouter } from "./routes/adminApi";
import { getCachedProjects, getCachedPerspectives, getCachedNews, cacheAges } from "./lib/dataCache";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use("/api", (req, res, next) => {
    const timeoutMs = 15000;
    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({ error: "Request timed out" });
      }
    });
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize indexes asynchronously without blocking server startup
  void initIndexes().catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[mongo] initIndexes warning: ${msg}`);
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/health", (_req, res) => {
    const ages = cacheAges();
    const projects = getCachedProjects();
    const perspectives = getCachedPerspectives();
    const news = getCachedNews();

    const TWO_MIN_MS = 2 * 60 * 1000;
    const FIVE_MIN_MS = 5 * 60 * 1000;

    // A cache is "stale" if it's never been populated (age is very large) or
    // older than its expected refresh interval × 2 (allows for one missed poll).
    const projectsStale   = ages.projectsAgeMs     === 0 || ages.projectsAgeMs     > TWO_MIN_MS  * 2;
    const perspectivesStale = ages.perspectivesAgeMs === 0 || ages.perspectivesAgeMs > TWO_MIN_MS  * 2;
    const newsStale       = ages.newsAgeMs          === 0 || ages.newsAgeMs          > FIVE_MIN_MS * 2;

    const status = projectsStale || perspectivesStale ? "degraded" : "ok";

    res.status(status === "ok" ? 200 : 207).json({
      status,
      cache: {
        projects: {
          count:    projects.length,
          ageMs:    ages.projectsAgeMs,
          stale:    projectsStale,
        },
        perspectives: {
          count:    perspectives.length,
          ageMs:    ages.perspectivesAgeMs,
          stale:    perspectivesStale,
        },
        news: {
          count:      news.articles.length,
          configured: news.configured,
          ageMs:      ages.newsAgeMs,
          stale:      newsStale,
        },
      },
      uptime: process.uptime(),
    });
  });

  app.get("/api/demo", handleDemo);

  app.use("/api", createPublicApiRouter());
  app.use("/api/admin", createAdminApiRouter());

  return app;
}
