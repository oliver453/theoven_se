import Link from "next/link";
import { CaretRight } from "./icons/icons";

interface ArticleCardProps {
  title: string;
  excerpt?: string;
  slug: string;
  publishedAt?: string;
  category?: {
    title: string;
    slug: { current: string };
    icon?: string;
  };
  featured?: boolean;
}

export default function ArticleCard({
  title,
  excerpt,
  slug,
  publishedAt,
  category,
  featured,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`}>
      <div className="group cursor-pointer rounded-lg border border-sage/30 bg-sage/20 p-6 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <div className="mb-2 flex items-center gap-2">
              {category && (
                <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
                  {category.title}
                </span>
              )}
              {featured && (
                <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">
                  Utvald
                </span>
              )}
            </div>

            <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
              {title}
            </h3>

            {excerpt && (
              <p className="mb-3 line-clamp-2 text-sm text-foreground/80">
                {excerpt}
              </p>
            )}

            {publishedAt && (
              <p className="text-xs text-foreground/60">
                {new Date(publishedAt).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="ml-4 flex-shrink-0">
            <CaretRight className="h-5 w-5 text-foreground transition-colors group-hover:text-accent" />
          </div>
        </div>
      </div>
    </Link>
  );
}
