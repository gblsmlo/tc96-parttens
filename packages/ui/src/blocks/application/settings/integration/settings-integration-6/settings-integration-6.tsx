import { Button } from '@tc96/ui/button'
import { Card, CardFooter, CardHeader } from '@tc96/ui/card'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Switch } from '@tc96/ui/switch'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { SettingsAppLogo } from '../../shared/settings-app-logo'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsIntegration6Labels } from './labels'
import { SettingsIntegration6Skeleton } from './settings-integration-6-skeleton'
import type {
  SettingsIntegration6App,
  SettingsIntegration6Labels,
  SettingsIntegration6Props,
} from './types'

interface AppCardProps {
  app: SettingsIntegration6App
  labels: SettingsIntegration6Labels
  onConnect?: SettingsIntegration6Props['onConnect']
  onDisconnect?: SettingsIntegration6Props['onDisconnect']
  onEnabledChange?: SettingsIntegration6Props['onEnabledChange']
}

function AppCard({
  app,
  labels,
  onConnect,
  onDisconnect,
  onEnabledChange,
}: Readonly<AppCardProps>) {
  const action = app.connected ? onDisconnect : onConnect

  return (
    <Card data-slot="settings-integration-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SettingsAppLogo logo={app.logo} name={app.name} />
          <h3 className="font-medium text-sm">{app.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm">{app.description}</p>
      </CardHeader>
      <CardFooter className="justify-between gap-3">
        {action ? (
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
        ) : (
          <span />
        )}
        <Switch
          aria-label={labels.enableAction(app.name)}
          checked={app.connected && app.enabled}
          disabled={!app.connected}
          onCheckedChange={(next) => onEnabledChange?.(app.id, next)}
        />
      </CardFooter>
    </Card>
  )
}

export function SettingsIntegration6({
  error,
  onRetry,
  pending,
  apps,
  className,
  labels: labelsProp,
  onConnect,
  onDisconnect,
  onEnabledChange,
}: Readonly<SettingsIntegration6Props>) {
  const labels = { ...defaultSettingsIntegration6Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration6Skeleton />,
  })

  const titleId = `settings-integration-6-title-${useId()}`

  return (
    <section
      aria-labelledby={titleId}
      className={cn('mx-auto flex w-full max-w-5xl flex-col gap-3', className)}
      data-slot="settings-section"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Text
          render={<h2 id={titleId}>{labels.title}</h2>}
          size="base"
          weight="medium"
        />
        <Text
          foreground="muted"
          render={<p>{labels.description}</p>}
          size="sm"
        />
      </div>
      {loadState ??
        (apps.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard
                app={app}
                key={app.id}
                labels={labels}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                onEnabledChange={onEnabledChange}
              />
            ))}
          </div>
        ))}
    </section>
  )
}
