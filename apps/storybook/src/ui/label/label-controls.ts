import type { ArgTypes } from '@storybook/react-vite'

export const labelElementNames = ['label', 'span'] as const

export type LabelElementName = (typeof labelElementNames)[number]

export interface LabelControls {
  element: LabelElementName
  label: string
  required: boolean
}

export const labelControlArgs: LabelControls = {
  element: 'label',
  label: 'Email',
  required: false,
}

export const labelControlArgTypes: Partial<ArgTypes<LabelControls>> = {
  element: {
    control: 'inline-radio',
    description:
      'The element `Label` renders: `span` goes through `render` and names the input by `aria-labelledby`, so a click on it no longer focuses the input.',
    options: labelElementNames,
  },
  label: {
    control: 'text',
    description: 'Text of `Label`, which becomes the name of the input.',
  },
  required: {
    control: 'boolean',
    description:
      'Adds a hidden asterisk inside `Label` and sets `required` on the input.',
  },
}
