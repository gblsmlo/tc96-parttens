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
import { cn } from '@tc96/utils'
import { SettingsAppLogo } from '../../shared/settings-app-logo'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsIntegration2Labels } from './labels'
import { SettingsIntegration2Skeleton } from './settings-integration-2-skeleton'
import type {
  SettingsIntegration2App,
  SettingsIntegration2Labels,
  SettingsIntegration2Props,
} from './types'

const statusBadge = {
  connected: { key: 'connected', variant: 'success' },
  disconnected: { key: 'disconnected', variant: 'secondary' },
  error: { key: 'error', variant: 'error' },
} as const

interface AppRowProps {
  app: SettingsIntegration2App
  labels: SettingsIntegration2Labels
  onConnect?: SettingsIntegration2Props['onConnect']
  onDisconnect?: SettingsIntegration2Props['onDisconnect']
}

function AppRow({
  app,
  labels,
  onConnect,
  onDisconnect,
}: Readonly<AppRowProps>) {
  const badge = statusBadge[app.status]

  return (
    <SettingsRow
      description={app.description}
      endSlot={
        <div className="flex items-center gap-3">
          <Badge variant={badge.variant}>{labels[badge.key]}</Badge>
          {app.status === 'connected' ? (
            onDisconnect ? (
              <Button
                aria-label={labels.disconnectAction(app.name)}
                onClick={() => onDisconnect(app.id)}
                size="sm"
                variant="outline"
              >
                {labels.disconnect}
              </Button>
            ) : null
          ) : onConnect ? (
            <Button
              aria-label={
                app.status === 'error'
                  ? labels.reconnectAction(app.name)
                  : labels.connectAction(app.name)
              }
              onClick={() => onConnect(app.id)}
              size="sm"
              variant={app.status === 'error' ? 'outline' : 'default'}
            >
              {app.status === 'error' ? labels.reconnect : labels.connect}
            </Button>
          ) : null}
        </div>
      }
      startSlot={<SettingsAppLogo logo={app.logo} name={app.name} />}
      title={app.name}
    />
  )
}

export function SettingsIntegration2({
  error,
  onRetry,
  pending,
  apps,
  className,
  labels: labelsProp,
  onConnect,
  onDisconnect,
}: Readonly<SettingsIntegration2Props>) {
  const labels = { ...defaultSettingsIntegration2Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration2Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ??
        (apps.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          apps.map((app) => (
            <AppRow
              app={app}
              key={app.id}
              labels={labels}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          ))
        ))}
    </SettingsSection>
  )
}
