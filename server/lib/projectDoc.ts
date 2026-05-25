import type { Document } from "mongodb";
import type { ProjectDoc } from "../../shared/cms";

export function galleryFromDoc(doc: Record<string, unknown>): string[] {
  const fromArray = Array.isArray(doc.imageUrls)
    ? doc.imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  if (fromArray.length) return fromArray;
  const legacy = doc.imageUrl;
  if (typeof legacy === "string" && legacy.trim()) return [legacy.trim()];
  return [];
}

export function serializeProject(doc: Document | null | undefined): ProjectDoc | null {
  if (!doc?._id) return null;
  const g = galleryFromDoc(doc as Record<string, unknown>);
  const d = doc as Record<string, unknown>;
  return {
    _id: String(doc._id),
    title: String(d.title ?? ""),
    slug: String(d.slug ?? ""),
    summary: String(d.summary ?? ""),
    description: d.description != null && String(d.description).trim() ? String(d.description).trim() : undefined,
    sector: d.sector != null && String(d.sector).trim() ? String(d.sector).trim() : undefined,
    location: d.location != null && String(d.location).trim() ? String(d.location).trim() : undefined,
    clientName: d.clientName != null && String(d.clientName).trim() ? String(d.clientName).trim() : undefined,
    year: d.year != null && String(d.year).trim() ? String(d.year).trim() : undefined,
    startDate:
      d.startDate != null && String(d.startDate).trim() ? String(d.startDate).trim().slice(0, 10) : undefined,
    endDate:
      d.endDate != null && String(d.endDate).trim() ? String(d.endDate).trim().slice(0, 10) : undefined,
    imageUrls: g.length ? g : undefined,
    imageUrl: g[0],
    published: !!d.published,
    sortOrder: Number(d.sortOrder) || 0,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(d.createdAt ?? ""),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(d.updatedAt ?? ""),
  };
}

import type { PerspectiveDoc } from "../../shared/cms";

export function serializePerspective(doc: Document | null | undefined): PerspectiveDoc | null {
  if (!doc?._id) return null;
  const d = doc as Record<string, unknown>;
  return {
    _id: String(doc._id),
    title: String(d.title ?? ""),
    slug: String(d.slug ?? ""),
    summary: String(d.summary ?? ""),
    content: d.content != null && String(d.content).trim() ? String(d.content).trim() : undefined,
    category: String(d.category ?? ""),
    date: String(d.date ?? ""),
    imageUrls: galleryFromDoc(d).length ? galleryFromDoc(d) : undefined,
    imageUrl: galleryFromDoc(d)[0],
    published: !!d.published,
    sortOrder: Number(d.sortOrder) || 0,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(d.createdAt ?? ""),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(d.updatedAt ?? ""),
  };
}
