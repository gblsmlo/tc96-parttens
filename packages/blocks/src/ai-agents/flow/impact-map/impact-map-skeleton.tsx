import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'

export function ImpactMapSkeleton({
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
      <h3 className="font-medium text-base">{title}</h3>
      <div className="grid justify-items-center gap-10 rounded-xl border p-6">
        <Skeleton className="h-24 w-56 rounded-xl" />
        <div className="flex gap-6">
          <Skeleton className="h-24 w-56 rounded-xl" />
          <Skeleton className="h-24 w-56 rounded-xl" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-24 w-56 rounded-xl" />
          <Skeleton className="h-24 w-56 rounded-xl" />
          <Skeleton className="h-24 w-56 rounded-xl" />
        </div>
      </div>
    </section>
  )
}
