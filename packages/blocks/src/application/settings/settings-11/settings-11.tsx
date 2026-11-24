import { SettingsCollapsed } from '@tc96/parttens/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings11Labels } from './labels'
import type { Settings11Action, Settings11Props } from './types'

export function Settings11({
  className,
  groups,
  labels: labelsProp,
  onCreate,
  onStatusAction,
}: Readonly<Settings11Props>) {
  const labels = { ...defaultSettings11Labels, ...labelsProp }
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
                          onStatusAction(id, action as Settings11Action)
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
    </SettingsSection>
  )
}
