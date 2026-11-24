import type { ArgTypes } from '@storybook/react-vite'

export interface Table2Controls {
  empty: boolean
  locale: string
  pageSize: number
  savePreference: boolean
  showPausedSwitch: boolean
  title: string
  viewCreate: boolean
  views: boolean
}

export const table2ControlArgs: Table2Controls = {
  empty: false,
  locale: 'pt-BR',
  pageSize: 8,
  savePreference: true,
  showPausedSwitch: true,
  title: 'Membros',
  viewCreate: true,
  views: true,
}

export const table2ControlArgTypes: Partial<ArgTypes<Table2Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes no members, which renders the empty row of the table.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the dates and of the rating and activity numbers.',
    options: ['pt-BR', 'en-US'],
  },
  pageSize: {
    control: { max: 12, min: 3, step: 1, type: 'number' },
    description:
      'Initial rows per page; it joins the `pageSizeOptions` of the footer selector.',
  },
  savePreference: {
    control: 'boolean',
    description:
      'Passes `onSave`; off, the Salvar preferência item is not rendered.',
  },
  showPausedSwitch: {
    control: 'boolean',
    description:
      'Passes `onShowPausedChange`; off, the Mostrar membros pausados item is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the table.',
  },
  viewCreate: {
    control: 'boolean',
    description:
      'Passes `onViewCreate`; off, the view switcher has no create item.',
  },
  views: {
    control: 'boolean',
    description:
      'Passes `views`, `activeViewId` and `onViewChange`; off, the view switcher is not rendered.',
  },
}
