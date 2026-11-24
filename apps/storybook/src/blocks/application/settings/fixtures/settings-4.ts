import type {
  Settings4Option,
  Settings4ThemeGroup,
} from '@tc96/ui/blocks/application/settings/settings-4'
import {
  type ThemePreset,
  themePresets,
} from '../../../../../../example/packages/ui/src/themes/presets.ts'

export interface Settings4Data {
  colorTheme: string
  mode: string
  modeOptions: Settings4Option[]
  themeGroups: Settings4ThemeGroup[]
}

const presetOptions = (source: ThemePreset['source']): Settings4Option[] =>
  themePresets
    .filter((preset) => preset.source === source)
    .map(({ title, value }) => ({ label: title, value }))

export const settings4Data: Settings4Data = {
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
