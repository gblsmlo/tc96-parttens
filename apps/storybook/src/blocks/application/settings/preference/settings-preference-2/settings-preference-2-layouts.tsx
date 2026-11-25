import {
  SettingsPreference2,
  type SettingsPreference2Props,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-2'
import { settingsPreference2Data } from '../../fixtures/settings-preference-2.ts'
import type { SettingsPreference2Controls } from './settings-preference-2-controls.ts'

interface ComposedSettingsPreference2Props extends SettingsPreference2Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onValueChange?: SettingsPreference2Props['onValueChange']
}

const ignore = () => undefined

export const ComposedSettingsPreference2 = ({
  error,
  onRetry,
  pending,
  emailNotifications,
  emailNotificationsLabel,
  fontSize,
  fontSizeLabel,
  language,
  languageLabel,
  onValueChange = ignore,
  title,
  withValueChange,
}: Readonly<ComposedSettingsPreference2Props>) => (
  <SettingsPreference2
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{
      emailNotifications: emailNotificationsLabel,
      fontSize: fontSizeLabel,
      language: languageLabel,
      title,
    }}
    onValueChange={withValueChange ? onValueChange : undefined}
    options={settingsPreference2Data.options}
    values={{ emailNotifications, fontSize, language }}
  />
)
