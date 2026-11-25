import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsCatalog2Labels } from './labels'
import { SettingsCatalog2Skeleton } from './settings-catalog-2-skeleton'
import type { SettingsCatalog2Props } from './types'

export function SettingsCatalog2({
  error,
  onRetry,
  pending,
  className,
  enabled = false,
  labels: labelsProp,
  onEnabledChange,
}: Readonly<SettingsCatalog2Props>) {
  const labels = { ...defaultSettingsCatalog2Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog2Skeleton />,
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
