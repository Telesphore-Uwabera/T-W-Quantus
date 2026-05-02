import { Router } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { requireAdmin } from "../middleware/adminAuth";
import { slugify } from "../lib/slug";
import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload";
import { getAdminEmail, getAdminJwtSecret, getAdminPassword } from "../config/adminAuthConfig";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function parseBool(v: unknown): boolean {
  return v === true || v === "true" || v === "1";
}

export function createAdminApiRouter() {
  const r = Router();

  r.post("/login", (req, res) => {
    const emailIn = String(req.body?.email ?? "").trim().toLowerCase();
    const passwordIn = req.body?.password;
    const emailOk = emailIn === getAdminEmail();
    const passwordOk = typeof passwordIn === "string" && passwordIn === getAdminPassword();
    if (!emailOk || !passwordOk) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign({ role: "admin", sub: getAdminEmail() }, getAdminJwtSecret(), { expiresIn: "8h" });
    res.json({ token });
  });

  r.use(requireAdmin);

  r.get("/projects", async (_req, res) => {
    try {
      const db = await getDb();
      const list = await db.collection("projects").find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray();
      res.json(
        list.map((doc) => ({
          ...doc,
          _id: String(doc._id),
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
          updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
        })),
      );
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  r.post("/projects", upload.single("image"), async (req, res) => {
    try {
      const title = req.body?.title;
      const summary = req.body?.summary;
      if (!title || !summary) {
        res.status(400).json({ error: "title and summary are required" });
        return;
      }
      const slug = (req.body?.slug && String(req.body.slug)) || slugify(String(title));
      const sector = req.body?.sector ? String(req.body.sector) : "";
      const published = parseBool(req.body?.published);
      const sortOrder = Number(req.body?.sortOrder) || 0;
      let imageUrl = req.body?.imageUrl ? String(req.body.imageUrl) : "";
      if (req.file?.buffer) {
        imageUrl = await uploadBufferToCloudinary(req.file.buffer, "tw-quantus/projects");
      }
      const db = await getDb();
      const exists = await db.collection("projects").findOne({ slug });
      if (exists) {
        res.status(409).json({ error: "Slug already exists" });
        return;
      }
      const now = new Date();
      const doc = {
        title: String(title).trim(),
        slug,
        summary: String(summary).trim(),
        sector,
        imageUrl,
        published,
        sortOrder,
        createdAt: now,
        updatedAt: now,
      };
      const ins = await db.collection("projects").insertOne(doc);
      res.json({
        ...doc,
        _id: String(ins.insertedId),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error: msg });
    }
  });

  r.patch("/projects/:id", upload.single("image"), async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const db = await getDb();
      const existing = await db.collection("projects").findOne({ _id: new ObjectId(id) });
      if (!existing) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const updates: Record<string, unknown> = { updatedAt: new Date() };
      if (req.body?.title != null) updates.title = String(req.body.title).trim();
      if (req.body?.summary != null) updates.summary = String(req.body.summary).trim();
      if (req.body?.sector != null) updates.sector = String(req.body.sector);
      if (req.body?.published != null) updates.published = parseBool(req.body.published);
      if (req.body?.sortOrder != null) updates.sortOrder = Number(req.body.sortOrder) || 0;
      if (req.body?.slug != null) {
        const newSlug = String(req.body.slug);
        if (newSlug !== existing.slug) {
          const clash = await db.collection("projects").findOne({ slug: newSlug });
          if (clash) {
            res.status(409).json({ error: "Slug already in use" });
            return;
          }
          updates.slug = newSlug;
        }
      }
      if (req.file?.buffer) {
        updates.imageUrl = await uploadBufferToCloudinary(req.file.buffer, "tw-quantus/projects");
      } else if (req.body?.imageUrl != null) {
        updates.imageUrl = String(req.body.imageUrl);
      }
      await db.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: updates });
      const next = await db.collection("projects").findOne({ _id: new ObjectId(id) });
      res.json({
        ...next,
        _id: String(next?._id),
        createdAt: next?.createdAt instanceof Date ? next.createdAt.toISOString() : next?.createdAt,
        updatedAt: next?.updatedAt instanceof Date ? next.updatedAt.toISOString() : next?.updatedAt,
      });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  r.delete("/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const db = await getDb();
      const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  r.get("/contacts", async (_req, res) => {
    try {
      const db = await getDb();
      const list = await db.collection("contacts").find({}).sort({ createdAt: -1 }).limit(500).toArray();
      res.json(
        list.map((doc) => ({
          ...doc,
          _id: String(doc._id),
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
        })),
      );
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  r.get("/subscriptions", async (_req, res) => {
    try {
      const db = await getDb();
      const list = await db.collection("subscriptions").find({}).sort({ createdAt: -1 }).limit(500).toArray();
      res.json(
        list.map((doc) => ({
          ...doc,
          _id: String(doc._id),
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
        })),
      );
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  return r;
}
