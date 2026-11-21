import type { ArgTypes } from '@storybook/react-vite'

export const separatorOrientationNames = ['horizontal', 'vertical'] as const

export type SeparatorOrientationName =
  (typeof separatorOrientationNames)[number]

export interface SeparatorControls {
  end: string
  orientation: SeparatorOrientationName
  start: string
}

export const separatorControlArgs: SeparatorControls = {
  end: 'Second group',
  orientation: 'horizontal',
  start: 'First group',
}

export const separatorControlArgTypes: Partial<ArgTypes<SeparatorControls>> = {
  end: {
    control: 'text',
    description:
      'Text after the separator, below a horizontal one and to the right of a vertical one; empty removes it.',
  },
  orientation: {
    control: 'inline-radio',
    description:
      'The `orientation` of `Separator`; the content around it stacks for `horizontal` and sits in a row for `vertical`.',
    options: separatorOrientationNames,
  },
  start: {
    control: 'text',
    description:
      'Text before the separator, above a horizontal one and to the left of a vertical one; empty removes it.',
  },
}
