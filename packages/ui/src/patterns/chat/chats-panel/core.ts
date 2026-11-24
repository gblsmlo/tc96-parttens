import type { useRender } from '@base-ui/react/use-render'
import type { IconModule } from '@thesvg/icons'
import type { ComponentProps, ReactNode } from 'react'

export type ChatsPanelVariant = 'card' | 'inset' | 'plain'

export const chatsPanelSkeletonWidths = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type ChatsPanelSkeletonWidth = (typeof chatsPanelSkeletonWidths)[number]

export interface ChatsPanelProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  title: ReactNode
  variant?: ChatsPanelVariant
}

export type ChatsPanelListProps = ComponentProps<'ul'>

export interface ChatsPanelItemProps
  extends Omit<useRender.ComponentProps<'button'>, 'children' | 'name'> {
  avatar: ReactNode
  channel?: Pick<IconModule, 'svg' | 'title'>
  channelLabel?: string
  name: ReactNode
  preview?: ReactNode
  selected?: boolean
  time?: ReactNode
  unreadCount?: number
  unreadLabel?: string
}

export interface ChatsPanelItemSkeletonProps {
  nameWidth?: ChatsPanelSkeletonWidth
  previewWidth?: ChatsPanelSkeletonWidth
}

export interface ChatsPanelSkeletonProps {
  count?: number
  label: string
}
