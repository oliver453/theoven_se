import Link from "next/link";
import Image from "next/image";
import SocialIcons from "../home/social-icons";

const BASE_URL = "https://diavana.se";

export default function Footer() {
  const internalLink = (path: string): string => `${BASE_URL}${path}`;

  return (
    <footer className="relative w-full bg-dark text-white" role="contentinfo">
      <div className="relative z-10 mx-auto max-w-screen-xl px-5 py-12">
        {/* Main Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href={internalLink("/")}
              className="flex items-center font-display text-2xl tracking-tight text-white"
              aria-label="Gå till startsidan - Diavana"
            >
              <Image
                src="/owl.svg"
                alt="Diavana logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="translate-y-0.5 font-medium leading-none">
                Diavana
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300">
              Ett modernt och säkert ärende- och diarieföringssystem för
              offentlig sektor.
            </p>
          </div>

          {/* Företaget Section */}
          <nav className="space-y-2" aria-labelledby="company-heading">
            <h2
              id="company-heading"
              className="font-display font-medium text-gray-200"
            >
              Företaget
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href={internalLink("/about")}
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Läs mer om oss"
              >
                Om oss
              </Link>
              <Link
                href={internalLink("/contact")}
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Kontakta oss"
              >
                Kontakta oss
              </Link>
            </div>
          </nav>

          {/* Hjälp och säkerhet Section */}
          <nav className="space-y-2" aria-labelledby="help-safety-heading">
            <h2
              id="help-safety-heading"
              className="font-display font-medium text-gray-200"
            >
              Hjälp & säkerhet
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href="https://status.diavana.se"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Visa driftstatus - öppnas i ny flik"
              >
                Driftstatus
              </Link>
              <Link
                href={internalLink("/download")}
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Ladda ner appar"
              >
                Ladda ner appar
              </Link>
              <Link
                href="https://support.diavana.se"
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Besök vårt hjälpcenter"
              >
                Hjälpcenter
              </Link>
            </div>
          </nav>

          {/* Juridiskt Section */}
          <nav className="space-y-2" aria-labelledby="legal-heading">
            <h2
              id="legal-heading"
              className="font-display font-medium text-gray-200"
            >
              Juridiskt
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href={internalLink("/legal/privacy")}
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Läs vår integritetspolicy"
              >
                Integritetspolicy
              </Link>
              <Link
                href={internalLink("/legal/cookie-policy")}
                className="text-sm text-gray-300 transition-colors hover:text-white hover:opacity-80"
                aria-label="Läs vår cookiepolicy"
              >
                Cookiepolicy
              </Link>
            </div>
          </nav>
        </div>

        <div aria-label="Sociala medier">
          <SocialIcons />
        </div>

        {/* Divider */}
        <div
          className="mb-8 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"
          role="separator"
          aria-hidden="true"
        ></div>

        {/* Bottom Section */}
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Diavana. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
