import type { ContactSubmission, NewsArticle, ProjectDoc, SubscriptionDoc } from "@shared/cms";

export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<{ ok: boolean; id?: string }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not send message");
  return data;
}

export async function submitNewsletter(email: string): Promise<{ ok: boolean; duplicate?: boolean }> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not subscribe");
  return data;
}

export async function fetchPublishedProjects(): Promise<ProjectDoc[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) return [];
  return res.json();
}

export async function fetchIndustryNews(): Promise<{
  articles: NewsArticle[];
  configured: boolean;
  cached?: boolean;
}> {
  const res = await fetch("/api/news");
  if (!res.ok) return { articles: [], configured: false };
  return res.json();
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
  const res = await fetch("/api/admin/login", {
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
  return fetch(path, { ...init, headers });
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
