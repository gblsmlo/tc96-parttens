import type { ArgTypes } from '@storybook/react-vite'
import {
  type ToggleGroupOrientationName,
  type ToggleGroupSizeName,
  type ToggleGroupVariantName,
  toggleGroupOrientationNames,
  toggleGroupSizeNames,
  toggleGroupVariantNames,
} from './toggle-group-variants.ts'

export interface ToggleGroupControls {
  disabled: boolean
  disabledItem: boolean
  icons: boolean
  label: string
  orientation: ToggleGroupOrientationName
  separators: boolean
  size: ToggleGroupSizeName
  text: boolean
  variant: ToggleGroupVariantName
}

export const toggleGroupControlArgs: ToggleGroupControls = {
  disabled: false,
  disabledItem: false,
  icons: true,
  label: 'Text alignment',
  orientation: 'horizontal',
  separators: false,
  size: 'default',
  text: false,
  variant: 'default',
}

export const toggleGroupControlArgTypes: Partial<
  ArgTypes<ToggleGroupControls>
> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `ToggleGroup`.',
  },
  disabledItem: {
    control: 'boolean',
    description: 'Disables the `Center` item alone.',
  },
  icons: {
    control: 'boolean',
    description:
      'Shows an icon in each item; turning it off always shows the text.',
  },
  label: {
    control: 'text',
    description: 'The `aria-label` that names the group.',
  },
  orientation: {
    control: 'select',
    description:
      'The `orientation` of `ToggleGroup`; the items stack only with the `outline` variant, and the separators turn horizontal.',
    options: toggleGroupOrientationNames,
  },
  separators: {
    control: 'boolean',
    description: 'Adds a `ToggleGroupSeparator` between the items.',
  },
  size: {
    control: 'select',
    description: 'The `size` of `ToggleGroup`.',
    options: toggleGroupSizeNames,
  },
  text: {
    control: 'boolean',
    description:
      'Shows the text of each item; without it the text becomes the `aria-label` of the item.',
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `ToggleGroup`.',
    options: toggleGroupVariantNames,
  },
}
