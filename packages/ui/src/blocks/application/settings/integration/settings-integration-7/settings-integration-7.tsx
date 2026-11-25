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
import { defaultSettingsIntegration7Labels } from './labels'
import { SettingsIntegration7Skeleton } from './settings-integration-7-skeleton'
import type {
  SettingsIntegration7App,
  SettingsIntegration7Labels,
  SettingsIntegration7Props,
} from './types'

const statusBadge = {
  available: { key: 'available', variant: 'secondary' },
  connected: { key: 'connected', variant: 'success' },
  preview: { key: 'preview', variant: 'outline' },
} as const

interface ConnectorRowProps {
  app: SettingsIntegration7App
  labels: SettingsIntegration7Labels
  onAction?: SettingsIntegration7Props['onAction']
}

function ConnectorRow({ app, labels, onAction }: Readonly<ConnectorRowProps>) {
  const badge = statusBadge[app.status]

  return (
    <SettingsRow
      description={app.description}
      endSlot={
        <div className="flex items-center gap-3">
          <Badge variant={badge.variant}>{labels[badge.key]}</Badge>
          {onAction ? (
            <Button
              aria-label={labels.action(app.name, app.actionLabel)}
              onClick={() => onAction(app.id)}
              size="sm"
              variant={app.status === 'connected' ? 'outline' : 'default'}
            >
              {app.actionLabel}
            </Button>
          ) : null}
        </div>
      }
      startSlot={<SettingsAppLogo logo={app.logo} name={app.name} />}
      title={app.name}
    />
  )
}

export function SettingsIntegration7({
  error,
  onRetry,
  pending,
  apps,
  className,
  labels: labelsProp,
  onAction,
  onBuild,
}: Readonly<SettingsIntegration7Props>) {
  const labels = { ...defaultSettingsIntegration7Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration7Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onBuild ? (
              <Button onClick={onBuild} size="sm" variant="outline">
                {labels.build}
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
        (apps.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          apps.map((app) => (
            <ConnectorRow
              app={app}
              key={app.id}
              labels={labels}
              onAction={onAction}
            />
          ))
        ))}
    </SettingsSection>
  )
}
