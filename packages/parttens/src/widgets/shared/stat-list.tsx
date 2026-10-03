import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export interface WidgetStat {
  id: string
  label: ReactNode
  value: ReactNode
}

export interface StatListProps extends Omit<ComponentProps<'dl'>, 'children'> {
  stats: readonly WidgetStat[]
}

export function StatList({
  className,
  stats,
  ...props
}: Readonly<StatListProps>): ReactElement {
  return (
    <dl
      className={cn('flex flex-wrap gap-x-4 gap-y-3', className)}
      data-slot="stat-list"
      {...props}
    >
      {stats.map((stat) => (
        <div
          className="grid gap-1 not-first:border-border/40 not-first:border-s not-first:ps-4"
          key={stat.id}
        >
          <dt className="text-muted-foreground text-sm">{stat.label}</dt>
          <dd className="font-medium text-lg tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
