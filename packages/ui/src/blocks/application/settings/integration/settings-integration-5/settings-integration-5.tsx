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
import { SettingsAppLogo } from '../../shared/settings-app-logo'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsIntegration5Labels } from './labels'
import { SettingsIntegration5Skeleton } from './settings-integration-5-skeleton'
import type {
  SettingsIntegration5App,
  SettingsIntegration5Labels,
  SettingsIntegration5Props,
} from './types'

interface AppBlockProps {
  app: SettingsIntegration5App
  labels: SettingsIntegration5Labels
  onChannelChange?: SettingsIntegration5Props['onChannelChange']
  onConnect?: SettingsIntegration5Props['onConnect']
  onDisconnect?: SettingsIntegration5Props['onDisconnect']
}

function AppBlock({
  app,
  labels,
  onChannelChange,
  onConnect,
  onDisconnect,
}: Readonly<AppBlockProps>) {
  const action = app.connected ? onDisconnect : onConnect

  return (
    <div data-slot="settings-integration-app">
      <SettingsRow
        description={app.description}
        endSlot={
          action ? (
            <Button
              aria-label={
                app.connected
                  ? labels.disconnectAction(app.name)
                  : labels.connectAction(app.name)
              }
              onClick={() => action(app.id)}
              size="sm"
              variant={app.connected ? 'outline' : 'default'}
            >
              {app.connected ? labels.disconnect : labels.connect}
            </Button>
          ) : null
        }
        startSlot={<SettingsAppLogo logo={app.logo} name={app.name} />}
        title={app.name}
      />
      {app.connected && app.channels?.length ? (
        <div className="flex flex-col ps-12" data-slot="settings-channels">
          {app.channels.map((channel) => (
            <SettingsRow
              description={channel.description}
              endSlot={
                <Switch
                  aria-label={labels.channelAction(app.name, channel.label)}
                  checked={channel.enabled}
                  onCheckedChange={(next) =>
                    onChannelChange?.(app.id, channel.id, next)
                  }
                />
              }
              key={channel.id}
              title={channel.label}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SettingsIntegration5({
  error,
  onRetry,
  pending,
  apps,
  className,
  labels: labelsProp,
  onChannelChange,
  onConnect,
  onDisconnect,
}: Readonly<SettingsIntegration5Props>) {
  const labels = { ...defaultSettingsIntegration5Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration5Skeleton />,
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
            <AppBlock
              app={app}
              key={app.id}
              labels={labels}
              onChannelChange={onChannelChange}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          ))
        ))}
    </SettingsSection>
  )
}
