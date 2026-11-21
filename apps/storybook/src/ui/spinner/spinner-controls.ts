import type { ArgTypes } from '@storybook/react-vite'

export const spinnerSizes = [
  'none',
  'size-3.5',
  'size-4',
  'size-5',
  'size-8',
] as const

export type SpinnerSize = (typeof spinnerSizes)[number]

export interface SpinnerControls {
  size: SpinnerSize
}

export const spinnerControlArgs: SpinnerControls = {
  size: 'none',
}

export const spinnerControlArgTypes: Partial<ArgTypes<SpinnerControls>> = {
  size: {
    control: {
      labels: {
        none: 'none (24px)',
        'size-3.5': 'size-3.5 (14px)',
        'size-4': 'size-4 (16px)',
        'size-5': 'size-5 (20px)',
        'size-8': 'size-8 (32px)',
      },
      type: 'select',
    },
    description:
      'A `size-*` class passed in `className`; `none` keeps the 24px of the `width` and `height` attributes.',
    options: spinnerSizes,
  },
}
