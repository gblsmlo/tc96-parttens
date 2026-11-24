import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { CardPanel } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'

const rowKeys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

export function KpiSkeleton() {
  return (
    <WidgetShell>
      <CardPanel className="grid gap-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-16" />
      </CardPanel>
    </WidgetShell>
  )
}

export function PanelSkeleton({
  className,
  height = 220,
}: Readonly<{ className?: string; height?: number }>) {
  return (
    <WidgetShell className={className}>
      <CardPanel className="grid gap-4 p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton style={{ height }} />
      </CardPanel>
    </WidgetShell>
  )
}

export function TableSkeleton({
  className,
  rows = 5,
}: Readonly<{ className?: string; rows?: number }>) {
  return (
    <WidgetShell className={className}>
      <CardPanel className="grid gap-3 p-5">
        <Skeleton className="h-5 w-40" />
        {rowKeys.slice(0, rows).map((key) => (
          <Skeleton className="h-8" key={key} />
        ))}
      </CardPanel>
    </WidgetShell>
  )
}
