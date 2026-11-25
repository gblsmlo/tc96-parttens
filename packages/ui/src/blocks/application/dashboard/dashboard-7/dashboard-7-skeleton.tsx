import { cn } from '@tc96/utils'
import {
  KpiSkeleton,
  PanelSkeleton,
  TableSkeleton,
} from '../shared/dashboard-skeleton-parts'

export function Dashboard7Skeleton({
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
      <h2 className="font-semibold text-lg">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <PanelSkeleton height={260} />
        <PanelSkeleton height={160} />
      </div>
      <TableSkeleton rows={6} />
    </section>
  )
}
