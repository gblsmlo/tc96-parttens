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
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsIntegration4Labels } from './labels'
import { SettingsIntegration4Skeleton } from './settings-integration-4-skeleton'
import type {
  SettingsIntegration4Action,
  SettingsIntegration4App,
  SettingsIntegration4Labels,
  SettingsIntegration4Props,
} from './types'

interface AppRowProps {
  app: SettingsIntegration4App
  labels: SettingsIntegration4Labels
  onAction?: SettingsIntegration4Props['onAction']
}

function AppRow({ app, labels, onAction }: Readonly<AppRowProps>) {
  return (
    <SettingsRow
      description={app.description}
      endSlot={
        <div className="flex items-center gap-3">
          <Badge variant={app.status === 'connected' ? 'success' : 'warning'}>
            {app.status === 'connected' ? labels.connected : labels.review}
          </Badge>
          {onAction ? (
            <SettingsRowActions
              actions={[
                { id: 'sync', label: labels.sync },
                { id: 'manage', label: labels.manage },
                {
                  destructive: true,
                  id: 'disconnect',
                  label: labels.disconnect,
                },
              ]}
              label={labels.actions(app.name)}
              onAction={(action) =>
                onAction(app.id, action as SettingsIntegration4Action)
              }
            />
          ) : null}
        </div>
      }
      startSlot={<SettingsAppLogo logo={app.logo} name={app.name} />}
      title={app.name}
    />
  )
}

export function SettingsIntegration4({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onAction,
  onCreate,
  sections,
}: Readonly<SettingsIntegration4Props>) {
  const labels = { ...defaultSettingsIntegration4Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration4Skeleton />,
  })
  const visible = sections.filter((section) => section.apps.length > 0)

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-6', className)}
    >
      <SettingsSectionHeader
        actions={
          onCreate ? (
            <Button onClick={onCreate} size="sm">
              {labels.newConnection}
            </Button>
          ) : undefined
        }
      >
        <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
        <SettingsSectionDescription>
          {labels.description}
        </SettingsSectionDescription>
      </SettingsSectionHeader>
      {loadState ??
        (visible.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          visible.map((section) => (
            <SettingsSection
              header={
                <SettingsSectionHeader>
                  <SettingsSectionTitle>{section.title}</SettingsSectionTitle>
                </SettingsSectionHeader>
              }
              key={section.id}
            >
              {section.apps.map((app) => (
                <AppRow
                  app={app}
                  key={app.id}
                  labels={labels}
                  onAction={onAction}
                />
              ))}
            </SettingsSection>
          ))
        ))}
    </div>
  )
}
