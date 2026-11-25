import type { ArgTypes } from '@storybook/react-vite'
import type { Legal7Mode } from '@tc96/ui/blocks/data/legal/legal-7'

export interface Legal7Controls {
  catalogsLoading: boolean
  decisions: boolean
  empty: boolean
  mode: Legal7Mode
  openable: boolean
  savedViews: boolean
  title: string
}

export const legal7ControlArgs: Legal7Controls = {
  catalogsLoading: false,
  decisions: true,
  empty: false,
  mode: 'table',
  openable: true,
  savedViews: false,
  title: 'Publicações',
}

export const legal7ControlArgTypes: Partial<ArgTypes<Legal7Controls>> = {
  catalogsLoading: {
    control: 'boolean',
    description:
      'Passes `tribunalsLoading`; on, the Tribunal submenu shows skeleton rows.',
  },
  decisions: {
    control: 'boolean',
    description:
      'Passes the seven decision callbacks; off, the action bar of a selection shows only the count and Limpar seleção.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no records and `total={0}`, which renders the empty message and hides the pagination.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['table', 'list'],
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a table row and a list title open the publication.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews`, `savedViewId`, `savedViewModified`, the saved view callbacks and `onSavePreference`; on, the view switcher (Todas and Minhas visualizações) replaces the heading and Exibição ends with Salvar preferência.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the toolbar heading and the name of the section and the table.',
  },
}
