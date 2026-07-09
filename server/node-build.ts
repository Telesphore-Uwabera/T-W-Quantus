import path from "node:path";
import { createServer } from "./index";
import * as express from "express";
import { startDataCache } from "./lib/dataCache";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes (Express 5: named wildcard, not "*")
app.get("/{*splat}", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);

  // ── Background data cache: warm-up + continuous polling ───────────────────
  // Projects + perspectives refresh every 2 min, news every 5 min.
  // Data is ready in RAM before any visitor arrives — zero cold-start delay.
  startDataCache();

  // ── Keep-alive: self-ping every 14 min to prevent Render free tier sleep ──
  // (Slightly under 15 min so Render doesn't kill the instance between pings)
  const PING_INTERVAL_MS = 14 * 60 * 1000;
  const selfPingUrl = `http://localhost:${port}/api/ping`;

  setInterval(async () => {
    try {
      const res = await fetch(selfPingUrl);
      console.log(`[keep-alive] self-ping → ${res.status}`);
    } catch (err) {
      console.warn(`[keep-alive] self-ping failed:`, err);
    }
  }, PING_INTERVAL_MS);

  console.log(
    `⏰ Keep-alive self-ping scheduled every 15 min → ${selfPingUrl}`,
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
