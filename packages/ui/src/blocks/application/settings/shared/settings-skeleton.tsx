import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'

type RowStart = 'avatar' | 'icon' | 'none'
type RowEnd = 'button' | 'menu' | 'none' | 'select' | 'switch'

const placeholderIds = (prefix: string, length: number) =>
  Array.from({ length }, (_, index) => `${prefix}-${index}`)

const titleWidths = ['w-40', 'w-32', 'w-48', 'w-36', 'w-44']
const descriptionWidths = ['w-64', 'w-56', 'w-72', 'w-60', 'w-52']

export function SettingsSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('flex flex-col divide-y', className)}
      data-slot="settings-skeleton"
    >
      {children}
    </output>
  )
}

export function SettingsSectionSkeleton({
  action = false,
  children,
  description = false,
}: Readonly<{ action?: boolean; children: ReactNode; description?: boolean }>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          {description ? <Skeleton className="h-4 w-72 max-w-full" /> : null}
        </div>
        {action ? <Skeleton className="h-8 w-24 shrink-0" /> : null}
      </div>
      <Card>
        <div className="flex flex-col divide-y px-6">{children}</div>
      </Card>
    </div>
  )
}

function RowEndSkeleton({ end }: Readonly<{ end: RowEnd }>) {
  if (end === 'switch')
    return <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
  if (end === 'select') return <Skeleton className="h-8 w-36 shrink-0" />
  if (end === 'button') return <Skeleton className="h-8 w-24 shrink-0" />
  if (end === 'menu') return <Skeleton className="size-8 shrink-0" />
  return null
}

export function SettingsRowsSkeleton({
  count,
  description = true,
  end = 'none',
  start = 'none',
}: Readonly<{
  count: number
  description?: boolean
  end?: RowEnd
  start?: RowStart
}>) {
  return placeholderIds('row', count).map((id, index) => (
    <div className="flex items-center gap-3 py-3" key={id}>
      {start === 'avatar' ? (
        <Skeleton className="size-10 shrink-0 rounded-full" />
      ) : null}
      {start === 'icon' ? <Skeleton className="size-4 shrink-0" /> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className={cn('h-4 max-w-full', titleWidths[index % 5])} />
        {description ? (
          <Skeleton
            className={cn('h-3.5 max-w-full', descriptionWidths[index % 5])}
          />
        ) : null}
      </div>
      <RowEndSkeleton end={end} />
    </div>
  ))
}

export function SettingsCollapsedSkeleton({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="my-1 flex flex-col first:mt-4 last:mb-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="flex flex-col px-4">{children}</div>
    </div>
  )
}

export function SettingsTableSkeleton({
  columns,
  rows,
}: Readonly<{ columns: number; rows: number }>) {
  return (
    <div className="flex flex-col divide-y py-2">
      {placeholderIds('row', rows + 1).map((rowId, row) => (
        <div
          className="grid gap-4 py-3"
          key={rowId}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {placeholderIds('cell', columns).map((cellId) => (
            <Skeleton
              className={row === 0 ? 'h-3.5 w-16' : 'h-4 w-full'}
              key={cellId}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
