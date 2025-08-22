"use client";

import Link from "next/link";
import { CaretRight } from "./icons/icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-y-1 text-sm text-foreground">
      {items.map((item, index) => (
        <>
          {index > 0 && (
            <CaretRight
              key={`arrow-${index}`}
              className="mx-2 h-4 w-4 text-foreground"
            />
          )}

          <div key={index} className="flex items-center">
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  index === items.length - 1
                    ? "font-medium text-foreground/70"
                    : ""
                }
              >
                {item.label}
              </span>
            )}
          </div>
        </>
      ))}
    </nav>
  );
}
