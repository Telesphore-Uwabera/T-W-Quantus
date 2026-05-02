import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Reveal } from "@/components/site/Reveal";
import { fetchProjectBySlug } from "@/lib/api";
import { projectGalleryUrls } from "@shared/cms";

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { dateStyle: "long" });
}

/** `YYYY-MM-DD` from admin date input — avoid UTC shift */
function formatYmdLong(ymd: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return ymd;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return ymd;
  return new Date(y, mo - 1, d).toLocaleDateString(undefined, { dateStyle: "long" });
}

export default function ProjectDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["projects", "detail", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center text-neutral-500">Loading…</div>
      </Layout>
    );
  }

  if (isError || !project) {
    return (
      <Layout>
        <div className="section-padding mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-black text-neutral-950">Project not found</h1>
          <Link to="/projects" className="mt-6 inline-flex items-center text-brand font-bold hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
          </Link>
        </div>
      </Layout>
    );
  }

  const images = projectGalleryUrls(project);
  const meta = [
    project.location ? { icon: MapPin, label: "Location", value: project.location } : null,
    project.clientName ? { icon: User, label: "Client", value: project.clientName } : null,
    project.projectDate ? { icon: Calendar, label: "Project date", value: formatYmdLong(project.projectDate) } : null,
    project.year ? { icon: Calendar, label: "Year", value: project.year } : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <Layout>
      <PageHero
        eyebrow={project.sector ?? "Portfolio"}
        title={project.title}
        description={project.summary}
        visual="projects"
      />

      <section data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto max-w-4xl">
          <Reveal direction="up">
            <Link
              to="/projects"
              className="inline-flex items-center text-sm font-black uppercase tracking-wider text-brand hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> All projects
            </Link>
          </Reveal>

          {images.length > 0 ? (
            <Reveal className="mt-10" direction="up" delay={0.05}>
              <ProjectGallery images={images} title={project.title} />
            </Reveal>
          ) : null}

          <Reveal className="mt-10 space-y-8" direction="up" delay={0.08}>
            {meta.length > 0 ? (
              <dl className="grid gap-4 sm:grid-cols-3">
                {meta.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
                    <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand">
                      <Icon className="h-4 w-4" />
                      {label}
                    </dt>
                    <dd className="mt-2 text-base font-semibold text-neutral-950">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.description ? (
              <div>
                <h2 className="text-lg font-black text-neutral-950">Project details</h2>
                <div className="prose prose-neutral mt-4 max-w-none whitespace-pre-wrap text-base leading-8 text-neutral-700">
                  {project.description}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-dashed border-black/15 bg-neutral-50 p-6 text-sm text-neutral-600">
              <p className="font-bold text-neutral-900">Record</p>
              <p className="mt-2">
                <span className="text-neutral-500">Slug:</span>{" "}
                <code className="rounded bg-white px-2 py-0.5 text-neutral-800">{project.slug}</code>
              </p>
              <p className="mt-2">
                <span className="text-neutral-500">Created:</span> {formatDate(project.createdAt)}
              </p>
              <p className="mt-1">
                <span className="text-neutral-500">Updated:</span> {formatDate(project.updatedAt)}
              </p>
              <p className="mt-1">
                <span className="text-neutral-500">Sort order:</span> {project.sortOrder}
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex rounded-full bg-brand px-8 py-3 text-sm font-black text-white transition hover:bg-brand-light"
            >
              Discuss a similar project
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
