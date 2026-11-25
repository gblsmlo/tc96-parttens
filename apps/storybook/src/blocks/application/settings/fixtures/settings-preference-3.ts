import type {
  SettingsPreference3Option,
  SettingsPreference3ThemeGroup,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-3'
import {
  type ThemePreset,
  themePresets,
} from '../../../../../../example/packages/ui/src/themes/presets.ts'

export interface SettingsPreference3Data {
  colorTheme: string
  mode: string
  modeOptions: SettingsPreference3Option[]
  themeGroups: SettingsPreference3ThemeGroup[]
}

const presetOptions = (
  source: ThemePreset['source'],
): SettingsPreference3Option[] =>
  themePresets
    .filter((preset) => preset.source === source)
    .map(({ title, value }) => ({ label: title, value }))

export const settingsPreference3Data: SettingsPreference3Data = {
  colorTheme: 'default',
  mode: 'system',
  modeOptions: [
    { label: 'Sistema', value: 'system' },
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
  ],
  themeGroups: [
    { id: 'tc96', options: presetOptions('tc96') },
    { id: 'coss', label: 'Cores base', options: presetOptions('coss') },
    { id: 'tweakcn', label: 'tweakcn', options: presetOptions('tweakcn') },
  ],
}
