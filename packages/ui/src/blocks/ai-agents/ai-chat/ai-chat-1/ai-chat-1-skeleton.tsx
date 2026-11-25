import { Skeleton } from '@tc96/ui/skeleton'

export function AiChat1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6"
    >
      <Skeleton className="ms-auto h-10 w-2/5 rounded-2xl" />
      <div className="flex gap-3">
        <Skeleton className="size-7 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <Skeleton className="ms-auto h-10 w-1/3 rounded-2xl" />
    </section>
  )
}
