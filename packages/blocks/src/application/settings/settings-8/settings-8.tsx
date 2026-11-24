import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { defaultSettings8Labels } from './labels'
import type { Settings8Props } from './types'

export function Settings8({
  className,
  enabled = false,
  labels: labelsProp,
  onEnabledChange,
}: Readonly<Settings8Props>) {
  const labels = { ...defaultSettings8Labels, ...labelsProp }

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description={labels.description}
        endSlot={
          <Switch
            aria-label={labels.enable}
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        }
        title={labels.enable}
      />
    </SettingsSection>
  )
}
