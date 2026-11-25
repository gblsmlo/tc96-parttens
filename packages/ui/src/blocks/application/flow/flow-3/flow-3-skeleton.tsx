import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'

export function Flow3Skeleton({
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
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid h-96 grid-cols-3 content-center gap-8 rounded-xl border p-6">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="grid content-start gap-4 rounded-xl border p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </section>
  )
}
