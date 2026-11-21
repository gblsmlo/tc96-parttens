import type { ArgTypes } from '@storybook/react-vite'
import {
  type NumberFieldFormatName,
  type NumberFieldSizeName,
  numberFieldFormatNames,
  numberFieldSizeNames,
} from './number-field-variants.ts'

export interface NumberFieldControls {
  defaultValue: number
  disabled: boolean
  format: NumberFieldFormatName
  invalid: boolean
  label: string
  readOnly: boolean
  scrubArea: boolean
  size: NumberFieldSizeName
  steppers: boolean
}

export const numberFieldControlArgs: NumberFieldControls = {
  defaultValue: 0,
  disabled: false,
  format: 'none',
  invalid: false,
  label: 'Quantity',
  readOnly: false,
  scrubArea: false,
  size: 'default',
  steppers: true,
}

export const numberFieldControlArgTypes: Partial<
  ArgTypes<NumberFieldControls>
> = {
  defaultValue: {
    control: 'number',
    description: 'Starting value of the field, through `defaultValue`.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `NumberField`.',
  },
  format: {
    control: 'inline-radio',
    description:
      'The `format` of `NumberField`: none, `{ style: "currency", currency: "USD" }` or `{ style: "unit", unit: "kilogram" }`.',
    options: numberFieldFormatNames,
  },
  invalid: {
    control: 'boolean',
    description: 'Sets `aria-invalid` on `NumberFieldInput`.',
  },
  label: {
    control: 'text',
    description:
      'Accessible name: the `label` of `NumberFieldScrubArea` when `scrubArea` is on, otherwise the `aria-label` of the input; empty removes it, so name the field another way.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `NumberField`: the value stays, the buttons and keys do nothing.',
  },
  scrubArea: {
    control: 'boolean',
    description:
      'Adds a `NumberFieldScrubArea` above the group, labelled with `label`.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `NumberField`.',
    options: numberFieldSizeNames,
  },
  steppers: {
    control: 'boolean',
    description:
      'Adds `NumberFieldDecrement` and `NumberFieldIncrement` around the input.',
  },
}
