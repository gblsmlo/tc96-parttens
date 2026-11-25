import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar7Controls {
  compare: boolean
  hasRange: boolean
  refreshInterval: string
  showCompare: boolean
  showInterval: boolean
  showMenu: boolean
  showRange: boolean
  showRefresh: boolean
  showSearch: boolean
  showShare: boolean
}

export const navbar7ControlArgs: Navbar7Controls = {
  compare: false,
  hasRange: true,
  refreshInterval: 'off',
  showCompare: true,
  showInterval: true,
  showMenu: true,
  showRange: true,
  showRefresh: true,
  showSearch: true,
  showShare: true,
}

export const navbar7ControlArgTypes: Partial<ArgTypes<Navbar7Controls>> = {
  compare: {
    control: 'boolean',
    description: 'The `compare` prop; the initial state of the toggle.',
  },
  hasRange: {
    control: 'boolean',
    description:
      'Starts with November 2026 selected; without it the picker shows the placeholder.',
  },
  refreshInterval: {
    control: 'inline-radio',
    description:
      'The `refreshInterval` prop; the initial option of the select.',
    options: ['off', '30s', '1m', '5m'],
  },
  showCompare: {
    control: 'boolean',
    description: 'Passes `onCompareChange`; without it no toggle.',
  },
  showInterval: {
    control: 'boolean',
    description:
      'Passes `refreshOptions` and `onRefreshIntervalChange`; without them no select.',
  },
  showMenu: {
    control: 'boolean',
    description: 'Passes `menu`; without it no overflow button.',
  },
  showRange: {
    control: 'boolean',
    description: 'Passes `onRangeChange`; without it no date range picker.',
  },
  showRefresh: {
    control: 'boolean',
    description: 'Passes `onRefresh`; without it no refresh button.',
  },
  showSearch: {
    control: 'boolean',
    description:
      'Passes `searchItems` and `onSearchSelect`; without them no search.',
  },
  showShare: {
    control: 'boolean',
    description: 'Passes `onShare`; without it no Compartilhar button.',
  },
}
