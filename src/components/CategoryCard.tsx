import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcons";
import React from "react";
import { IconWeight } from "@phosphor-icons/react";

interface CategoryCardProps {
  title: string;
  articleCount: number;
  icon:
    | React.ComponentType<{ className?: string; weight?: IconWeight }>
    | string;
  slug: string;
  description?: string;
}

export default function CategoryCard({
  title,
  articleCount,
  icon,
  slug,
  description,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className="category-card cursor-pointer rounded-xl border border-sage/30 bg-sage/20 p-6 hover:shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 rounded-lg bg-accent p-3">
            {typeof icon === "string" ? (
              <CategoryIcon icon={icon} className="h-6 w-6 text-white" />
            ) : (
              React.createElement(icon, {
                className: "w-6 h-6 text-white",
                weight: "fill" as IconWeight,
              })
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-2 truncate text-lg font-semibold text-foreground">
              {title}
            </h3>

            {description && (
              <p className="mb-3 line-clamp-2 text-sm text-foreground/80">
                {description}
              </p>
            )}

            <p className="text-sm text-foreground/60">
              {articleCount} {articleCount === 1 ? "artikel" : "artiklar"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
