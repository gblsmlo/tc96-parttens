import { Badge } from '@tc96/ui/badge'
import type { ReactNode } from 'react'

export interface KanbanBadgeProps {
  children: ReactNode
  className?: string
  tone?: 'muted' | 'neutral' | 'primary'
}

export function KanbanBadge({
  children,
  className,
  tone: _tone = 'neutral',
}: KanbanBadgeProps) {
  return (
    <Badge className={className} variant="secondary">
      {children}
    </Badge>
  )
}
