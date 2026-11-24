import { WarningIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings19Labels } from './labels'
import { Settings19Skeleton } from './settings-19-skeleton'
import type {
  Settings19Action,
  Settings19Endpoint,
  Settings19Labels,
  Settings19Props,
} from './types'

interface EndpointRowProps {
  endpoint: Settings19Endpoint
  labels: Settings19Labels
  onEnabledChange?: Settings19Props['onEnabledChange']
  onEndpointAction?: Settings19Props['onEndpointAction']
}

function EndpointRow({
  endpoint,
  labels,
  onEnabledChange,
  onEndpointAction,
}: Readonly<EndpointRowProps>) {
  return (
    <SettingsRow
      description={`${labels.eventCount(endpoint.events)} · ${labels.lastDelivery(endpoint.lastDelivery)}`}
      endSlot={
        <div className="flex items-center gap-3">
          {endpoint.failing ? (
            <Badge variant="error">{labels.failing}</Badge>
          ) : null}
          <Switch
            aria-label={labels.enable(endpoint.url)}
            checked={endpoint.enabled}
            onCheckedChange={(next) => onEnabledChange?.(endpoint.id, next)}
          />
          {onEndpointAction ? (
            <SettingsRowActions
              actions={[
                { id: 'edit', label: labels.edit },
                { id: 'send-test', label: labels.sendTest },
                { destructive: true, id: 'delete', label: labels.delete },
              ]}
              label={labels.actions(endpoint.url)}
              onAction={(action) =>
                onEndpointAction(endpoint.id, action as Settings19Action)
              }
            />
          ) : null}
        </div>
      }
      title={endpoint.url}
    />
  )
}

export function Settings19({
  error,
  onRetry,
  pending,
  className,
  endpoints,
  labels: labelsProp,
  onCreate,
  onEnabledChange,
  onEndpointAction,
}: Readonly<Settings19Props>) {
  const labels = { ...defaultSettings19Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings19Skeleton />,
  })
  const failingCount = endpoints.filter((endpoint) => endpoint.failing).length

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-4', className)}
    >
      {!loadState && failingCount > 0 ? (
        <Alert variant="error">
          <WarningIcon aria-hidden="true" />
          <AlertTitle>{labels.failingTitle}</AlertTitle>
          <AlertDescription>
            {labels.failingDescription(failingCount)}
          </AlertDescription>
        </Alert>
      ) : null}
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              onCreate ? (
                <Button onClick={onCreate} size="sm">
                  {labels.newEndpoint}
                </Button>
              ) : undefined
            }
          >
            <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
            <SettingsSectionDescription>
              {labels.description}
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {loadState ??
          (endpoints.length === 0 ? (
            <StateSurface
              description={labels.emptyDescription}
              kind="empty"
              title={labels.emptyTitle}
            />
          ) : (
            endpoints.map((endpoint) => (
              <EndpointRow
                endpoint={endpoint}
                key={endpoint.id}
                labels={labels}
                onEnabledChange={onEnabledChange}
                onEndpointAction={onEndpointAction}
              />
            ))
          ))}
      </SettingsSection>
    </div>
  )
}
