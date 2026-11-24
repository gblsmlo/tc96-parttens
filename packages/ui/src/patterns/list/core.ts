import type { useRender } from '@base-ui/react/use-render'
import type { ReactNode } from 'react'

export const listVariants = ['outline', 'plain'] as const

export type ListVariant = (typeof listVariants)[number]

export interface ListProps {
  actions?: ReactNode
  className?: string
  description?: ReactNode
  icon: ReactNode
  iconColor?: string
  render?: useRender.ComponentProps<'div'>['render']
  title: ReactNode
  variant?: ListVariant
}
