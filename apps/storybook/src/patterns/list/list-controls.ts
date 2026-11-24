import type { ArgTypes } from '@storybook/react-vite'
import { type ListVariant, listVariants } from '@tc96/ui/patterns'

export const listElements = ['div', 'a', 'button'] as const

export type ListElement = (typeof listElements)[number]

export interface ListControls {
  actions: boolean
  description: string
  element: ListElement
  iconColor: string
  title: string
  variant: ListVariant
}

export const listControlArgs: ListControls = {
  actions: true,
  description: 'Updated 2 hours ago by Anna',
  element: 'div',
  iconColor: '',
  title: 'Quarterly report',
  variant: 'outline',
}

export const listControlArgTypes: Partial<ArgTypes<ListControls>> = {
  actions: {
    control: 'boolean',
    description:
      'Passes `actions`: a Download button and a More actions menu, or a chevron when the row is a link or a button.',
  },
  description: {
    control: 'text',
    description: 'The `description` of `List`; empty removes it.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element `render` gives `List`: a `div`, a link or a button.',
    options: listElements,
  },
  iconColor: {
    control: 'color',
    description:
      'The `iconColor` of `List`, which tints the icon and its frame; empty keeps the muted frame.',
  },
  title: {
    control: 'text',
    description: 'The `title` of `List`.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `List`.',
    options: listVariants,
  },
}
