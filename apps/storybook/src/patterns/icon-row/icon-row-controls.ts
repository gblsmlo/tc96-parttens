import type { ArgTypes } from '@storybook/react-vite'
import { type IconRowVariant, iconRowVariants } from '@tc96/parttens'

export const iconRowElements = ['div', 'a', 'button'] as const

export type IconRowElement = (typeof iconRowElements)[number]

export interface IconRowControls {
  actions: boolean
  description: string
  element: IconRowElement
  iconColor: string
  title: string
  variant: IconRowVariant
}

export const iconRowControlArgs: IconRowControls = {
  actions: true,
  description: 'Updated 2 hours ago by Anna',
  element: 'div',
  iconColor: '',
  title: 'Quarterly report',
  variant: 'outline',
}

export const iconRowControlArgTypes: Partial<ArgTypes<IconRowControls>> = {
  actions: {
    control: 'boolean',
    description:
      'Passes `actions`: a Download button and a More actions menu, or a chevron when the row is a link or a button.',
  },
  description: {
    control: 'text',
    description: 'The `description` of `IconRow`; empty removes it.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element `render` gives `IconRow`: a `div`, a link or a button.',
    options: iconRowElements,
  },
  iconColor: {
    control: 'color',
    description:
      'The `iconColor` of `IconRow`, which tints the icon and its frame; empty keeps the muted frame.',
  },
  title: {
    control: 'text',
    description: 'The `title` of `IconRow`.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `IconRow`.',
    options: iconRowVariants,
  },
}
