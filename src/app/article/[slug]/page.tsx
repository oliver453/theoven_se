import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { queries } from "@/lib/sanity/queries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchBar from "@/components/SearchBar";
import { siteConfig } from "@/lib/metadata";
import { CaretRight } from "@/components/icons/icons";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  try {
    const article = await client.fetch(
      queries.articleBySlug,
      { slug },
      {
        next: { revalidate: 60 },
      },
    );
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

async function getRelatedArticles(categoryId: string, currentId: string) {
  try {
    const articles = await client.fetch(
      queries.relatedArticles,
      {
        categoryId,
        currentId,
      },
      {
        next: { revalidate: 60 },
      },
    );
    return articles || [];
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

// Generera metadata dynamiskt
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "Artikel inte hittad",
      description: "Den efterfrågade artikeln kunde inte hittas.",
    };
  }

  const title = article.title;
  const description =
    article.excerpt ||
    article.description ||
    `Läs mer om ${article.title} i vår kunskapsbas.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: "article",
      url: `${siteConfig.url}/article/${params.slug}`,
      siteName: siteConfig.name,
      locale: "sv_SE",
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage.asset.url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: siteConfig.ogImage,
              width: 1920,
              height: 1080,
              alt: title,
            },
          ],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: article.featuredImage
        ? [article.featuredImage.asset.url]
        : [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/article/${params.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = article.category?._id
    ? await getRelatedArticles(article.category._id, article._id)
    : [];

  const breadcrumbItems = [
    { label: "Alla samligar", href: "/" },
    {
      label: article.category?.title || "Kategori",
      href: `/category/${article.category?.slug?.current}`,
    },
    { label: article.title },
  ];

  return (
    <div className="z-20 min-h-screen w-full">
      {/* Header med sökruta */}
      <div className="pb-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Sök efter artiklar..." />
        </div>
      </div>

      {/* Artikel innehåll */}
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <article>
          <header className="mb-8">
            <h1 className="mb-4 font-display text-3xl font-bold leading-10 text-foreground">
              {article.title}
            </h1>

            <div className="flex items-center space-x-4 text-sm text-foreground/70">
              {article.category && (
                <Link
                  href={`/category/${article.category.slug?.current}`}
                  className="rounded-full border border-sage/30 bg-sage/20 px-3 py-1 text-foreground transition-all hover:scale-105 hover:bg-sage/30 hover:shadow-lg"
                >
                  {article.category.title}
                </Link>
              )}
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {article.updatedAt &&
                article.updatedAt !== article.publishedAt && (
                  <span>
                    Updated{" "}
                    {new Date(article.updatedAt).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
            </div>
          </header>

          {article.content && (
            <div className="prose-md prose max-w-none text-foreground">
              <PortableText
                value={article.content}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="mb-4 mt-8 text-3xl font-bold text-foreground">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-3 mt-6  text-2xl font-semibold text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="mb-2 mt-3 text-lg font-semibold text-foreground">
                        {children}
                      </h4>
                    ),
                    normal: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-foreground/90">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-4 border-accent bg-accent/20 py-2 pl-4 italic text-foreground">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="mb-4 list-decimal space-y-2 pl-6 text-foreground">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => (
                      <li className="leading-relaxed text-foreground">
                        {children}
                      </li>
                    ),
                    number: ({ children }) => (
                      <li className="leading-relaxed text-foreground">
                        {children}
                      </li>
                    ),
                  },
                  marks: {
                    link: ({ value, children }) => {
                      const target = value?.blank ? "_blank" : undefined;
                      return (
                        <a
                          href={value?.href}
                          target={target}
                          rel={
                            target === "_blank"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="font-medium text-accent hover:underline"
                        >
                          {children}
                        </a>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800">
                        {children}
                      </code>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      if (!value?.asset) return null;
                      return (
                        <figure className="my-8">
                          <img
                            src={value.asset.url}
                            alt={value.alt || ""}
                            className="h-auto max-w-full rounded-lg shadow-sm"
                          />
                          {value.alt && (
                            <figcaption className="mt-2 text-center text-sm italic text-gray-600">
                              {value.alt}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                    codeBlock: ({ value }) => {
                      if (!value?.code) return null;
                      return (
                        <div className="my-6">
                          {value.language && (
                            <div className="rounded-t-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300">
                              {value.language.toUpperCase()}
                            </div>
                          )}
                          <pre
                            className={`overflow-x-auto bg-gray-900 p-4 text-gray-100 ${
                              value.language ? "rounded-b-lg" : "rounded-lg"
                            }`}
                          >
                            <code
                              className={
                                value.language
                                  ? `language-${value.language}`
                                  : ""
                              }
                            >
                              {value.code}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                    // Fallback för gamla "code" typer
                    code: ({ value }) => {
                      if (!value?.code) return null;
                      return (
                        <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">
                          <code
                            className={
                              value.language ? `language-${value.language}` : ""
                            }
                          >
                            {value.code}
                          </code>
                        </pre>
                      );
                    },
                  },
                }}
              />
            </div>
          )}
        </article>

        {/* Relaterade artiklar sektion */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="border-t border-foreground/70 pt-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Relaterade artiklar
              </h2>
              <div className="flex flex-col gap-4">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link
                    key={relatedArticle._id}
                    href={`/article/${relatedArticle.slug.current}`}
                  >
                    <div className="group cursor-pointer rounded-lg border border-sage/30 bg-sage/20 p-4 transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold text-foreground group-hover:text-accent ${
                            relatedArticle.excerpt ? "mb-2" : ""
                          }`}
                        >
                          {relatedArticle.title}
                        </h3>
                        <CaretRight
                          className="ml-2 h-5 w-5 flex-shrink-0 text-foreground/50 group-hover:text-accent"
                          weight="regular"
                        />
                      </div>
                      {relatedArticle.excerpt && (
                        <p className="line-clamp-2 text-sm text-foreground/70">
                          {relatedArticle.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
