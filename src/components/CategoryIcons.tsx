// components/CategoryIcons.tsx
import { 
    MessageCircle, 
    Zap, 
    Users, 
    DollarSign, 
    GraduationCap, 
    Monitor, 
    Code, 
    Wand2, 
    Smartphone,
    Settings,
    BookOpen,
    FileText
  } from 'lucide-react'
  
  interface CategoryIconProps {
    icon: string
    className?: string
  }
  
  const iconMap = {
    'claude': MessageCircle,
    'paid-plans': Zap,
    'team': Users,
    'financial': DollarSign,
    'education': GraduationCap,
    'api': Monitor,
    'code': Code,
    'prompt-design': Wand2,
    'mobile': Smartphone,
    'settings': Settings,
    'documentation': BookOpen,
    'general': FileText
  }
  
  export default function CategoryIcon({ icon, className = "w-6 h-6" }: CategoryIconProps) {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || FileText
    
    return <IconComponent className={className} />
  }
  
  export function getCategoryIcon(iconName: string) {
    return iconMap[iconName as keyof typeof iconMap] || FileText
  }