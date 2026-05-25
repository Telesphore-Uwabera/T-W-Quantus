import { Router } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { requireAdmin } from "../middleware/adminAuth";
import { slugify } from "../lib/slug";
import { uploadProjectImageToCloudinary } from "../lib/cloudinaryUpload";
import { getAdminEmail, getAdminJwtSecret, getAdminPassword } from "../config/adminAuthConfig";
import { galleryFromDoc, serializeProject, serializePerspective } from "../lib/projectDoc";
import { isValidProjectSector } from "../../shared/cms";

const projectUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 28 },
});

function collectProjectImageFiles(files: Record<string, Express.Multer.File[]> | undefined): Express.Multer.File[] {
  if (!files) return [];
  const multi = files.images ?? [];
  const legacy = files.image?.[0] ? [files.image[0]] : [];
  return [...multi, ...legacy];
}

async function uploadGalleryFiles(files: Express.Multer.File[]): Promise<string[]> {
  return Promise.all(
    files.map((f) => uploadProjectImageToCloudinary(f.buffer, f.mimetype, "tw-quantus/projects")),
  );
}

function parseBool(v: unknown): boolean {
  return v === true || v === "true" || v === "1";
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object") {
    if ("message" in e && typeof (e as any).message === "string") {
      return (e as any).message;
    }
    try {
      return JSON.stringify(e);
    } catch {
      // fallback
    }
  }
  return String(e);
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
      res.json(list.map((doc) => serializeProject(doc)).filter(Boolean));
    } catch (e) {
      res.status(500).json({ error: getErrorMessage(e) });
    }
  });

  r.post(
    "/projects",
    projectUpload.fields([
      { name: "images", maxCount: 24 },
      { name: "image", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const title = req.body?.title;
        const summary = req.body?.summary;
        if (!title || !summary) {
          res.status(400).json({ error: "title and summary are required" });
          return;
        }
        const slug = (req.body?.slug && String(req.body.slug)) || slugify(String(title));
        const sector = req.body?.sector != null ? String(req.body.sector).trim() : "";
        if (!isValidProjectSector(sector)) {
          res.status(400).json({ error: "sector is required and must be a valid option" });
          return;
        }
        const description = req.body?.description != null ? String(req.body.description).trim() : "";
        const location = req.body?.location != null ? String(req.body.location).trim() : "";
        const clientName = req.body?.clientName != null ? String(req.body.clientName).trim() : "";
        const year = req.body?.year != null ? String(req.body.year).trim() : "";
        const projectDate =
          req.body?.projectDate != null ? String(req.body.projectDate).trim().slice(0, 10) : "";
        const startDate =
          req.body?.startDate != null ? String(req.body.startDate).trim().slice(0, 10) : "";
        const endDate =
          req.body?.endDate != null ? String(req.body.endDate).trim().slice(0, 10) : "";
        const published = parseBool(req.body?.published);
        const sortOrder = Number(req.body?.sortOrder) || 0;
        const imageFiles = collectProjectImageFiles(req.files as Record<string, Express.Multer.File[]> | undefined);
        let imageUrls = await uploadGalleryFiles(imageFiles);
        if (imageUrls.length === 0 && req.body?.imageUrl) {
          const u = String(req.body.imageUrl).trim();
          if (u) imageUrls = [u];
        }
        const imageUrl = imageUrls[0] ?? "";
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
          ...(description ? { description } : {}),
          ...(location ? { location } : {}),
          ...(clientName ? { clientName } : {}),
          ...(year ? { year } : {}),
          ...(projectDate ? { projectDate } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
          imageUrls,
          imageUrl,
          published,
          sortOrder,
          createdAt: now,
          updatedAt: now,
        };
        const ins = await db.collection("projects").insertOne(doc);
        const inserted = await db.collection("projects").findOne({ _id: ins.insertedId });
        const out = serializeProject(inserted);
        if (!out) {
          res.status(500).json({ error: "Insert failed" });
          return;
        }
        res.json(out);
      } catch (e) {
        res.status(500).json({ error: getErrorMessage(e) });
      }
    },
  );

  r.patch(
    "/projects/:id",
    projectUpload.fields([
      { name: "images", maxCount: 24 },
      { name: "image", maxCount: 1 },
    ]),
    async (req, res) => {
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
        if (req.body?.sector != null) {
          const s = String(req.body.sector).trim();
          if (!isValidProjectSector(s)) {
            res.status(400).json({ error: "sector must be a valid option" });
            return;
          }
          updates.sector = s;
        }
        if (req.body?.description != null) updates.description = String(req.body.description).trim();
        if (req.body?.location != null) updates.location = String(req.body.location).trim();
        if (req.body?.clientName != null) updates.clientName = String(req.body.clientName).trim();
        if (req.body?.year != null) updates.year = String(req.body.year).trim();
        if (req.body?.projectDate != null)
          updates.projectDate = String(req.body.projectDate).trim().slice(0, 10);
        if (req.body?.startDate != null)
          updates.startDate = String(req.body.startDate).trim().slice(0, 10);
        if (req.body?.endDate != null)
          updates.endDate = String(req.body.endDate).trim().slice(0, 10);
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

        const newFiles = collectProjectImageFiles(req.files as Record<string, Express.Multer.File[]> | undefined);
        const hasExistingKey =
          req.body != null && Object.prototype.hasOwnProperty.call(req.body, "existingImageUrls");

        if (hasExistingKey) {
          let nextUrls: string[] = [];
          try {
            const parsed = JSON.parse(String(req.body.existingImageUrls ?? "[]"));
            if (Array.isArray(parsed)) nextUrls = parsed.map(String).filter(Boolean);
          } catch {
            nextUrls = [...galleryFromDoc(existing as Record<string, unknown>)];
          }
          if (newFiles.length) {
            const uploaded = await uploadGalleryFiles(newFiles);
            nextUrls = [...nextUrls, ...uploaded];
          }
          updates.imageUrls = nextUrls;
          updates.imageUrl = nextUrls[0] ?? "";
        } else if (newFiles.length) {
          const uploaded = await uploadGalleryFiles(newFiles);
          const base = galleryFromDoc(existing as Record<string, unknown>);
          const merged = [...base, ...uploaded];
          updates.imageUrls = merged;
          updates.imageUrl = merged[0] ?? "";
        } else if (req.body?.imageUrl != null) {
          const u = String(req.body.imageUrl).trim();
          updates.imageUrl = u;
          updates.imageUrls = u ? [u] : [];
        }

        await db.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: updates });
        const next = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        const out = serializeProject(next);
        if (!out) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        res.json(out);
      } catch (e) {
        res.status(500).json({ error: getErrorMessage(e) });
      }
    },
  );

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
      res.status(500).json({ error: getErrorMessage(e) });
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
      res.status(500).json({ error: getErrorMessage(e) });
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
      res.status(500).json({ error: getErrorMessage(e) });
    }
  });

  // --- Perspectives ---
  r.get("/perspectives", async (_req, res) => {
    try {
      const db = await getDb();
      const list = await db.collection("perspectives").find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray();
      res.json(list.map((doc) => serializePerspective(doc)).filter(Boolean));
    } catch (e) {
      res.status(500).json({ error: getErrorMessage(e) });
    }
  });

  r.post(
    "/perspectives",
    projectUpload.fields([
      { name: "images", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const title = req.body?.title;
        const summary = req.body?.summary;
        const category = req.body?.category || "Insight";
        if (!title || !summary) {
          res.status(400).json({ error: "title and summary are required" });
          return;
        }
        const slug = (req.body?.slug && String(req.body.slug)) || slugify(String(title));
        const content = req.body?.content != null ? String(req.body.content).trim() : "";
        const date = req.body?.date != null ? String(req.body.date).trim() : new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
        const published = parseBool(req.body?.published);
        const sortOrder = Number(req.body?.sortOrder) || 0;
        
        const imageFiles = collectProjectImageFiles(req.files as Record<string, Express.Multer.File[]> | undefined);
        let imageUrl = "";
        if (imageFiles.length) {
          imageUrl = await uploadProjectImageToCloudinary(imageFiles[0].buffer, imageFiles[0].mimetype, "tw-quantus/perspectives");
        } else if (req.body?.imageUrl) {
          imageUrl = String(req.body.imageUrl).trim();
        }

        const db = await getDb();
        const exists = await db.collection("perspectives").findOne({ slug });
        if (exists) {
          res.status(409).json({ error: "Slug already exists" });
          return;
        }
        const now = new Date();
        const doc = {
          title: String(title).trim(),
          slug,
          summary: String(summary).trim(),
          category,
          content,
          date,
          imageUrl,
          published,
          sortOrder,
          createdAt: now,
          updatedAt: now,
        };
        const ins = await db.collection("perspectives").insertOne(doc);
        const inserted = await db.collection("perspectives").findOne({ _id: ins.insertedId });
        res.json(serializePerspective(inserted));
      } catch (e) {
        res.status(500).json({ error: getErrorMessage(e) });
      }
    },
  );

  r.patch(
    "/perspectives/:id",
    projectUpload.fields([
      { name: "images", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          res.status(400).json({ error: "Invalid id" });
          return;
        }
        const db = await getDb();
        const existing = await db.collection("perspectives").findOne({ _id: new ObjectId(id) });
        if (!existing) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        const updates: Record<string, unknown> = { updatedAt: new Date() };
        if (req.body?.title != null) updates.title = String(req.body.title).trim();
        if (req.body?.summary != null) updates.summary = String(req.body.summary).trim();
        if (req.body?.category != null) updates.category = String(req.body.category).trim();
        if (req.body?.content != null) updates.content = String(req.body.content).trim();
        if (req.body?.date != null) updates.date = String(req.body.date).trim();
        if (req.body?.published != null) updates.published = parseBool(req.body.published);
        if (req.body?.sortOrder != null) updates.sortOrder = Number(req.body.sortOrder) || 0;
        
        if (req.body?.slug != null) {
          const newSlug = String(req.body.slug);
          if (newSlug !== existing.slug) {
            const clash = await db.collection("perspectives").findOne({ slug: newSlug });
            if (clash) {
              res.status(409).json({ error: "Slug already in use" });
              return;
            }
            updates.slug = newSlug;
          }
        }

        const newFiles = collectProjectImageFiles(req.files as Record<string, Express.Multer.File[]> | undefined);
        if (newFiles.length) {
          updates.imageUrl = await uploadProjectImageToCloudinary(newFiles[0].buffer, newFiles[0].mimetype, "tw-quantus/perspectives");
        } else if (req.body?.imageUrl != null) {
          updates.imageUrl = String(req.body.imageUrl).trim();
        }

        await db.collection("perspectives").updateOne({ _id: new ObjectId(id) }, { $set: updates });
        const next = await db.collection("perspectives").findOne({ _id: new ObjectId(id) });
        res.json(serializePerspective(next));
      } catch (e) {
        res.status(500).json({ error: getErrorMessage(e) });
      }
    },
  );

  r.delete("/perspectives/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const db = await getDb();
      await db.collection("perspectives").deleteOne({ _id: new ObjectId(id) });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: getErrorMessage(e) });
    }
  });

  return r;
}
