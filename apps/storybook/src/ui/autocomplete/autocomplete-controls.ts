import type { ArgTypes } from '@storybook/react-vite'
import {
  type AutocompleteSizeName,
  autocompleteSizeNames,
} from './autocomplete-variants.ts'

export interface AutocompleteControls {
  disabled: boolean
  empty: string
  invalid: boolean
  label: string
  open: boolean
  placeholder: string
  showClear: boolean
  showTrigger: boolean
  size: AutocompleteSizeName
  startAddon: boolean
}

export const autocompleteControlArgs: AutocompleteControls = {
  disabled: false,
  empty: 'No fruit matches.',
  invalid: false,
  label: 'Fruit',
  open: false,
  placeholder: 'Search fruits…',
  showClear: false,
  showTrigger: false,
  size: 'default',
  startAddon: false,
}

export const autocompleteControlArgTypes: Partial<
  ArgTypes<AutocompleteControls>
> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Autocomplete`.',
  },
  empty: {
    control: 'text',
    description:
      'Text of `AutocompleteEmpty`, shown when nothing matches; empty removes the part.',
  },
  invalid: {
    control: 'boolean',
    description:
      'Sets `aria-invalid` on the input, as a `Field` does when validation fails.',
  },
  label: {
    control: 'text',
    description: 'The `aria-label` of the input, which names the autocomplete.',
  },
  open: {
    control: 'boolean',
    description:
      'The `defaultOpen` of `Autocomplete`; the popup opens on render with every option.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of the input, shown while it is empty.',
  },
  showClear: {
    control: 'boolean',
    description:
      'The `showClear` of `AutocompleteInput`; the clear button shows once the input has text and hides the trigger meanwhile.',
  },
  showTrigger: {
    control: 'boolean',
    description: 'The `showTrigger` of `AutocompleteInput`.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `AutocompleteInput`.',
    options: autocompleteSizeNames,
  },
  startAddon: {
    control: 'boolean',
    description: 'Adds a search icon as the `startAddon` of the input.',
  },
}
