'use client';

import { FacebookLogo, Envelope } from "@phosphor-icons/react";

export default function SocialIcons() {
  return (
    <div className="flex space-x-4 pb-8">
      <a href="https://www.facebook.com/people/Diavana/61576840333010/" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
        <span className="sr-only">Facebook</span>
        <FacebookLogo size={22} weight="bold" />
      </a>
      <a href="mailto:hej@diavana.se" className="hover:opacity-80 transition-opacity" aria-label="Skicka e-post till oss">
        <span className="sr-only">Email</span>
        <Envelope size={22} weight="bold" />
      </a>
    </div>
  );
}