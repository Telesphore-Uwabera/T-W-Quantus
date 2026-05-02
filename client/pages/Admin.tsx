import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, LogOut, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminFetch,
  adminListContacts,
  adminListProjects,
  adminListSubscriptions,
  adminLogin,
  clearAdminToken,
  fetchIndustryNews,
  getAdminToken,
  setAdminToken,
} from "@/lib/api";
import type { ContactSubmission, NewsArticle, ProjectDoc, SubscriptionDoc } from "@shared/cms";
import { projectGalleryUrls, PROJECT_SECTORS, isValidProjectSector } from "@shared/cms";

type Tab = "projects" | "contacts" | "subscriptions" | "news";

export default function Admin() {
  const [token, setTokenState] = useState<string | null>(() => getAdminToken());
  const [email, setEmail] = useState("twquantus2025@gmail.com");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("projects");

  const loginMut = useMutation({
    mutationFn: () => adminLogin(email, password),
    onSuccess: (data) => {
      setAdminToken(data.token);
      setTokenState(data.token);
      setPassword("");
      toast.success("Signed in");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
        <div className="border-b border-white/10 px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-light hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <form
            className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-black/40 p-8"
            onSubmit={(e) => {
              e.preventDefault();
              loginMut.mutate();
            }}
          >
            <div>
              <h1 className="text-2xl font-black">Admin</h1>
              <p className="mt-2 text-sm text-neutral-400">T&amp;W Quantus CMS</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Password</Label>
              <Input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/20 bg-white/5 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loginMut.isPending}>
              {loginMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-black text-brand hover:underline">
            ← Site
          </Link>
          <h1 className="text-lg font-black">Admin</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["projects", "Projects"],
              ["contacts", "Contacts"],
              ["subscriptions", "Subscriptions"],
              ["news", "News feed"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${
                tab === id ? "bg-brand text-white" : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              clearAdminToken();
              setTokenState(null);
              toast.message("Signed out");
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        {tab === "projects" && <ProjectsPanel />}
        {tab === "contacts" && <ContactsPanel />}
        {tab === "subscriptions" && <SubscriptionsPanel />}
        {tab === "news" && <NewsPanel />}
      </main>
    </div>
  );
}

function ProjectsPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery({ queryKey: ["admin", "projects"], queryFn: adminListProjects });

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState<string>(PROJECT_SECTORS[0]);

  const sectorOptions = useMemo(() => {
    const s = sector.trim();
    if (s && !isValidProjectSector(s)) {
      return [s, ...PROJECT_SECTORS];
    }
    return [...PROJECT_SECTORS];
  }, [sector]);
  const [location, setLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [published, setPublished] = useState(true);
  /** Remote URLs already stored (edit mode); order is gallery order */
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setTitle("");
    setSummary("");
    setDescription("");
    setSector(PROJECT_SECTORS[0]);
    setLocation("");
    setClientName("");
    setYear("");
    setProjectDate("");
    setSlug("");
    setSortOrder("0");
    setPublished(true);
    setGalleryUrls([]);
    setPendingFiles([]);
    setEditingId(null);
  }, []);

  const createMut = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("summary", summary);
      fd.append("description", description);
      fd.append("sector", sector);
      fd.append("location", location);
      fd.append("clientName", clientName);
      fd.append("year", year);
      fd.append("projectDate", projectDate);
      if (slug.trim()) fd.append("slug", slug.trim());
      fd.append("sortOrder", sortOrder);
      fd.append("published", published ? "true" : "false");
      for (const f of pendingFiles) {
        fd.append("images", f);
      }
      const res = await adminFetch("/api/admin/projects", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Save failed");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects", "public"] });
      resetForm();
      toast.success("Project saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patchMut = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error("No project selected");
      const fd = new FormData();
      fd.append("title", title);
      fd.append("summary", summary);
      fd.append("description", description);
      fd.append("sector", sector);
      fd.append("location", location);
      fd.append("clientName", clientName);
      fd.append("year", year);
      fd.append("projectDate", projectDate);
      fd.append("slug", slug.trim());
      fd.append("sortOrder", sortOrder);
      fd.append("published", published ? "true" : "false");
      fd.append("existingImageUrls", JSON.stringify(galleryUrls));
      for (const f of pendingFiles) {
        fd.append("images", f);
      }
      const res = await adminFetch(`/api/admin/projects/${editingId}`, { method: "PATCH", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Update failed");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects", "public"] });
      resetForm();
      toast.success("Project updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Delete failed");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects", "public"] });
      resetForm();
      toast.success("Project removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const loadForEdit = (p: ProjectDoc) => {
    setEditingId(p._id);
    setTitle(p.title);
    setSummary(p.summary);
    setDescription(p.description ?? "");
    setSector((p.sector ?? "").trim() || PROJECT_SECTORS[0]);
    setLocation(p.location ?? "");
    setClientName(p.clientName ?? "");
    setYear(p.year ?? "");
    setProjectDate(p.projectDate ?? "");
    setSlug(p.slug);
    setSortOrder(String(p.sortOrder ?? 0));
    setPublished(!!p.published);
    setGalleryUrls(projectGalleryUrls(p));
    setPendingFiles([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-600">{(error as Error).message}</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form
        className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (editingId) patchMut.mutate();
          else createMut.mutate();
        }}
      >
        <h2 className="text-xl font-black">{editingId ? "Edit project" : "Add project"}</h2>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Sector</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="h-10 w-full rounded-md border border-black/15 bg-white text-sm font-medium">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {sectorOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Summary</Label>
          <textarea
            className="min-h-24 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Detail description (optional)</Label>
          <textarea
            className="min-h-32 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Longer case study text shown on the project page"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Location (optional)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kigali, Rwanda" />
          </div>
          <div className="space-y-2">
            <Label>Client (optional)</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Year (optional)</Label>
            <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
          </div>
          <div className="space-y-2">
            <Label>Project date (optional)</Label>
            <Input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Slug (optional)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 pt-8 text-sm font-bold">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
        </div>
        <div className="space-y-2">
          <Label>Images (multiple, stored as WebP on Cloudinary)</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const next = e.target.files ? Array.from(e.target.files) : [];
              setPendingFiles((prev) => [...prev, ...next]);
              e.target.value = "";
            }}
          />
          {galleryUrls.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-bold text-neutral-500">Saved in gallery (remove to delete from project)</p>
              <ul className="flex flex-wrap gap-2">
                {galleryUrls.map((url) => (
                  <li key={url} className="relative h-16 w-24 overflow-hidden rounded-lg border border-black/10">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-0.5 top-0.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white"
                      onClick={() => setGalleryUrls((prev) => prev.filter((u) => u !== url))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pendingFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-bold text-neutral-500">New files (upload on save)</p>
              <ul className="mt-1 flex flex-wrap gap-2 text-xs">
                {pendingFiles.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1"
                  >
                    {f.name}
                    <button
                      type="button"
                      className="font-black text-red-600"
                      onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-2 text-xs font-bold text-brand underline" onClick={() => setPendingFiles([])}>
                Clear new files
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="bg-brand hover:bg-brand-light" disabled={createMut.isPending || patchMut.isPending}>
            {(createMut.isPending || patchMut.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black">All projects</h2>
        <ul className="space-y-3">
          {data.map((p) => (
            <li
              key={p._id}
              className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-black">{p.title}</div>
                <div className="text-xs text-neutral-500">
                  {p.slug} · {p.published ? "live" : "draft"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" asChild>
                  <Link to={`/projects/${encodeURIComponent(p.slug)}`} target="_blank" rel="noreferrer">
                    View
                  </Link>
                </Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => loadForEdit(p)}>
                  Edit
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => deleteMut.mutate(p._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
          {data.length === 0 && <li className="text-sm text-neutral-500">No projects yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function ContactsPanel() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["admin", "contacts"], queryFn: adminListContacts });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-600">{(error as Error).message}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-black/10 bg-neutral-50 text-xs font-black uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Service</th>
            <th className="p-3">Message</th>
          </tr>
        </thead>
        <tbody>
          {(data as ContactSubmission[]).map((c) => (
            <tr key={c._id} className="border-b border-black/5 align-top">
              <td className="whitespace-nowrap p-3 text-neutral-500">{new Date(c.createdAt).toLocaleString()}</td>
              <td className="p-3 font-semibold">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.service || "—"}</td>
              <td className="max-w-xs p-3 text-neutral-600">{c.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="p-6 text-neutral-500">No submissions yet.</p>}
    </div>
  );
}

function SubscriptionsPanel() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "subscriptions"],
    queryFn: adminListSubscriptions,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-600">{(error as Error).message}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 bg-neutral-50 text-xs font-black uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Email</th>
            <th className="p-3">Source</th>
          </tr>
        </thead>
        <tbody>
          {(data as SubscriptionDoc[]).map((s) => (
            <tr key={s._id} className="border-b border-black/5">
              <td className="whitespace-nowrap p-3 text-neutral-500">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="p-3 font-semibold">{s.email}</td>
              <td className="p-3">{s.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="p-6 text-neutral-500">No subscribers yet.</p>}
    </div>
  );
}

function NewsPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: fetchIndustryNews,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-600">{(error as Error).message}</p>;
  }

  const articles = data?.articles ?? [];
  if (!data?.configured) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Set <code className="rounded bg-amber-100 px-1">NEWS_API_KEY</code> in <code className="rounded bg-amber-100 px-1">.env</code> (NewsAPI.org)
        to load industry news.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(articles as NewsArticle[]).map((a, i) => (
        <a
          key={`${a.url}-${i}`}
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-brand/40"
        >
          {a.urlToImage ? (
            <img src={a.urlToImage} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="h-24 w-24 shrink-0 rounded-lg bg-neutral-200" />
          )}
          <div className="min-w-0">
            <div className="text-xs font-bold text-brand">{a.source}</div>
            <div className="mt-1 font-black leading-snug">{a.title}</div>
            <div className="mt-2 line-clamp-2 text-xs text-neutral-600">{a.description}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
