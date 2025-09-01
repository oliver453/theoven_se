import { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";
import SearchBar from "@/components/SearchBar";
import Breadcrumb from "@/components/Breadcrumb";
import { getAppChangelog } from "@/lib/github";

export const metadata: Metadata = {
  title: "App-uppdateringar | Ändringslogg",
  description:
    "Senaste förbättringarna, nya funktionerna och åtgärdade fel i Diavanas webb- och mobilapplikationer.",
  openGraph: {
    title: `App-uppdateringar | Ändringslogg | ${siteConfig.name}`,
    description:
      "Senaste förbättringarna, nya funktionerna och åtgärdade fel i Diavanas webb- och mobilapplikationer.",
    type: "website",
    url: `${siteConfig.url}/changelog/apps`,
    siteName: siteConfig.name,
    locale: "sv_SE",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1920,
        height: 1080,
        alt: "App-uppdateringar",
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/changelog/apps`,
  },
};

// Revalidate varje dag
export const revalidate = 86400;

const sectionColors = {
  added: "bg-green-100 text-green-800 border-green-200",
  changed: "bg-blue-100 text-blue-800 border-blue-200",
  deprecated: "bg-yellow-100 text-yellow-800 border-yellow-200",
  removed: "bg-red-100 text-red-800 border-red-200",
  fixed: "bg-purple-100 text-purple-800 border-purple-200",
  security: "bg-orange-100 text-orange-800 border-orange-200",
};

const sectionTitles = {
  added: "Nytt",
  changed: "Ändrat",
  deprecated: "Utfasad",
  removed: "Borttaget",
  fixed: "Fixat",
  security: "Säkerhet",
};

export default async function AppChangelogPage() {
  const changelog = await getAppChangelog();

  const breadcrumbItems = [
    { label: "Alla samligar", href: "/" },
    { label: "Ändringsloggar", href: "/changelog" },
    { label: "App-uppdateringar" },
  ];

  return (
    <div className="z-20 min-h-screen w-full">
      {/* Innehåll */}
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 font-display text-3xl font-bold leading-10 text-foreground">
                Uppdateringar för Diavanas appar
              </h1>
              <p className="text-foreground/70">
                Upptäck nya funktioner och förbättringar i våra applikationer
              </p>
            </div>
          </div>
        </header>

        {changelog.entries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-foreground/60">
              Inga app-uppdateringar hittades.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {changelog.entries.map((entry, index) => (
              <article
                key={`${entry.version}-${index}`}
                className="border-b border-foreground/20 pb-8 last:border-b-0"
              >
                <header className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Version {entry.version}
                    </h2>
                    <time
                      className="text-sm text-foreground/60"
                      dateTime={entry.date}
                    >
                      {entry.date}
                    </time>
                  </div>
                </header>

                <div className="space-y-6">
                  {Object.entries(entry.sections).map(
                    ([sectionType, items]) => {
                      if (!items || items.length === 0) return null;

                      const colorClass =
                        sectionColors[
                          sectionType as keyof typeof sectionColors
                        ] || "bg-gray-100 text-gray-800 border-gray-200";
                      const title =
                        sectionTitles[
                          sectionType as keyof typeof sectionTitles
                        ] || sectionType;

                      return (
                        <div key={sectionType} className="space-y-3">
                          <h3
                            className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium ${colorClass}`}
                          >
                            {title}
                          </h3>
                          <ul className="space-y-2 pl-4">
                            {items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="flex items-start space-x-3"
                              >
                                <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/40"></div>
                                <span className="leading-relaxed text-foreground/90">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    },
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
