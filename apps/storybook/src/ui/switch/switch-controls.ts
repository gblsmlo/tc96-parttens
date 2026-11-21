import type { ArgTypes } from '@storybook/react-vite'
import { type SwitchSizeName, switchSizeNames } from './switch-variants.ts'

export interface SwitchControls {
  checked: boolean
  description: string
  disabled: boolean
  label: string
  readOnly: boolean
  size: SwitchSizeName
}

export const switchControlArgs: SwitchControls = {
  checked: false,
  description: '',
  disabled: false,
  label: 'Label text',
  readOnly: false,
  size: 'default',
}

export const switchControlArgTypes: Partial<ArgTypes<SwitchControls>> = {
  checked: {
    control: 'boolean',
    description: 'Starts the switch on, through `defaultChecked`.',
  },
  description: {
    control: 'text',
    description:
      'Text under the label, linked with `aria-describedby`; empty removes it.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Switch`.',
  },
  label: {
    control: 'text',
    description: 'Text of the `Label` that names the switch.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `Switch`: clicks and keys keep the value; it looks the same.',
  },
  size: {
    control: 'inline-radio',
    description:
      'Adds a story class that sets `--thumb-size` on `Switch` (`small`: `--spacing(4)`, `--spacing(3)` from `sm`); the component has one size.',
    options: switchSizeNames,
  },
}
