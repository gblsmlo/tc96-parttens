import {
  Settings4,
  type Settings4Props,
} from '@tc96/blocks/application/settings/settings-4'
import { settings4Data } from '../fixtures/settings-4.ts'
import type { Settings4Controls } from './settings-4-controls.ts'

interface ComposedSettings4Props extends Settings4Controls {
  onColorThemeChange?: Settings4Props['onColorThemeChange']
  onModeChange?: Settings4Props['onModeChange']
}

const ignore = () => undefined

export const ComposedSettings4 = ({
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
}: Readonly<ComposedSettings4Props>) => (
  <Settings4
    colorTheme={colorTheme}
    labels={{
      mode: modeLabel,
      modeDescription,
      theme: themeLabel,
      themeDescription,
      title,
    }}
    mode={mode}
    modeOptions={settings4Data.modeOptions}
    onColorThemeChange={withChanges ? onColorThemeChange : undefined}
    onModeChange={withChanges ? onModeChange : undefined}
    themeGroups={settings4Data.themeGroups}
  />
)
