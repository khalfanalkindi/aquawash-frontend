import {
  Droplets,
  Sparkles,
  Zap,
  Wind,
  Layers,
  Shirt,
  Crown,
  User,
  UserRound,
  Bed,
  Bath,
  Tag,
  type LucideIcon,
} from 'lucide-react'

export const catalogIconMap: Record<string, LucideIcon> = {
  Droplets,
  Sparkles,
  Zap,
  Wind,
  Layers,
  Shirt,
  Crown,
  User,
  UserRound,
  Bed,
  Bath,
  Tag,
}

export function getCatalogIcon(iconName?: string): LucideIcon {
  if (!iconName || !catalogIconMap[iconName]) return Tag
  return catalogIconMap[iconName]
}
