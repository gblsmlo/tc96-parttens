import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'

export interface DashboardErrorProps {
  description: string
  onRetry?: () => void
  retry: string
  title: string
}

export function DashboardError({
  description,
  onRetry,
  retry,
  title,
}: Readonly<DashboardErrorProps>) {
  return (
    <StateSurface
      actions={
        onRetry ? (
          <Button onClick={onRetry} size="sm" variant="outline">
            {retry}
          </Button>
        ) : undefined
      }
      description={description}
      kind="error"
      title={title}
    />
  )
}
