import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'

export interface StatGridItem {
  label: string
  value: ReactNode
}

export function StatGrid({
  className,
  items,
  label,
}: Readonly<{
  className?: string
  items: readonly StatGridItem[]
  label: string
}>) {
  return (
    <section
      aria-label={label}
      className={cn('flex flex-col gap-3', className)}
      data-slot="flow-inspector-stat-grid"
    >
      <h3 className="font-medium text-sm">{label}</h3>
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-x-4 gap-y-3">
        {items.map((item) => (
          <div className="flex min-w-0 flex-col gap-1" key={item.label}>
            <dt className="text-muted-foreground text-xs">{item.label}</dt>
            <dd className="min-w-0 break-words font-medium text-sm">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
