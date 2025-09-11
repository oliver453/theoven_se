import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTripadvisor,
} from "react-icons/fa";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61554892137607",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/theoven_arvika",
    icon: FaInstagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@theovenarvika",
    icon: FaTiktok,
  },
  {
    name: "TripAdvisor",
    href: "https://www.tripadvisor.com/Restaurant_Review-g285721-d3502137-Reviews-The_Oven-Arvika_Varmland_County.html?m=69573",
    icon: FaTripadvisor,
  },
];

export default function SocialSidebar() {
  return (
    <div className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 transform lg:block">
      <div className="flex flex-col bg-black">
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black p-3 transition-transform duration-300 hover:-translate-x-1 hover:scale-110"
              aria-label={social.name}
              title={social.name}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
