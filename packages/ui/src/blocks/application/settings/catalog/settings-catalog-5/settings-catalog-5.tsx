import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { SettingsCollapsed } from '@tc96/ui/patterns/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsCatalog5Labels } from './labels'
import { SettingsCatalog5Skeleton } from './settings-catalog-5-skeleton'
import type { SettingsCatalog5Action, SettingsCatalog5Props } from './types'

export function SettingsCatalog5({
  error,
  onRetry,
  pending,
  className,
  groups,
  labels: labelsProp,
  onCreate,
  onStatusAction,
}: Readonly<SettingsCatalog5Props>) {
  const labels = { ...defaultSettingsCatalog5Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog5Skeleton />,
  })
  const actions = [
    { id: 'edit', label: labels.edit },
    { destructive: true, id: 'delete', label: labels.delete },
  ]

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newStatus}
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
      {loadState ?? (
        <div>
          {groups.map((group) => (
            <SettingsCollapsed key={group.id} title={group.title}>
              {group.statuses.map(
                ({ icon: StatusIcon, id, label, projects, toneClassName }) => (
                  <SettingsRow
                    description={
                      projects === undefined
                        ? undefined
                        : labels.projects(projects)
                    }
                    endSlot={
                      onStatusAction ? (
                        <SettingsRowActions
                          actions={actions}
                          label={labels.actions(label)}
                          onAction={(action) =>
                            onStatusAction(id, action as SettingsCatalog5Action)
                          }
                        />
                      ) : undefined
                    }
                    key={id}
                    startSlot={
                      <IconFrame className={toneClassName} shape="rounded">
                        <StatusIcon aria-hidden="true" className="size-4" />
                      </IconFrame>
                    }
                    title={label}
                  />
                ),
              )}
            </SettingsCollapsed>
          ))}
        </div>
      )}
    </SettingsSection>
  )
}
