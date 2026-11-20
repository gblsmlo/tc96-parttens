import type { ArgTypes } from '@storybook/react-vite'
import {
  type ComboboxSizeName,
  comboboxSizeNames,
} from './combobox-variants.ts'

export interface ComboboxControls {
  disabled: boolean
  empty: string
  invalid: boolean
  label: string
  multiple: boolean
  open: boolean
  placeholder: string
  showClear: boolean
  showTrigger: boolean
  size: ComboboxSizeName
  startAddon: boolean
}

export const comboboxControlArgs: ComboboxControls = {
  disabled: false,
  empty: 'No results found.',
  invalid: false,
  label: 'Fruit',
  multiple: false,
  open: false,
  placeholder: 'Select a fruit…',
  showClear: false,
  showTrigger: true,
  size: 'default',
  startAddon: false,
}

export const comboboxControlArgTypes: Partial<ArgTypes<ComboboxControls>> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Combobox`.',
  },
  empty: {
    control: 'text',
    description:
      'Text of `ComboboxEmpty`, shown when nothing matches; empty removes the part.',
  },
  invalid: {
    control: 'boolean',
    description:
      'Sets `aria-invalid` on the input, as a `Field` does when validation fails.',
  },
  label: {
    control: 'text',
    description: 'The `aria-label` of the input, which names the combobox.',
  },
  multiple: {
    control: 'boolean',
    description:
      'The `multiple` of `Combobox`: the input becomes `ComboboxChips` with a `ComboboxChip` per value; `showTrigger` and `showClear` do not act on it.',
  },
  open: {
    control: 'boolean',
    description: 'The `defaultOpen` of `Combobox`; the popup opens on render.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of the input, shown while it is empty.',
  },
  showClear: {
    control: 'boolean',
    description:
      'The `showClear` of `ComboboxInput`; the clear button shows once a value is selected and replaces the trigger.',
  },
  showTrigger: {
    control: 'boolean',
    description: 'The `showTrigger` of `ComboboxInput`.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `ComboboxInput` or `ComboboxChipsInput`.',
    options: comboboxSizeNames,
  },
  startAddon: {
    control: 'boolean',
    description: 'Adds a search icon as the `startAddon` of the input.',
  },
}
