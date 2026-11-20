import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from 'lucide-react'

export const alertVariantNames = [
  'default',
  'error',
  'info',
  'success',
  'warning',
] as const

export type AlertVariantName = (typeof alertVariantNames)[number]

export const alertStatusIcons: Record<
  AlertVariantName,
  { icon: LucideIcon; label: string }
> = {
  default: { icon: InfoIcon, label: 'Note' },
  error: { icon: CircleAlertIcon, label: 'Error' },
  info: { icon: InfoIcon, label: 'Information' },
  success: { icon: CircleCheckIcon, label: 'Success' },
  warning: { icon: TriangleAlertIcon, label: 'Warning' },
}
