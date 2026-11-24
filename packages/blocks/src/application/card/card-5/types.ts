import type { Icon } from '@phosphor-icons/react'
import type { RenderLink } from '@tc96/ui/render-anchor'

export interface Card5Shortcut {
  description: string
  href?: string
  icon: Icon
  id: string
  title: string
}

export interface Card5Labels {
  emptyDescription: string
  emptyTitle: string
  title: string
}

export interface Card5Props {
  className?: string
  labels?: Partial<Card5Labels>
  onSelect?: (shortcutId: string) => void
  renderLink?: RenderLink
  shortcuts: readonly Card5Shortcut[]
}
