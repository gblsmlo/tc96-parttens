import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsPreference3Controls {
  colorTheme: string
  mode: string
  modeDescription: string
  modeLabel: string
  themeDescription: string
  themeLabel: string
  title: string
  withChanges: boolean
}

export const settingsPreference3ControlArgs: SettingsPreference3Controls = {
  colorTheme: 'twincan',
  mode: 'system',
  modeDescription: 'Claro, escuro ou a configuração do seu sistema',
  modeLabel: 'Modo',
  themeDescription: 'Cores, raio e fontes da interface',
  themeLabel: 'Tema',
  title: 'Aparência',
  withChanges: true,
}

export const settingsPreference3ControlArgTypes: Partial<
  ArgTypes<SettingsPreference3Controls>
> = {
  colorTheme: {
    control: 'select',
    description: 'Passes `colorTheme`, the preset shown in the theme select.',
    options: ['twincan', 'stone', 'zinc'],
  },
  mode: {
    control: 'select',
    description: 'Passes `mode`, the option shown in the mode select.',
    options: ['system', 'light', 'dark'],
  },
  modeDescription: {
    control: 'text',
    description: 'Text of `labels.modeDescription`, under the mode row title.',
  },
  modeLabel: {
    control: 'text',
    description: 'Text of `labels.mode`, the mode row title.',
  },
  themeDescription: {
    control: 'text',
    description:
      'Text of `labels.themeDescription`, under the theme row title.',
  },
  themeLabel: {
    control: 'text',
    description: 'Text of `labels.theme`, the theme row title.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withChanges: {
    control: 'boolean',
    description:
      'Passes `onModeChange` and `onColorThemeChange`; off leaves both selects showing their values without a handler.',
  },
}
