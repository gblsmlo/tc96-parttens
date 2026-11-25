import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'

const placeholders = ['a', 'b', 'c', 'd', 'e', 'f']

export function SettingsIntegration6Skeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {placeholders.map((id) => (
        <Card key={id}>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
