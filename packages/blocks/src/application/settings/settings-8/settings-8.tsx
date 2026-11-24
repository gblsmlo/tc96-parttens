import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings8Labels } from './labels'
import { Settings8Skeleton } from './settings-8-skeleton'
import type { Settings8Props } from './types'

export function Settings8({
  error,
  onRetry,
  pending,
  className,
  enabled = false,
  labels: labelsProp,
  onEnabledChange,
}: Readonly<Settings8Props>) {
  const labels = { ...defaultSettings8Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings8Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      {loadState ?? (
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
      )}
    </SettingsSection>
  )
}
