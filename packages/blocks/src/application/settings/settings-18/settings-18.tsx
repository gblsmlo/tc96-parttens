import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Switch } from '@tc96/ui/switch'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { SettingsSelect } from '../shared/settings-select'
import { defaultSettings18Labels } from './labels'
import type { Settings18Props } from './types'

export function Settings18({
  capabilities,
  className,
  labels: labelsProp,
  onCapabilityChange,
  onRoleChange,
  roles,
  selectedRole,
}: Readonly<Settings18Props>) {
  const labels = { ...defaultSettings18Labels, ...labelsProp }

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-3xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            <SettingsSelect
              ariaLabel={labels.role}
              items={roles}
              onValueChange={onRoleChange}
              value={selectedRole}
            />
          }
        >
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {capabilities.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          {capabilities.map((capability) => (
            <li
              className="flex items-start justify-between gap-3 rounded-lg border p-4"
              key={capability.id}
            >
              <div className="min-w-0">
                <Text
                  render={<p>{capability.title}</p>}
                  size="sm"
                  weight="semibold"
                />
                <Text
                  foreground="muted"
                  render={<p>{capability.description}</p>}
                  size="sm"
                />
              </div>
              <Switch
                aria-label={capability.title}
                checked={capability.checked}
                onCheckedChange={(next) =>
                  onCapabilityChange?.(capability.id, next)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </SettingsSection>
  )
}
