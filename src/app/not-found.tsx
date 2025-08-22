"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      className="z-20 mx-auto mb-16 max-w-lg items-center justify-center p-4 text-center"
      role="main"
    >
      <div aria-live="polite">
        <h1
          className="relative animate-fade-up text-center font-display text-6xl font-bold tracking-[-0.02em] opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          aria-label="Fel 404 - sidan hittades inte"
        >
          <span className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
            404
          </span>
          <div
            className="absolute -inset-1 -z-10 bg-gradient-to-r from-sage/20 via-transparent to-coral/20 opacity-50 blur-3xl"
            aria-hidden="true"
          ></div>
        </h1>

        <h2 className="font-heading my-2 text-2xl font-bold">
          Sidan på rymmen!
        </h2>

        <p className="mb-4">
          Sidan du letar efter har smitit iväg som en kaka från kakburken. Testa
          startsidan istället!
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="rounded-md border border-foreground bg-foreground px-4 py-1.5 text-sm text-background transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Gå tillbaka till startsidan"
          type="button"
        >
          Gå hem
        </button>
      </div>
    </main>
  );
}
