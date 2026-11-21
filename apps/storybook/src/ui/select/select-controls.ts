import type { ArgTypes } from '@storybook/react-vite'
import {
  type SelectAlignName,
  type SelectSideName,
  type SelectSizeName,
  selectAlignNames,
  selectSideNames,
  selectSizeNames,
  selectValueNames,
} from './select-variants.ts'

export interface SelectControls {
  align: SelectAlignName
  alignItemWithTrigger: boolean
  disabled: boolean
  groups: boolean
  icon: boolean
  invalid: boolean
  label: string
  multiple: boolean
  open: boolean
  placeholder: string
  side: SelectSideName
  size: SelectSizeName
  value: string
}

export const selectControlArgs: SelectControls = {
  align: 'start',
  alignItemWithTrigger: false,
  disabled: false,
  groups: false,
  icon: false,
  invalid: false,
  label: 'Framework',
  multiple: false,
  open: false,
  placeholder: 'Select a framework',
  side: 'bottom',
  size: 'default',
  value: 'none',
}

export const selectControlArgTypes: Partial<ArgTypes<SelectControls>> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `SelectPopup` against the trigger.',
    options: selectAlignNames,
  },
  alignItemWithTrigger: {
    control: 'boolean',
    description:
      'The `alignItemWithTrigger` of `SelectPopup`: the popup covers the trigger with the selected option over it; `side` and `align` stop acting.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Select`.',
  },
  groups: {
    control: 'boolean',
    description:
      'Splits the options into two `SelectGroup`s with a `SelectGroupLabel` each and a `SelectSeparator` between them.',
  },
  icon: {
    control: 'boolean',
    description: 'Adds a decorative icon before `SelectValue` in the trigger.',
  },
  invalid: {
    control: 'boolean',
    description:
      'Sets `aria-invalid` on the trigger, as a `Field` does when validation fails.',
  },
  label: {
    control: 'text',
    description:
      'Text of `SelectLabel`, which names the trigger; empty removes the part and names the trigger with `aria-label`.',
  },
  multiple: {
    control: 'boolean',
    description:
      'The `multiple` of `Select`: the popup stays open on each selection and the trigger shows the first label and a count.',
  },
  open: {
    control: 'boolean',
    description: 'The `defaultOpen` of `Select`; the popup opens on render.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `SelectValue`, shown while there is no value.',
  },
  side: {
    control: 'inline-radio',
    description: 'The `side` of the trigger `SelectPopup` opens on.',
    options: selectSideNames,
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `SelectTrigger`.',
    options: selectSizeNames,
  },
  value: {
    control: 'select',
    description:
      'The `defaultValue` of `Select`; `none` shows the placeholder.',
    options: selectValueNames,
  },
}
