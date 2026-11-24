import { CheckIcon } from '@phosphor-icons/react'
import { getInitials } from '@tc96/helpers/initials'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@tc96/ui/empty'
import { IconFrame } from '@tc96/ui/icon-frame'
import { useId } from 'react'
import { defaultEmptyState5Labels } from './labels'
import type { EmptyState5Connector, EmptyState5Props } from './types'

function ConnectorTile({
  connectLabel,
  connectedLabel,
  connector,
  onConnect,
}: Readonly<{
  connectLabel: string
  connectedLabel: string
  connector: EmptyState5Connector
  onConnect?: (id: string) => void
}>) {
  const nameId = useId()
  const buttonId = useId()

  return (
    <li
      className="flex items-center gap-3 rounded-lg border bg-card p-3 text-start"
      data-connected={connector.connected ? 'true' : 'false'}
      data-connector={connector.id}
    >
      <IconFrame shape="rounded">
        <span className="font-medium text-xs">
          {getInitials(connector.name)}
        </span>
      </IconFrame>
      <span className="min-w-0 flex-1 truncate font-medium text-sm" id={nameId}>
        {connector.name}
      </span>
      {connector.connected ? (
        <Badge variant="success">
          <CheckIcon aria-hidden="true" />
          {connectedLabel}
        </Badge>
      ) : onConnect ? (
        <Button
          aria-labelledby={`${buttonId} ${nameId}`}
          id={buttonId}
          onClick={() => onConnect(connector.id)}
          size="sm"
          variant="outline"
        >
          {connectLabel}
        </Button>
      ) : null}
    </li>
  )
}

export function EmptyState5({
  className,
  connectors,
  labels: labelsProp,
  onConnect,
}: Readonly<EmptyState5Props>) {
  const labels = { ...defaultEmptyState5Labels, ...labelsProp }

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyTitle>{labels.title}</EmptyTitle>
        <EmptyDescription>{labels.description}</EmptyDescription>
      </EmptyHeader>
      <ul
        aria-label={labels.connectors}
        className="grid w-full max-w-2xl gap-3 sm:grid-cols-2"
      >
        {connectors.map((connector) => (
          <ConnectorTile
            connectLabel={labels.connect}
            connectedLabel={labels.connected}
            connector={connector}
            key={connector.id}
            onConnect={onConnect}
          />
        ))}
      </ul>
    </Empty>
  )
}
