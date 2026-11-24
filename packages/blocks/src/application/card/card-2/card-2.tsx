import { CheckCircleIcon } from '@phosphor-icons/react'
import { getInitials } from '@tc96/helpers/initials'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { CardBadge } from '../shared/card-badge'
import { defaultCard2Labels } from './labels'
import type { Card2Integration, Card2Labels, Card2Props } from './types'

interface IntegrationCardProps {
  integration: Card2Integration
  labels: Card2Labels
  onConnect?: Card2Props['onConnect']
}

function IntegrationCard({
  integration,
  labels,
  onConnect,
}: Readonly<IntegrationCardProps>) {
  return (
    <WidgetShell data-integration={integration.id} render={<li />}>
      <CardPanel className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <IconFrame aria-hidden="true" shape="rounded" size="lg">
            {integration.icon ?? (
              <span className="font-medium text-sm">
                {getInitials(integration.name)}
              </span>
            )}
          </IconFrame>
          {integration.tier ? <CardBadge {...integration.tier} /> : null}
        </div>
        <div className="grid min-w-0 gap-1">
          <h3 className="truncate font-medium text-base">{integration.name}</h3>
          <p className="text-muted-foreground text-sm">
            {integration.description}
          </p>
        </div>
        <div className="mt-auto">
          {integration.connected ? (
            <span
              className="inline-flex items-center gap-1.5 text-sm text-success-foreground"
              data-status="connected"
            >
              <CheckCircleIcon aria-hidden="true" size={16} weight="fill" />
              {labels.connected}
            </span>
          ) : onConnect ? (
            <Button
              aria-label={labels.connectTo(integration.name)}
              onClick={() => onConnect(integration.id)}
              size="sm"
              variant="outline"
            >
              {labels.connect}
            </Button>
          ) : null}
        </div>
      </CardPanel>
    </WidgetShell>
  )
}

export function Card2({
  className,
  integrations,
  labels: labelsProp,
  onConnect,
}: Readonly<Card2Props>) {
  const labels = { ...defaultCard2Labels, ...labelsProp }

  return (
    <ul
      aria-label={labels.title}
      className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}
    >
      {integrations.map((integration) => (
        <IntegrationCard
          integration={integration}
          key={integration.id}
          labels={labels}
          onConnect={onConnect}
        />
      ))}
    </ul>
  )
}
