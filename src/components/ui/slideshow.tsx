"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface SlideImage {
  src: string;
  alt: string;
}

interface SlideshowProps {
  images: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function Slideshow({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset och starta timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoPlay && images.length > 1 && !isUserInteracting) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      }, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, images.length, isUserInteracting]);

  // Navigation functions med timer reset
  const goToNext = useCallback(() => {
    setIsUserInteracting(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );

    // Reset user interaction efter en kort delay
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 100);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setIsUserInteracting(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );

    setTimeout(() => {
      setIsUserInteracting(false);
    }, 100);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setIsUserInteracting(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsUserInteracting(false);
    }, 100);
  }, []);

  // Hantera timer
  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetTimer]);

  // Reset timer när user interaction ändras
  useEffect(() => {
    if (!isUserInteracting) {
      resetTimer();
    }
  }, [isUserInteracting, resetTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (images.length === 0) return null;

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Container för 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            fill
            className={cn(
              "absolute inset-0 object-cover transition-opacity duration-500 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0",
            )}
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              "z-20 p-2 transition-all duration-200",
            )}
            aria-label="Föregående bild"
          >
            <FaChevronLeft className="h-6 w-6 text-white/80" />
          </button>

          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "z-20 p-2 transition-all duration-200",
            )}
            aria-label="Nästa bild"
          >
            <FaChevronRight className="h-6 w-6 text-white/80" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20",
                index === currentIndex
                  ? "scale-110 bg-white shadow-lg"
                  : "bg-white/40 hover:scale-105 hover:bg-white/70",
              )}
              aria-label={`Gå till slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
