import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { perspectives } from "@/data/site";
import { fetchIndustryNews } from "@/lib/api";
import type { NewsArticle } from "@shared/cms";

export default function Perspectives() {
  const { data: newsData } = useQuery({
    queryKey: ["news", "public"],
    queryFn: fetchIndustryNews,
    staleTime: 10 * 60 * 1000,
  });
  const newsArticles = newsData?.articles ?? [];
  const newsOn = newsData?.configured && newsArticles.length > 0;

  return (
    <Layout>
      <PageHero
        eyebrow="Perspectives & News"
        title="Practical thinking on cost, tendering, and construction delivery."
        description="Explore T&W Quantus insights shaped around quantity surveying, procurement, site coordination, technical delivery, and project controls."
        visual="projects"
      />

      {newsOn && (
        <section data-header-theme="light" className="section-padding bg-neutral-100">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl" direction="clip">
              <p className="eyebrow">Industry headlines</p>
              <h2 className="section-title mt-4">Latest news related to our fields.</h2>
              <p className="mt-4 text-neutral-600">
                Curated headlines from international sources on construction, quantity surveying, and project delivery.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {(newsArticles as NewsArticle[]).slice(0, 9).map((article, index) => (
                <Reveal key={`${article.url}-${index}`} delay={index * 0.04} direction="up">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg sm:rounded-2xl sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-brand">
                        {article.source ?? "News"}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-neutral-400" />
                    </div>
                    <h3 className="mt-3 flex-1 text-base font-black leading-snug text-neutral-950 sm:text-lg">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{article.description}</p>
                    <span className="mt-4 text-xs text-neutral-400">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8">
          {perspectives.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.08} direction={index % 2 === 0 ? "left" : "right"}>
              <Link
                to={`/perspectives/${item.slug}`}
                className="group grid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div className={`service-detail-visual ${item.visual} min-h-80`} />
                <div className="p-7 md:p-10">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-brand">
                    <CalendarDays className="h-4 w-4" />
                    {item.date} / {item.category}
                  </div>
                  <h2 className="mt-8 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-black leading-tight tracking-tight text-neutral-950">
                    {item.title}
                  </h2>
                  <p className="mt-6 max-w-2xl leading-8 text-neutral-600">{item.summary}</p>
                  <span className="mt-8 inline-flex items-center border-b-2 border-brand pb-1 text-sm font-black text-neutral-950 transition group-hover:text-brand">
                    Read perspective <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
}
