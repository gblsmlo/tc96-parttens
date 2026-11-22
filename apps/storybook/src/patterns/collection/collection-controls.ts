import type { ArgTypes } from '@storybook/react-vite'
import type { CollectionFrameMode, CollectionLayout } from '@tc96/parttens'
import { collectionFrameModes, collectionLayouts } from './collection-variants'

export interface CollectionControls {
  action: boolean
  actionLabel: string
  empty: boolean
  emptyMessage: string
  layout: CollectionLayout
  loading: boolean
  mode: CollectionFrameMode
  pagination: boolean
  search: boolean
  toolbar: boolean
}

export const collectionControlArgs: CollectionControls = {
  action: true,
  actionLabel: 'Nova tarefa',
  empty: false,
  emptyMessage: 'Nenhuma tarefa com esses filtros.',
  layout: 'datatable',
  loading: false,
  mode: 'fill',
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
    mode: {
      control: 'inline-radio',
      description:
        'The `mode` of `CollectionFrame`. `flow` also lets the page grow past the viewport, which is what the mode is for.',
      options: collectionFrameModes,
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
