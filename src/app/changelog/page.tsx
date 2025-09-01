import { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";
import { Code, Devices } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Ändringsloggar | Diavana",
  description:
    "Se de senaste uppdateringarna och förändringarna i Diavanas produkter och tjänster.",
  openGraph: {
    title: `Ändringsloggar | ${siteConfig.name}`,
    description:
      "Se de senaste uppdateringarna och förändringarna i Diavanas produkter och tjänster.",
    type: "website",
    url: `${siteConfig.url}/changelog`,
    siteName: siteConfig.name,
    locale: "sv_SE",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1920,
        height: 1080,
        alt: "Ändringsloggar",
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/changelog`,
  },
};

interface ChangelogOption {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const changelogOptions: ChangelogOption[] = [
  {
    title: "API-uppdateringar",
    description: "Se vad som är nytt, ändrat och fixat i Diavanas API.",
    icon: Code,
    href: "/changelog/api",
    color: "bg-accent",
  },
  {
    title: "Appuppdateringar",
    description:
      "Håll koll på senaste nyheterna och förbättringarna i våra webb- och mobilappar.",
    icon: Devices,
    href: "/changelog/apps",
    color: "bg-accent",
  },
];

export default function ChangelogPage() {
  return (
    <div className="z-20 min-h-screen w-full">
      {/* Hero Section */}
      <section className="pb-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Ändringsloggar
          </h1>
          <p className="text-xl text-foreground/70">
            Håll dig uppdaterad om Diavanas produkter och tjänster
          </p>
        </div>
      </section>

      {/* Överblick sektion */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {changelogOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              className="transition-allhover:shadow-lg group cursor-pointer rounded-xl border border-sage/30 bg-sage/20 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 rounded-lg p-3 ${option.color}`}>
                  <option.icon
                    className="h-6 w-6 text-white"
                    weight="regular"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent">
                    {option.title}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {option.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
