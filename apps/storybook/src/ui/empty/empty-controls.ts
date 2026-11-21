import type { ArgTypes } from '@storybook/react-vite'

export const emptyMediaVariantNames = ['default', 'icon'] as const

export type EmptyMediaVariantName = (typeof emptyMediaVariantNames)[number]

export interface EmptyControls {
  actions: boolean
  description: string
  media: boolean
  mediaVariant: EmptyMediaVariantName
  title: string
}

export const emptyControlArgs: EmptyControls = {
  actions: true,
  description: 'Items you add show up here.',
  media: true,
  mediaVariant: 'default',
  title: 'No items yet',
}

export const emptyControlArgTypes: Partial<ArgTypes<EmptyControls>> = {
  actions: {
    control: 'boolean',
    description: 'Adds an `EmptyContent` with one button.',
  },
  description: {
    control: 'text',
    description: 'Text of `EmptyDescription`; empty removes the part.',
  },
  media: {
    control: 'boolean',
    description: 'Adds an `EmptyMedia` holding a decorative icon.',
  },
  mediaVariant: {
    control: 'inline-radio',
    description:
      'The `variant` of `EmptyMedia`; does nothing while `media` is off.',
    options: emptyMediaVariantNames,
  },
  title: {
    control: 'text',
    description: 'Text of `EmptyTitle`; empty removes the part.',
  },
}
