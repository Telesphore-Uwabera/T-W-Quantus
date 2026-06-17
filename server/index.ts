import "./loadEnv";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initIndexes } from "./db/mongo";
import { createPublicApiRouter } from "./routes/publicApi";
import { createAdminApiRouter } from "./routes/adminApi";

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

  app.get("/api/demo", handleDemo);

  app.use("/api", createPublicApiRouter());
  app.use("/api/admin", createAdminApiRouter());

  return app;
}
