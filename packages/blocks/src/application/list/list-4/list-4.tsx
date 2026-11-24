import { getInitials } from '@tc96/helpers/initials'
import { List } from '@tc96/parttens/list/composition/list/list'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { defaultList4Labels } from './labels'
import type { List4Props } from './types'

export function List4({
  className,
  integrations,
  labels: labelsProp,
  onConnect,
}: Readonly<List4Props>) {
  const labels = { ...defaultList4Labels, ...labelsProp }

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
