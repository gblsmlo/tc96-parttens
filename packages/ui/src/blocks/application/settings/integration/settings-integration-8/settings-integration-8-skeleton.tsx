import { Skeleton } from '@tc96/ui/skeleton'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']

export function SettingsIntegration8Skeleton() {
  return (
    <div className="grid gap-2 rounded-md border p-3">
      {rows.map((id) => (
        <div
          className="grid grid-cols-[3fr_2fr_1fr_auto] items-center gap-4 py-1"
          key={id}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-5 w-32 rounded-sm" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )
}
