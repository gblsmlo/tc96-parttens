import {
  SettingsPreference3,
  type SettingsPreference3Props,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-3'
import { settingsPreference3Data } from '../../fixtures/settings-preference-3.ts'
import type { SettingsPreference3Controls } from './settings-preference-3-controls.ts'

interface ComposedSettingsPreference3Props extends SettingsPreference3Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onColorThemeChange?: SettingsPreference3Props['onColorThemeChange']
  onModeChange?: SettingsPreference3Props['onModeChange']
}

const ignore = () => undefined

export const ComposedSettingsPreference3 = ({
  error,
  onRetry,
  pending,
  colorTheme,
  mode,
  modeDescription,
  modeLabel,
  onColorThemeChange = ignore,
  onModeChange = ignore,
  themeDescription,
  themeLabel,
  title,
  withChanges,
}: Readonly<ComposedSettingsPreference3Props>) => (
  <SettingsPreference3
    error={error}
    onRetry={onRetry}
    pending={pending}
    colorTheme={colorTheme}
    labels={{
      mode: modeLabel,
      modeDescription,
      theme: themeLabel,
      themeDescription,
      title,
    }}
    mode={mode}
    modeOptions={settingsPreference3Data.modeOptions}
    onColorThemeChange={withChanges ? onColorThemeChange : undefined}
    onModeChange={withChanges ? onModeChange : undefined}
    themeGroups={settingsPreference3Data.themeGroups}
  />
)
