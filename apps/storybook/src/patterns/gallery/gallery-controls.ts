import type { ArgTypes } from '@storybook/react-vite'
import type { CollectionDensity, GalleryPageSize } from '@tc96/ui/patterns'
import { galleryPageSizes } from './gallery-data.ts'

export interface GalleryControls {
  action: boolean
  density: CollectionDensity
  descriptionLines: number
  empty: boolean
  emptyMessage: string
  eyebrow: boolean
  footer: boolean
  loading: boolean
  pageSize: GalleryPageSize | 'none'
  titleLines: 1 | 2
}

export const galleryControlArgs: GalleryControls = {
  action: true,
  density: 'compact',
  descriptionLines: 2,
  empty: false,
  emptyMessage: 'Nenhum registro para exibir.',
  eyebrow: true,
  footer: true,
  loading: false,
  pageSize: 'none',
  titleLines: 1,
}

export const galleryControlArgTypes: Partial<ArgTypes<GalleryControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds a menu button to every card; the skeleton follows through `action`.',
  },
  density: {
    control: 'inline-radio',
    description:
      'Sets the padding of every card; the skeleton follows through `density`.',
    options: ['compact', 'short', 'medium', 'tall', 'extra-tall'],
  },
  descriptionLines: {
    control: { max: 4, min: 0, type: 'range' },
    description:
      'Clamps the description of every card to this many lines, 0 removes it; the skeleton follows through `descriptionLines`.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes a collection with no records.',
  },
  emptyMessage: {
    control: 'text',
    description:
      'The `emptyMessage` of `GalleryView`, shown when `empty` is on.',
  },
  eyebrow: {
    control: 'boolean',
    description:
      'Adds the category line above the title; the skeleton follows through `eyebrow`.',
  },
  footer: {
    control: 'boolean',
    description:
      'Adds a separator and a footer to every card; the skeleton follows through `footer`.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `GalleryView`: renders skeleton cards.',
  },
  pageSize: {
    control: 'select',
    description:
      'The `pageSize` of `GalleryView`; the story passes the first page of records. `none` leaves it unset.',
    options: ['none', ...galleryPageSizes],
  },
  titleLines: {
    control: 'inline-radio',
    description:
      'Gives every card a title of this many lines; the skeleton follows through `titleLines`.',
    options: [1, 2],
  },
}
