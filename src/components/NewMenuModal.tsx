"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export interface NewMenuModalProps {
  triggerDelay?: number;
  storageKey?: string;
  backgroundImage?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onViewMenu?: () => void;
}

export function NewMenuModal({
  triggerDelay = 1000,
  storageKey = "new-menu-modal-seen",
  backgroundImage = "/images/1.webp",
  onOpen,
  onClose,
  onViewMenu
}: NewMenuModalProps): JSX.Element {
  const { t, language } = useLanguage(); // Lägg till language här!
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasSeenModal, setHasSeenModal] = useLocalStorage<boolean>(storageKey, false);
  const router = useRouter();

  const handleClose = (): void => {
    setIsOpen(false);
    setHasSeenModal(true);
    onClose?.();
  };

  const handleViewMenu = (): void => {
    // Skapa språkmedveten länk till meny-sidan
    const menuPath = language === "en" ? "/en/meny" : "/meny";
    router.push(menuPath);
    onViewMenu?.();
    handleClose();
  };

  const handleOpenChange = (open: boolean): void => {
    if (open) {
      setIsOpen(true);
      onOpen?.();
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (hasSeenModal) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      onOpen?.();
    }, triggerDelay);

    return () => clearTimeout(timer);
  }, [hasSeenModal, triggerDelay, onOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        // Optional: tab navigation logic
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md mx-4 min-h-[500px] p-0 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundColor: "#000000"
          }}
          role="img"
          aria-label="Menu background"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col min-h-[500px]">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white border-0 hover:bg-white/20 focus:bg-white/20"
              aria-label="Close modal"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>

          {/* Centered Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
            <div className="text-center max-w-xs mx-auto space-y-8">
              <h1 className="text-white font-rustic uppercase text-3xl">
                {t.newMenuModal?.title || "New Menu"}
              </h1>
              <p className="text-white/90 leading-relaxed text-lg">
                {t.newMenuModal?.description || "Check out our new menu with exciting dishes!"}
              </p>
              <Button 
                onClick={handleViewMenu}
                className="bg-white text-black hover:bg-gray-200 focus:bg-gray-200 font-rustic uppercase text-lg py-3 px-8 transition-colors duration-200 w-full"
                aria-describedby="view-menu-description"
              >
                {t.newMenuModal?.button || "View Menu"}
              </Button>
              <span id="view-menu-description" className="sr-only">
                Navigate to menu page
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewMenuModal;