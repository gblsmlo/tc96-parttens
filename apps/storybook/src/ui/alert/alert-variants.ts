import {
  CheckCircleIcon,
  InfoIcon,
  type Icon as PhosphorIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'

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
  { icon: PhosphorIcon; label: string }
> = {
  default: { icon: InfoIcon, label: 'Note' },
  error: { icon: WarningCircleIcon, label: 'Error' },
  info: { icon: InfoIcon, label: 'Information' },
  success: { icon: CheckCircleIcon, label: 'Success' },
  warning: { icon: WarningIcon, label: 'Warning' },
}
