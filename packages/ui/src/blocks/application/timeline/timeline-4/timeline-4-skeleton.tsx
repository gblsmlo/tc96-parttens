import { Skeleton } from '@tc96/ui/skeleton'

export function Timeline4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <output aria-busy="true" aria-label={label} className="grid gap-6">
      {[0, 1, 2, 3].map((index) => (
        <div className="flex gap-3" key={index}>
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </output>
  )
}
