import type { ArgTypes } from '@storybook/react-vite'
import type { CollectionFrameHeight, CollectionLayout } from '@tc96/ui/patterns'
import {
  collectionFrameHeights,
  collectionLayouts,
} from './collection-variants'

export interface CollectionControls {
  action: boolean
  actionLabel: string
  empty: boolean
  emptyMessage: string
  filterClear: boolean
  filterLoading: boolean
  height: CollectionFrameHeight
  layout: CollectionLayout
  loading: boolean
  pagination: boolean
  search: boolean
  toolbar: boolean
}

export const collectionControlArgs: CollectionControls = {
  action: true,
  actionLabel: 'Nova tarefa',
  empty: false,
  emptyMessage: 'Nenhuma tarefa com esses filtros.',
  filterClear: false,
  filterLoading: false,
  height: 'fill',
  layout: 'datatable',
  loading: false,
  pagination: true,
  search: false,
  toolbar: true,
}

export const collectionControlArgTypes: Partial<ArgTypes<CollectionControls>> =
  {
    action: {
      control: 'boolean',
      description: 'Adds an `Action` at the end of the toolbar.',
    },
    actionLabel: {
      control: 'text',
      description: 'The `label` of `Action`.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes a collection with no records; each layout shows its empty state.',
    },
    emptyMessage: {
      control: 'text',
      description:
        'The `emptyMessage` of the List, Gallery, Data Table and Data Grid layouts.',
    },
    filterClear: {
      control: 'boolean',
      description:
        'Passes a `clearLabel` to each `FilterCheckboxSubmenu` (Status, Prioridade, Responsável, Estimativa), which adds the item that clears the choice; off, the submenus have no such item.',
    },
    filterLoading: {
      control: 'boolean',
      description:
        'The `loading` of the Responsável `FilterCheckboxSubmenu`: skeleton rows replace its options while the people load.',
    },
    height: {
      control: 'inline-radio',
      description:
        'The `height` of `CollectionFrame`. `fill` takes the free height and scrolls the body; `content` grows with the records and keeps the footer in view, so the page grows past the viewport.',
      options: collectionFrameHeights,
    },
    layout: {
      control: 'select',
      description:
        'The `layout` of the `CollectionProvider` preferences: the layout `CollectionLayoutOutlet` mounts.',
      options: collectionLayouts,
    },
    loading: {
      control: 'boolean',
      description:
        'The `loading` of `CollectionLayoutOutlet`, which the active layout takes.',
    },
    pagination: {
      control: 'boolean',
      description:
        'Adds a `CollectionFrameFooter` with the pagination of the Data Table, List and Gallery; Data Grid pages in its own footer. Without it every record renders.',
    },
    search: {
      control: 'boolean',
      description:
        'Adds a `CollectionSearchField` after the view switcher, filtering the tasks by title.',
    },
    toolbar: {
      control: 'boolean',
      description:
        'Adds the `CollectionFrameHeader` with the toolbar: view switcher, `ViewSettingsMenu` and the action.',
    },
  }
