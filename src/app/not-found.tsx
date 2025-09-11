"use client";

import { useRouter } from "next/navigation";
import { FaHome, FaPizzaSlice, FaUtensils } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "../../contexts/LanguageContext";

export default function NotFound() {
  const router = useRouter();
  const { t, language } = useLanguage();

  // Funktion för att skapa språkmedvetna länkar
  const createLink = (path: string) => {
    if (language === "en") {
      if (path === "/") return "/en";
      return `/en${path}`;
    }
    return path;
  };

  const handleGoHome = () => {
    router.push(createLink("/"));
  };

  const handleGoToMenu = () => {
    router.push(createLink("/meny"));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <h1 className="text-white text-8xl md:text-9xl font-rustic tracking-tight">
            404
          </h1>
          
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-light">
              {t.notFound?.title || "Sidan kunde inte hittas"}
            </h2>
            <p className="text-gray-400 text-lg">
              {t.notFound?.description || "Sidan du letar efter har smitit iväg som en pizza från ugnen!"}{" "}
              <FaPizzaSlice className="inline" />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={handleGoHome}
              variant="default"
              size="lg"
              className="bg-white hover:bg-gray-100 font-rustic uppercase text-black flex items-center justify-center"
            >
              {t.notFound?.homeButton || "Gå till startsidan"}
            </Button>
            
            <Button
              onClick={handleGoToMenu}
              variant="outline"
              size="lg"
              className="border-white text-white font-rustic uppercase hover:bg-white hover:text-black flex items-center justify-center"
            >
              {t.notFound?.menuButton || "Se meny"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}