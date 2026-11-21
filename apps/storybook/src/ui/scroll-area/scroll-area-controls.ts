import type { ArgTypes } from '@storybook/react-vite'

export interface ScrollAreaControls {
  clampContentMinWidth: boolean
  rows: number
  scrollbarGutter: boolean
  scrollFade: boolean
}

export const scrollAreaControlArgs: ScrollAreaControls = {
  clampContentMinWidth: true,
  rows: 30,
  scrollbarGutter: false,
  scrollFade: false,
}

export const scrollAreaControlArgTypes: Partial<ArgTypes<ScrollAreaControls>> =
  {
    clampContentMinWidth: {
      control: 'boolean',
      description:
        'The `clampContentMinWidth` of `ScrollArea`: off, the content grows to its widest line and the long file name stops truncating.',
    },
    rows: {
      control: { max: 30, min: 0, step: 1, type: 'range' },
      description:
        'How many files the list holds; 7 or fewer fit, so the area does not scroll.',
    },
    scrollbarGutter: {
      control: 'boolean',
      description:
        'The `scrollbarGutter` of `ScrollArea`: reserves 10px for the scrollbar while the list overflows.',
    },
    scrollFade: {
      control: 'boolean',
      description:
        'The `scrollFade` of `ScrollArea`: fades the edges that have more content beyond them.',
    },
  }
