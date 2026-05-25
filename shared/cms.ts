/** Portfolio sector options — admin project form and API must use one of these. */
export const PROJECT_SECTORS = [
  "Multi-unit developments",
  "Residential buildings",
  "Commercial spaces",
  "Institutional infrastructure",
  "Renovations and repairs",
  "Civil and structural works",
] as const;

export function isValidProjectSector(value: string): boolean {
  return (PROJECT_SECTORS as readonly string[]).includes(value.trim());
}

export type ProjectDoc = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  /** Long-form case study / detail copy */
  description?: string;
  /** One of {@link PROJECT_SECTORS} for new projects; optional only for legacy records */
  sector?: string;
  location?: string;
  clientName?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  /** Gallery (preferred); order is display order */
  imageUrls?: string[];
  /** First image; kept for older clients and list cards */
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Resolved image list for gallery UI (supports legacy `imageUrl` only). */
export function projectGalleryUrls(p: Pick<ProjectDoc, "imageUrls" | "imageUrl">): string[] {
  const urls = p.imageUrls?.filter((u) => typeof u === "string" && u.trim().length > 0) ?? [];
  if (urls.length) return urls;
  if (p.imageUrl?.trim()) return [p.imageUrl.trim()];
  return [];
}

export type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  /** e.g. `contact_page` when submitted from the site form */
  source?: string;
  createdAt: string;
};

export type SubscriptionDoc = {
  _id: string;
  email: string;
  source: string;
  createdAt: string;
};

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source?: string;
};

export type PerspectiveDoc = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  category: string;
  date: string;
  imageUrls?: string[];
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
