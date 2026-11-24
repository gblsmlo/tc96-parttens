import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings21Labels } from './labels'
import { Settings21Skeleton } from './settings-21-skeleton'
import type { Settings21App, Settings21Labels, Settings21Props } from './types'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

const statusBadge = {
  connected: { key: 'connected', variant: 'success' },
  disconnected: { key: 'disconnected', variant: 'secondary' },
  error: { key: 'error', variant: 'error' },
} as const

interface AppRowProps {
  app: Settings21App
  labels: Settings21Labels
  onConnect?: Settings21Props['onConnect']
  onDisconnect?: Settings21Props['onDisconnect']
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
      startSlot={
        <IconFrame shape="rounded" size="lg">
          {initials(app.name)}
        </IconFrame>
      }
      title={app.name}
    />
  )
}

export function Settings21({
  error,
  onRetry,
  pending,
  apps,
  className,
  labels: labelsProp,
  onConnect,
  onDisconnect,
}: Readonly<Settings21Props>) {
  const labels = { ...defaultSettings21Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings21Skeleton />,
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
