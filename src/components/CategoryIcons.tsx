'use client';

import {
    ChatCircleDots,
    Lightning,
    UsersThree,
    CurrencyDollar,
    GraduationCap,
    Desktop,
    Code,
    MagicWand,
    DeviceMobile,
    Gear,
    BookOpen,
    FileText,
    Headset,
    ChartLine,
    Toolbox,
    Robot,
    Globe
  } from "@phosphor-icons/react";
  
  interface CategoryIconProps {
    icon: string;
    className?: string;
  }
  
  const iconMap = {
    "claude": ChatCircleDots,
    "paid-plans": Lightning,
    "team": UsersThree,
    "financial": CurrencyDollar,
    "education": GraduationCap,
    "api": Desktop,
    "code": Code,
    "prompt-design": MagicWand,
    "mobile": DeviceMobile,
    "settings": Gear,
    "documentation": BookOpen,
    "general": FileText,
    "support": Headset,
    "analytics": ChartLine,
    "tools": Toolbox,
    "ai": Robot,
    "global": Globe
  };
  
  export default function CategoryIcon({
    icon,
    className = "w-6 h-6"
  }: CategoryIconProps) {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || FileText;
  
    return <IconComponent className={className} weight="bold" />;
  }
  
  export function getCategoryIcon(iconName: string) {
    return iconMap[iconName as keyof typeof iconMap] || FileText;
  }
  