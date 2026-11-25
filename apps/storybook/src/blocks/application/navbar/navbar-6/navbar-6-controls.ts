import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar6Controls {
  activeFilters: number
  maxPeople: number
  peopleCount: number
  showFilter: boolean
  showInvite: boolean
  showMenu: boolean
  showSort: boolean
}

export const navbar6ControlArgs: Navbar6Controls = {
  activeFilters: 0,
  maxPeople: 3,
  peopleCount: 5,
  showFilter: true,
  showInvite: true,
  showMenu: true,
  showSort: true,
}

export const navbar6ControlArgTypes: Partial<ArgTypes<Navbar6Controls>> = {
  activeFilters: {
    control: { max: 3, min: 0, type: 'number' },
    description:
      'How many filter options the `filters` prop carries; any filter gives the trigger its active look.',
  },
  maxPeople: {
    control: { max: 5, min: 0, type: 'number' },
    description: 'The `maxPeople` prop; the rest becomes the +N counter.',
  },
  peopleCount: {
    control: { max: 5, min: 0, type: 'number' },
    description: 'How many people of the fixture the `people` prop carries.',
  },
  showFilter: {
    control: 'boolean',
    description:
      'Passes `filterOptions` and `onFiltersChange`; without them no filter menu.',
  },
  showInvite: {
    control: 'boolean',
    description: 'Passes `onInvite`; without it the Convidar button is absent.',
  },
  showMenu: {
    control: 'boolean',
    description: 'Passes `menu`; without it the overflow menu is absent.',
  },
  showSort: {
    control: 'boolean',
    description:
      'Passes `sortOptions` and `onSortChange`; without them no sort menu.',
  },
}
