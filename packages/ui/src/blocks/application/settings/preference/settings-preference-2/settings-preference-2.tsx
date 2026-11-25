import { BellIcon, TextTIcon, TranslateIcon } from '@phosphor-icons/react'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsSelect } from '../../shared/settings-select'
import { defaultSettingsPreference2Labels } from './labels'
import { SettingsPreference2Skeleton } from './settings-preference-2-skeleton'
import type { SettingsPreference2Props } from './types'

export function SettingsPreference2({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onValueChange,
  options,
  values,
}: Readonly<SettingsPreference2Props>) {
  const labels = { ...defaultSettingsPreference2Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsPreference2Skeleton />,
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
        <>
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
            startSlot={<TextTIcon aria-hidden="true" />}
            title={labels.fontSize}
          />
          <SettingsRow
            description={labels.languageDescription}
            endSlot={
              <SettingsSelect
                ariaLabel={labels.language}
                items={options.language}
                onValueChange={(next) => onValueChange?.('language', next)}
                value={values.language}
              />
            }
            startSlot={<TranslateIcon aria-hidden="true" />}
            title={labels.language}
          />
          <SettingsRow
            description={labels.emailNotificationsDescription}
            endSlot={
              <Switch
                aria-label={labels.emailNotifications}
                checked={values.emailNotifications}
                onCheckedChange={(next) =>
                  onValueChange?.('emailNotifications', next)
                }
              />
            }
            startSlot={<BellIcon aria-hidden="true" />}
            title={labels.emailNotifications}
          />
        </>
      )}
    </SettingsSection>
  )
}
