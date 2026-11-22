import type { ArgTypes } from '@storybook/react-vite'

export const cardElementNames = ['div', 'section', 'article'] as const

export type CardElementName = (typeof cardElementNames)[number]

export interface CardControls {
  action: boolean
  content: string
  description: string
  element: CardElementName
  footer: string
  frame: boolean
  separators: boolean
  title: string
}

export const cardControlArgs: CardControls = {
  action: false,
  content: 'The panel holds the main content of the card.',
  description: 'A sentence about what the card holds.',
  element: 'div',
  footer: 'A note or the actions that apply to the card.',
  frame: false,
  separators: false,
  title: 'Card title',
}

export const cardControlArgTypes: Partial<ArgTypes<CardControls>> = {
  action: {
    control: 'boolean',
    description: 'Adds a `CardAction` with a button beside the title.',
  },
  content: {
    control: 'text',
    description: 'Text of `CardPanel`; empty removes the part.',
  },
  description: {
    control: 'text',
    description:
      'Text of `CardDescription`; empty removes the part, and `CardHeader` goes when the title is empty and there is no action.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element `Card` renders: a `div`, or a `section` or an `article` through `render`, labelled by the title.',
    options: cardElementNames,
  },
  footer: {
    control: 'text',
    description: 'Text of `CardFooter`; empty removes the part.',
  },
  frame: {
    control: 'boolean',
    description:
      'Puts the card inside a `CardFrame` with a header, an action and a footer of its own.',
  },
  separators: {
    control: 'boolean',
    description:
      'Adds `border-b` to `CardHeader` and `border-t` to `CardFooter`; the panel then keeps its own padding on those sides.',
  },
  title: {
    control: 'text',
    description:
      'Text of `CardTitle`; empty removes the part, and `CardHeader` goes when the description is empty and there is no action.',
  },
}
