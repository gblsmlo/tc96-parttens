import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsCatalog2Controls {
  enabled: boolean
  description: string
  enable: string
  title: string
}

export const settingsCatalog2ControlArgs: SettingsCatalog2Controls = {
  enabled: false,
  description:
    'Aplique prazos às issues que correspondem às regras de automação',
  enable: 'Ativar SLAs',
  title: 'SLAs',
}

export const settingsCatalog2ControlArgTypes: Partial<
  ArgTypes<SettingsCatalog2Controls>
> = {
  enabled: {
    control: 'boolean',
    description: 'Passes `enabled`, whether the switch is on.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  enable: {
    control: 'text',
    description: 'Text of `labels.enable`, the name of the switch.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
}
