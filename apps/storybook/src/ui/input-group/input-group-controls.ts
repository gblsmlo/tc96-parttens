import type { ArgTypes } from '@storybook/react-vite'
import {
  type InputGroupAlignName,
  type InputGroupSizeName,
  inputGroupAlignNames,
  inputGroupSizeNames,
} from './input-group-variants.ts'

export interface InputGroupControls {
  align: InputGroupAlignName
  button: boolean
  disabled: boolean
  endText: string
  icon: boolean
  invalid: boolean
  placeholder: string
  size: InputGroupSizeName
  text: string
  textarea: boolean
}

export const inputGroupControlArgs: InputGroupControls = {
  align: 'inline-start',
  button: false,
  disabled: false,
  endText: '',
  icon: true,
  invalid: false,
  placeholder: 'Search',
  size: 'default',
  text: '',
  textarea: false,
}

export const inputGroupControlArgTypes: Partial<ArgTypes<InputGroupControls>> =
  {
    align: {
      control: 'select',
      description:
        'The `align` of the first `InputGroupAddon`, the one that holds the icon and `text`; it acts only while `icon` is on or `text` is set.',
      options: inputGroupAlignNames,
    },
    button: {
      control: 'boolean',
      description: 'Adds a `Search` button to the end addon.',
    },
    disabled: {
      control: 'boolean',
      description: 'Sets `disabled` on the control and on the button.',
    },
    endText: {
      control: 'text',
      description:
        'Text of an `InputGroupText` in the end addon; empty removes the part.',
    },
    icon: {
      control: 'boolean',
      description: 'Adds a search icon to the first addon.',
    },
    invalid: {
      control: 'boolean',
      description: 'Sets `aria-invalid` on the control.',
    },
    placeholder: {
      control: 'text',
      description: 'The `placeholder` of the control, also its `aria-label`.',
    },
    size: {
      control: 'inline-radio',
      description: 'The `size` of `InputGroupInput` or `InputGroupTextarea`.',
      options: inputGroupSizeNames,
    },
    text: {
      control: 'text',
      description:
        'Text of an `InputGroupText` in the first addon; empty removes the part.',
    },
    textarea: {
      control: 'boolean',
      description:
        'Renders `InputGroupTextarea` instead of `InputGroupInput`, and moves the end addon to `block-end`.',
    },
  }
