import type { ContactSubmission, NewsArticle, ProjectDoc, SubscriptionDoc, PerspectiveDoc } from "@shared/cms";

/** Netlify (or any static host): set to Render API origin, e.g. https://t-w-quantus.onrender.com — no trailing slash. */
const API_BASE = (import.meta.env.VITE_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

/** Ensures the returned promise takes at least `ms` milliseconds — keeps loading states visible. */
async function minDelay<T>(promise: Promise<T>, ms = 700): Promise<T> {
  const [result] = await Promise.all([promise, new Promise(r => setTimeout(r, ms))]);
  return result;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<{ ok: boolean; id?: string }> {
  const res = await fetch(apiUrl("/api/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not send message");
  return data;
}

export async function submitNewsletter(email: string): Promise<{ ok: boolean; duplicate?: boolean }> {
  const res = await fetch(apiUrl("/api/newsletter"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not subscribe");
  return data;
}

export async function fetchPublishedProjects(): Promise<ProjectDoc[]> {
  return minDelay(
    fetch(apiUrl("/api/projects")).then(res => (res.ok ? res.json() : [])),
  );
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectDoc | null> {
  const s = encodeURIComponent(slug);
  const res = await fetch(apiUrl(`/api/projects/${s}`));
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPerspectiveBySlug(slug: string): Promise<PerspectiveDoc | null> {
  const s = encodeURIComponent(slug);
  const res = await fetch(apiUrl(`/api/perspectives/${s}`));
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPublishedPerspectives(): Promise<PerspectiveDoc[]> {
  return minDelay(
    fetch(apiUrl("/api/perspectives")).then(res => (res.ok ? res.json() : [])),
  );
}

export async function fetchIndustryNews(): Promise<{
  articles: NewsArticle[];
  configured: boolean;
  cached?: boolean;
}> {
  const res = await fetch(apiUrl("/api/news"));
  if (!res.ok) return { articles: [], configured: false };
  return res.json();
}

export async function fetchServiceNews(service?: string): Promise<{
  articles: NewsArticle[];
  configured: boolean;
  cached?: boolean;
  service?: string | null;
}> {
  const base = apiUrl("/api/news/services");
  const url = service ? `${base}?service=${encodeURIComponent(service)}` : base;
  return minDelay(
    fetch(url).then(res =>
      res.ok ? res.json() : { articles: [], configured: false, service: service ?? null },
    ),
  );
}

const TOKEN_KEY = "twq_admin_token";

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Login failed");
  return data;
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers });
}

export async function adminListProjects(): Promise<ProjectDoc[]> {
  const res = await adminFetch("/api/admin/projects");
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function adminListContacts(): Promise<ContactSubmission[]> {
  const res = await adminFetch("/api/admin/contacts");
  if (!res.ok) throw new Error("Failed to load contacts");
  return res.json();
}

export async function adminListSubscriptions(): Promise<SubscriptionDoc[]> {
  const res = await adminFetch("/api/admin/subscriptions");
  if (!res.ok) throw new Error("Failed to load subscriptions");
  return res.json();
}

export async function adminListPerspectives(): Promise<PerspectiveDoc[]> {
  const res = await adminFetch("/api/admin/perspectives");
  if (!res.ok) throw new Error("Failed to load perspectives");
  return res.json();
}
