import type { ArgTypes } from '@storybook/react-vite'
import {
  type SwitcherVariantName,
  switcherVariantNames,
} from './view-switcher-variants.ts'

export interface ViewSwitcherControls {
  create: boolean
  icon: boolean
  loading: boolean
  options: boolean
  search: boolean
  variant: SwitcherVariantName
}

export const viewSwitcherControlArgs: ViewSwitcherControls = {
  create: false,
  icon: true,
  loading: false,
  options: false,
  search: false,
  variant: 'default',
}

export const viewSwitcherControlArgTypes: Partial<
  ArgTypes<ViewSwitcherControls>
> = {
  create: {
    control: 'boolean',
    description:
      'Adds `ViewSwitcherCreate` at the end of the popover; it adds a view and selects it.',
  },
  icon: {
    control: 'boolean',
    description:
      'Gives `ViewSwitcherMenu` and every `ViewSwitcherItem` an `icon`.',
  },
  loading: {
    control: 'boolean',
    description:
      'Sets `loading` on `ViewSwitcherItems`: only the selected view stays, followed by skeleton rows. Open the trigger to see them.',
  },
  options: {
    control: 'boolean',
    description:
      'Gives the selected `ViewSwitcherItem` its `options` menu: favorite, duplicate and delete.',
  },
  search: {
    control: 'boolean',
    description:
      'Adds `ViewSwitcherSearch` at the top of the popover; the story filters the views by what is typed.',
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `ViewSwitcherMenu`.',
    options: switcherVariantNames,
  },
}
