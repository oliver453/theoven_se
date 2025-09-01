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
            <h3
              className={`text-lg font-semibold text-foreground transition-colors group-hover:text-accent ${
                excerpt ? "mb-2" : ""
              }`}
            >
              {title}
            </h3>

            {excerpt && (
              <p className="line-clamp-2 text-sm text-foreground/80">
                {excerpt}
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
