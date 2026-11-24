import { Skeleton } from '@tc96/ui/skeleton'

export function Timeline3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className="flex w-max items-start"
    >
      {[0, 1, 2].map((index) => (
        <div className="flex items-start" key={index}>
          <div className="grid w-64 gap-3 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          {index < 2 ? <Skeleton className="mt-8 h-px w-6" /> : null}
        </div>
      ))}
    </output>
  )
}
