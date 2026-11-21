import type { ArgTypes } from '@storybook/react-vite'

export const popoverSides = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end',
] as const

export const popoverAligns = ['start', 'center', 'end'] as const

export type PopoverSide = (typeof popoverSides)[number]

export type PopoverAlign = (typeof popoverAligns)[number]

export interface PopoverControls {
  align: PopoverAlign
  alignOffset: number
  closeButton: boolean
  description: string
  side: PopoverSide
  sideOffset: number
  title: string
  tooltipStyle: boolean
  trigger: string
}

export const popoverControlArgs: PopoverControls = {
  align: 'center',
  alignOffset: 0,
  closeButton: false,
  description:
    'Short content that belongs to the trigger and closes when the user moves on.',
  side: 'bottom',
  sideOffset: 4,
  title: 'Details',
  tooltipStyle: false,
  trigger: 'Open popover',
}

export const popoverControlArgTypes: Partial<ArgTypes<PopoverControls>> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `PopoverPopup` against the trigger.',
    options: popoverAligns,
  },
  alignOffset: {
    control: 'number',
    description:
      'The `alignOffset` of `PopoverPopup`, in pixels along the alignment axis.',
  },
  closeButton: {
    control: 'boolean',
    description:
      'Adds an icon `PopoverClose` labelled "Close" at the top end of the popup.',
  },
  description: {
    control: 'text',
    description: 'Text of `PopoverDescription`; empty removes the part.',
  },
  side: {
    control: 'select',
    description: 'The `side` of the trigger `PopoverPopup` opens on.',
    options: popoverSides,
  },
  sideOffset: {
    control: 'number',
    description:
      'The `sideOffset` of `PopoverPopup`, the gap in pixels between the trigger and the popup.',
  },
  title: {
    control: 'text',
    description:
      'Text of `PopoverTitle`, which names the popup; empty removes the part, and the popup takes the trigger text as its `aria-label`.',
  },
  tooltipStyle: {
    control: 'boolean',
    description: 'The `tooltipStyle` of `PopoverPopup`.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `PopoverTrigger`, which opens and closes the popup.',
  },
}
