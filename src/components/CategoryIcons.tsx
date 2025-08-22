"use client";

import { CategoryIcons } from "./icons/icons";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export default function CategoryIcon({
  icon,
  className = "w-6 h-6",
}: CategoryIconProps) {
  const IconComponent =
    CategoryIcons[icon as keyof typeof CategoryIcons] || CategoryIcons.chat;

  return <IconComponent className={className} />;
}

// Utility function to get the icon component
export function getCategoryIcon(iconName: string) {
  return (
    CategoryIcons[iconName as keyof typeof CategoryIcons] || CategoryIcons.chat
  );
}
