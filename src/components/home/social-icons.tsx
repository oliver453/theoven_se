"use client";

import { FacebookLogo, LinkedinLogo, Envelope } from "@phosphor-icons/react";

export default function SocialIcons() {
  return (
    <div className="flex space-x-4 pb-8">
      <a
        href="https://www.facebook.com/people/Diavana/61576840333010/"
        className="transition-opacity hover:opacity-80"
        aria-label="Facebook"
      >
        <span className="sr-only">Facebook</span>
        <FacebookLogo size={22} weight="bold" />
      </a>
      <a
        href="https://www.linkedin.com/company/diavana/"
        className="transition-opacity hover:opacity-80"
        aria-label="Linkedin"
      >
        <span className="sr-only">Linkedin</span>
        <LinkedinLogo size={22} weight="bold" />
      </a>
      <a
        href="mailto:hej@diavana.se"
        className="transition-opacity hover:opacity-80"
        aria-label="Skicka e-post till oss"
      >
        <span className="sr-only">Email</span>
        <Envelope size={22} weight="bold" />
      </a>
    </div>
  );
}
