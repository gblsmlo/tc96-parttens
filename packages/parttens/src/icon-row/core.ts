import type { useRender } from '@base-ui/react/use-render'
import type { ReactNode } from 'react'

export const iconRowVariants = ['outline', 'plain'] as const

export type IconRowVariant = (typeof iconRowVariants)[number]

export interface IconRowProps {
  actions?: ReactNode
  className?: string
  description?: ReactNode
  icon: ReactNode
  iconColor?: string
  render?: useRender.ComponentProps<'div'>['render']
  title: ReactNode
  variant?: IconRowVariant
}
