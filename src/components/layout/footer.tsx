import Link from 'next/link';
import Image from 'next/image';
import SocialIcons from '../home/social-icons';

export default function Footer() {
  return (
    <footer className="relative w-full bg-dark text-white" role="contentinfo">
      <div className="relative z-10 mx-auto max-w-screen-xl px-5 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
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
              <span className="font-medium leading-none translate-y-0.5">Diavana</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ett modernt och säkert system för diarieföring i offentlig sektor.
            </p>
          </div>

          {/* Företaget Section */}
          <nav className="space-y-2" aria-labelledby="company-heading">
            <h2 id="company-heading" className="font-display text-gray-200 font-medium">
              Företaget
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Läs mer om oss"
              >
                Om oss
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Kontakta oss"
              >
                Kontakta oss
              </Link>
            </div>
          </nav>

          {/* Hjälp och säkerhet Section */}
          <nav className="space-y-2" aria-labelledby="help-safety-heading">
            <h2 id="help-safety-heading" className="font-display text-gray-200 font-medium">
              Hjälp & säkerhet
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href="https://status.diavana.se"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Visa driftstatus - öppnas i ny flik"
              >
                Driftstatus
              </Link>
              <Link
                href="/download"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Ladda ner appar"
              >
                Ladda ner appar
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Besök vårt hjälpcenter"
              >
                Hjälpcenter
              </Link>
            </div>
          </nav>

          {/* Juridiskt Section */}
          <nav className="space-y-2" aria-labelledby="legal-heading">
            <h2 id="legal-heading" className="font-display text-gray-200 font-medium">
              Juridiskt
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                href="/legal/privacy"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
                aria-label="Läs vår integritetspolicy"
              >
                Integritetspolicy
              </Link>
              <Link
                href="/legal/cookie-policy"
                className="text-gray-300 hover:text-white hover:opacity-80 transition-colors text-sm"
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
          className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-8" 
          role="separator" 
          aria-hidden="true"
        ></div>

        {/* Bottom Section */}
        <div className="flex justify-center items-center">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Diavana. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}