import { cn } from '@tc96/utils'
import {
  PanelSkeleton,
  TableSkeleton,
} from '../shared/dashboard-skeleton-parts'

export function Dashboard3Skeleton({
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
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <TableSkeleton />
        <TableSkeleton rows={4} />
      </div>
      <PanelSkeleton />
    </section>
  )
}
