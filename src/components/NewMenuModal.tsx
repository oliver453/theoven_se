"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
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
  backgroundImage = "/images/ex.webp",
  onOpen,
  onClose,
  onViewMenu
}: NewMenuModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [hasSeenModal, setHasSeenModal] = useLocalStorage<boolean>(storageKey, false);
  const router = useRouter();

  const handleClose = (): void => {
    setIsOpen(false);
    setHasSeenModal(true);
    onClose?.();
  };

  const handleViewMenu = (): void => {
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

  const handleImageLoad = (): void => {
    setImageLoaded(true);
  };

  const handleImageError = (): void => {
    // Visa ändå innehållet om bilden inte kan laddas
    setImageLoaded(true);
  };

  // Preload bilden när komponenten mountas
  useEffect(() => {
    if (!backgroundImage) return;
    
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
    img.src = backgroundImage;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [backgroundImage]);

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
        {/* Bakgrundsfärg som fallback */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900"
          aria-hidden="true" 
        />
        
        {/* Optimerad bakgrundsbild med fade-in effekt */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Menu background"
            fill
            className={`object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            priority

            sizes="(max-width: 768px) 100vw, 448px"
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        {/* Overlay med mjukare transition */}
        <div 
          className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-50'
          }`} 
          aria-hidden="true" 
        />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col min-h-[500px]">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-30">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white border-0"
              aria-label="Close modal"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>

          {/* Centered Content med fade-in animation */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
            <div 
              className={`text-center max-w-xs mx-auto space-y-8 transition-all duration-700 ${
                imageLoaded 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-70 transform translate-y-4'
              }`}
            >
              <h1 className="text-white font-rustic uppercase text-3xl">
                {t.newMenuModal?.title || "New Menu"}
              </h1>
              <p className="text-white leading-relaxed text-lg">
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