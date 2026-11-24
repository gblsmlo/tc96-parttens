import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import { KpiSkeleton, TableSkeleton } from '../shared/dashboard-skeleton-parts'

export function Dashboard4Skeleton({
  className,
  label,
  title,
}: Readonly<{ className?: string; label: string; title: string }>) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className={cn('grid gap-4', className)}
    >
      <h2 className="sr-only">{title}</h2>
      <div className="flex items-center justify-between gap-4 border-b pb-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <TableSkeleton rows={8} />
    </section>
  )
}
