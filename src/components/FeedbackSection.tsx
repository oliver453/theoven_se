"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "@/components/icons/icons";

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  return (
    <section className="mb-8 mt-12">
      <div className="flex grow flex-row items-center justify-between gap-5 md:justify-start xl:justify-between min-[1400px]:justify-start">
        <span className="text-sm text-foreground/70">
          Var denna sida hjälpsam?
        </span>
        <div className="flex space-x-3">
          <button
            onClick={() => setFeedback("yes")}
            className={`flex items-center space-x-1.5 rounded-md border px-3 py-1.5 text-sm transition-all ${
              feedback === "yes"
                ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                : "border border-sage/30 bg-sage/20 hover:bg-sage/30"
            }`}
          >
            <ThumbsUp
              className="h-4 w-4"
              weight={feedback === "yes" ? "fill" : "regular"}
            />
            <span>Ja</span>
          </button>
          <button
            onClick={() => setFeedback("no")}
            className={`flex items-center space-x-1.5 rounded-md border px-3 py-1.5 text-sm transition-all ${
              feedback === "no"
                ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                : "border border-sage/30 bg-sage/20 hover:bg-sage/30"
            }`}
          >
            <ThumbsDown
              className="h-4 w-4"
              weight={feedback === "no" ? "fill" : "regular"}
            />
            <span>Nej</span>
          </button>
        </div>
      </div>
    </section>
  );
}
