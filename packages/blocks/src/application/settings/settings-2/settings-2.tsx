import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsSelect } from '../shared/settings-select'
import { defaultSettings2Labels } from './labels'
import { Settings2Skeleton } from './settings-2-skeleton'
import type { Settings2Props } from './types'

export function Settings2({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onValueChange,
  options,
  values,
}: Readonly<Settings2Props>) {
  const labels = { ...defaultSettings2Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings2Skeleton />,
  })

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.generalTitle}</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        {loadState ?? (
          <SettingsRow
            description={labels.displayNamesDescription}
            endSlot={
              <SettingsSelect
                ariaLabel={labels.displayNames}
                items={options.displayNames}
                onValueChange={(next) => onValueChange?.('displayNames', next)}
                value={values.displayNames}
              />
            }
            title={labels.displayNames}
          />
        )}
      </SettingsSection>
      {loadState ? null : (
        <SettingsSection
          header={
            <SettingsSectionHeader>
              <SettingsSectionTitle>
                {labels.interfaceTitle}
              </SettingsSectionTitle>
            </SettingsSectionHeader>
          }
        >
          <SettingsRow
            description={labels.fontSizeDescription}
            endSlot={
              <SettingsSelect
                ariaLabel={labels.fontSize}
                items={options.fontSize}
                onValueChange={(next) => onValueChange?.('fontSize', next)}
                value={values.fontSize}
              />
            }
            title={labels.fontSize}
          />
          <SettingsRow
            description={labels.underlineLinksDescription}
            endSlot={
              <Switch
                aria-label={labels.underlineLinks}
                checked={values.underlineLinks}
                onCheckedChange={(next) =>
                  onValueChange?.('underlineLinks', next)
                }
              />
            }
            title={labels.underlineLinks}
          />
          <SettingsRow
            description={labels.themeDescription}
            endSlot={
              <SettingsSelect
                ariaLabel={labels.theme}
                items={options.theme}
                onValueChange={(next) => onValueChange?.('theme', next)}
                value={values.theme}
              />
            }
            title={labels.theme}
          />
        </SettingsSection>
      )}
    </div>
  )
}
