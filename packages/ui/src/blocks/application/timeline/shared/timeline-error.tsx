import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'

export interface TimelineErrorProps {
  description: string
  onRetry?: () => void
  retry: string
  title: string
}

export function TimelineError({
  description,
  onRetry,
  retry,
  title,
}: Readonly<TimelineErrorProps>) {
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
