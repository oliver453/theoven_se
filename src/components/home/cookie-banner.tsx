"use client";

import React, { useState, useEffect } from "react";
import Switch from "./switch";
import {
  getConsentPreferences,
  setConsentPreferences,
  areCookiesEnabled,
} from "../../utils/cookieUtils";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Alltid aktiverad
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Kontrollera om cookies är aktiverade
    if (!areCookiesEnabled()) {
      console.warn("Cookies är inte aktiverade i denna webbläsare");
      return;
    }

    // Kontrollera om användaren redan har gjort ett val
    const existingPreferences = getConsentPreferences();
    if (!existingPreferences) {
      setIsVisible(true);
    } else {
      // Ladda befintliga inställningar
      setPreferences((prev) => ({
        ...prev,
        analytics: existingPreferences.analytics,
        marketing: existingPreferences.marketing,
      }));
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences): void => {
    // Spara endast analytics och marketing (necessary är alltid true)
    const prefsToSave = {
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    };

    setConsentPreferences(prefsToSave);

    // Skicka custom event för att notifiera andra komponenter
    window.dispatchEvent(new Event("cookieConsentChanged"));

    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = (): void => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = (): void => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleCustomize = (): void => {
    setShowSettings(true);
  };

  const handleSaveCustom = (): void => {
    savePreferences(preferences);
  };

  const togglePreference = (type: "analytics" | "marketing"): void => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-2 right-2 z-50 animate-fade-up">
      <div
        className={`max-h-[calc(100vh-1rem)] max-w-[calc(100vw-1rem)] overflow-auto rounded-3xl bg-bg-500 p-4 text-white shadow-2xl transition-all duration-300 sm:max-w-md sm:p-8 ${
          showSettings ? "transform" : ""
        }`}
      >
        <h2 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl">
          Vi bjuder på kakor!
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-text-300">
          Vi använder kakor för att förbättra tjänster, analysera användning
          och, med ditt samtycke, anpassa upplevelsen samt marknadsföra våra
          tjänster. Läs mer i vår{" "}
          <a
            href="https://diavana.se/legal/cookie-policy"
            className="underline transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Läs vår cookiepolicy (öppnas i ny flik)"
          >
            cookiepolicy
          </a>
          .
        </p>

        {showSettings && (
          <div className="mb-6 space-y-4">
            {/* Nödvändiga cookies */}
            <div className="border-b border-gray-700 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-000">
                  Nödvändiga
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-000">Krävs</span>
                  <Switch
                    checked={preferences.necessary}
                    onCheckedChange={() => {}}
                    disabled={true}
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-500">
                Möjliggör säkerhet och grundläggande funktionalitet. Kan inte
                stängas av.
              </p>
            </div>

            {/* Analytics cookies */}
            <div className="border-b border-gray-700 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-000">Analys</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-000">
                    {preferences.analytics ? "På" : "Av"}
                  </span>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={() => togglePreference("analytics")}
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-500">
                Möjliggör spårning av webbplatsens prestanda och användning för
                att förbättra användarupplevelsen.
              </p>
            </div>

            {/* Marketing cookies */}
            <div className="pb-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-000">
                  Marknadsföring
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-000">
                    {preferences.marketing ? "På" : "Av"}
                  </span>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={() => togglePreference("marketing")}
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-500">
                Möjliggör personalisering av annonser och spårning för
                marknadsföringsändamål.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!showSettings ? (
            <>
              {/* Mobil: Tre knappar i rad */}
              <div className="flex gap-2 md:hidden">
                <button
                  onClick={handleCustomize}
                  className="flex-1 rounded-[0.6rem] border border-text-400 bg-transparent px-3 py-2.5 text-xs font-medium text-text-000 transition-colors hover:border-text-200 hover:bg-bg-400"
                >
                  Anpassa
                </button>

                <button
                  onClick={handleRejectAll}
                  className="flex-1 rounded-[0.6rem] border border-text-400 bg-transparent px-3 py-2.5 text-xs font-medium text-text-000 transition-colors hover:border-text-200 hover:bg-bg-400"
                >
                  Neka
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="flex-1 rounded-[0.6rem] bg-white px-3 py-2.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Acceptera
                </button>
              </div>

              {/* Desktop: Ursprunglig layout */}
              <div className="hidden space-y-3 md:block">
                <button
                  onClick={handleCustomize}
                  className="w-full rounded-lg border border-text-400 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-text-200 hover:bg-bg-400"
                >
                  Anpassa cookie-inställningar
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 rounded-lg border border-text-400 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-text-200 hover:bg-bg-400"
                  >
                    Neka alla
                  </button>

                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    Acceptera alla
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 rounded-lg border border-text-400 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-text-200 hover:bg-bg-400"
              >
                Tillbaka
              </button>

              <button
                onClick={handleSaveCustom}
                className="flex-1 rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Spara
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
