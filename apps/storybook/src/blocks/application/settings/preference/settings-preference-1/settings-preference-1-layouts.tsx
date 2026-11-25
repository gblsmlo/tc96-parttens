import {
  SettingsPreference1,
  type SettingsPreference1Props,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-1'
import {
  settingsPreference1Options,
  settingsPreference1Values,
} from '../../fixtures/settings-preference-1.ts'
import type { SettingsPreference1Controls } from './settings-preference-1-controls.ts'

interface ComposedSettingsPreference1Props extends SettingsPreference1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onValueChange?: SettingsPreference1Props['onValueChange']
}

export const ComposedSettingsPreference1 = ({
  error,
  onRetry,
  pending,
  interfaceTitle,
  onValueChange,
  themeDescription,
  themeValue,
  underlineLinks,
}: Readonly<ComposedSettingsPreference1Props>) => (
  <SettingsPreference1
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ interfaceTitle, themeDescription }}
    onValueChange={onValueChange}
    options={settingsPreference1Options}
    values={{ ...settingsPreference1Values, theme: themeValue, underlineLinks }}
  />
)
