import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getAdminJwtSecret } from "../config/adminAuthConfig";

export const requireAdmin: RequestHandler = (req, res, next) => {
  const secret = getAdminJwtSecret();
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(header.slice(7), secret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
