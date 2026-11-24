import type { ArgTypes } from '@storybook/react-vite'

export interface Settings16Controls {
  description: string
  empty: boolean
  newCostCenter: string
  title: string
  withActions: boolean
  withArchived: boolean
}

export const settings16ControlArgs: Settings16Controls = {
  description:
    'Onde um custo é lançado: uma área de atuação, um escritório, um projeto.',
  empty: false,
  newCostCenter: 'Novo centro de custo',
  title: 'Centros de custo',
  withActions: true,
  withArchived: true,
}

export const settings16ControlArgTypes: Partial<ArgTypes<Settings16Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `costCenters` list, which replaces the rows by the empty state.',
    },
    newCostCenter: {
      control: 'text',
      description: 'Text of `labels.newCostCenter`, the button of `onCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onCreate` and `onCostCenterAction`; off removes the New cost center button and the row menus.',
    },
    withArchived: {
      control: 'boolean',
      description:
        'Passes `archivedCostCenters`; off removes the archived section, which only appears with archived cost centers.',
    },
  }
