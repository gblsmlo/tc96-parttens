import type { ArgTypes } from '@storybook/react-vite'

export const previewCardAligns = ['start', 'center', 'end'] as const

export const previewCardTriggerElements = ['link', 'button'] as const

export type PreviewCardAlign = (typeof previewCardAligns)[number]

export type PreviewCardTriggerElement =
  (typeof previewCardTriggerElements)[number]

export interface PreviewCardControls {
  align: PreviewCardAlign
  avatar: boolean
  description: string
  element: PreviewCardTriggerElement
  open: boolean
  sideOffset: number
  title: string
  trigger: string
}

export const previewCardControlArgs: PreviewCardControls = {
  align: 'center',
  avatar: false,
  description: 'Summarize what the link leads to, so a hover answers it.',
  element: 'link',
  open: true,
  sideOffset: 4,
  title: 'Preview title',
  trigger: 'Hover this link',
}

export const previewCardControlArgTypes: Partial<
  ArgTypes<PreviewCardControls>
> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `PreviewCardPopup` against the trigger.',
    options: previewCardAligns,
  },
  avatar: {
    control: 'boolean',
    description: 'Adds an `Avatar` before the text of the popup.',
  },
  description: {
    control: 'text',
    description: 'Text under the title in the popup; empty removes it.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element of `PreviewCardTrigger`: its own `a` with an `href`, or a ghost `Button` through `render`.',
    options: previewCardTriggerElements,
  },
  open: {
    control: 'boolean',
    description:
      'The `defaultOpen` of `PreviewCard`; the popup opens on render.',
  },
  sideOffset: {
    control: { max: 32, min: 0, step: 1, type: 'number' },
    description:
      'The `sideOffset` of `PreviewCardPopup`, the gap in pixels under the trigger.',
  },
  title: {
    control: 'text',
    description: 'Heading of the popup; empty removes it.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `PreviewCardTrigger`, which names the link.',
  },
}
