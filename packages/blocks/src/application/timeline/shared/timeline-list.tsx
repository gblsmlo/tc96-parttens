import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'

export interface TimelineListProps {
  children: ReactNode
  className?: string
  label: string
}

export function TimelineList({
  children,
  className,
  label,
}: Readonly<TimelineListProps>) {
  return (
    <ol
      aria-label={label}
      className={cn('m-0 list-none p-0', className)}
      data-slot="timeline-list"
    >
      {children}
    </ol>
  )
}
