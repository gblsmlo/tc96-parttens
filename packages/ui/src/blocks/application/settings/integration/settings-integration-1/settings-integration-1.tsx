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
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsIntegration1Labels } from './labels'
import { SettingsIntegration1Skeleton } from './settings-integration-1-skeleton'
import type {
  SettingsIntegration1Action,
  SettingsIntegration1Endpoint,
  SettingsIntegration1Labels,
  SettingsIntegration1Props,
} from './types'

interface EndpointRowProps {
  endpoint: SettingsIntegration1Endpoint
  labels: SettingsIntegration1Labels
  onEnabledChange?: SettingsIntegration1Props['onEnabledChange']
  onEndpointAction?: SettingsIntegration1Props['onEndpointAction']
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
                onEndpointAction(
                  endpoint.id,
                  action as SettingsIntegration1Action,
                )
              }
            />
          ) : null}
        </div>
      }
      title={endpoint.url}
    />
  )
}

export function SettingsIntegration1({
  error,
  onRetry,
  pending,
  className,
  endpoints,
  labels: labelsProp,
  onCreate,
  onEnabledChange,
  onEndpointAction,
}: Readonly<SettingsIntegration1Props>) {
  const labels = { ...defaultSettingsIntegration1Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration1Skeleton />,
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
