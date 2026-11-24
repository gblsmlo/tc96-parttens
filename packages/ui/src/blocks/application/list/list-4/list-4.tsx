import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { List } from '@tc96/ui/patterns/list/composition/list/list'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import { listLoadState } from '../shared/list-load-state'
import { defaultList4Labels } from './labels'
import { List4Skeleton } from './list-4-skeleton'
import type { List4Props } from './types'

export function List4({
  error,
  onRetry,
  pending,
  className,
  integrations,
  labels: labelsProp,
  onConnect,
}: Readonly<List4Props>) {
  const labels = { ...defaultList4Labels, ...labelsProp }
  const loadState = listLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <List4Skeleton label={labels.loading} />,
  })

  if (loadState)
    return (
      <section aria-label={labels.title} className={className}>
        {loadState}
      </section>
    )

  if (integrations.length === 0) {
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  }

  return (
    <ul aria-label={labels.title} className={cn('grid gap-2', className)}>
      {integrations.map((integration) => (
        <List
          actions={
            integration.connected ? (
              <Badge data-status="connected" variant="success">
                {labels.connected}
              </Badge>
            ) : onConnect ? (
              <Button
                aria-label={labels.connectTo(integration.name)}
                onClick={() => onConnect(integration.id)}
                size="sm"
                variant="outline"
              >
                {labels.connect}
              </Button>
            ) : null
          }
          description={integration.description}
          icon={
            <span aria-hidden="true" className="font-medium text-xs">
              {getInitials(integration.name)}
            </span>
          }
          key={integration.id}
          render={<li data-integration={integration.id} />}
          title={integration.name}
        />
      ))}
    </ul>
  )
}
