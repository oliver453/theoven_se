"use client";

import "flag-icons/css/flag-icons.min.css";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === "sv" ? "en" : "sv";
    setLanguage(newLang);
  };

  const flagClass = language === "sv" ? "fi fi-gb" : "fi fi-se";

  return (
    <button
      onClick={toggleLanguage}
      title={language === "sv" ? "Switch to English" : "Byt till Svenska"}
      className="flex h-full items-center justify-center transition hover:scale-110"
      aria-label={language === "sv" ? "Switch to English" : "Byt till Svenska"}
    >
      <span className={`${flagClass} text-[1.2rem] rounded-sm`} />
    </button>
  );
};

export default LanguageSwitcher;