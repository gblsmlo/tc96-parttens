import type { Icon } from '@phosphor-icons/react'
import type { RenderLink } from '@tc96/ui/render-anchor'
import type { CardLoadLabels, CardLoadProps } from '../shared/types'

export interface Card5Shortcut {
  description: string
  href?: string
  icon: Icon
  id: string
  title: string
}

export interface Card5Labels extends CardLoadLabels {
  emptyDescription: string
  emptyTitle: string
  title: string
}

export interface Card5Props extends CardLoadProps {
  className?: string
  labels?: Partial<Card5Labels>
  onSelect?: (shortcutId: string) => void
  renderLink?: RenderLink
  shortcuts: readonly Card5Shortcut[]
}
