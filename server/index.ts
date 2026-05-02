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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  void initIndexes();

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.use("/api", createPublicApiRouter());
  app.use("/api/admin", createAdminApiRouter());

  return app;
}
