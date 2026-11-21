import type { ArgTypes } from '@storybook/react-vite'

export const tooltipSides = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end',
] as const

export const tooltipAligns = ['start', 'center', 'end'] as const

export type TooltipSide = (typeof tooltipSides)[number]

export type TooltipAlign = (typeof tooltipAligns)[number]

export interface TooltipControls {
  align: TooltipAlign
  iconOnly: boolean
  open: boolean
  shortcut: boolean
  side: TooltipSide
  sideOffset: number
  text: string
  trigger: string
}

export const tooltipControlArgs: TooltipControls = {
  align: 'center',
  iconOnly: false,
  open: true,
  shortcut: false,
  side: 'top',
  sideOffset: 4,
  text: 'A short hint about the trigger',
  trigger: 'Hover me',
}

export const tooltipControlArgTypes: Partial<ArgTypes<TooltipControls>> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `TooltipPopup` against the trigger.',
    options: tooltipAligns,
  },
  iconOnly: {
    control: 'boolean',
    description:
      'Shows an icon in place of the trigger text, which becomes the `aria-label` of the trigger.',
  },
  open: {
    control: 'boolean',
    description: 'The `defaultOpen` of `Tooltip`; the popup opens on render.',
  },
  shortcut: {
    control: 'boolean',
    description: 'Adds a `Kbd` with a keyboard shortcut after the popup text.',
  },
  side: {
    control: 'select',
    description: 'The `side` of the trigger `TooltipPopup` opens on.',
    options: tooltipSides,
  },
  sideOffset: {
    control: { max: 32, min: 0, step: 1, type: 'number' },
    description:
      'The `sideOffset` of `TooltipPopup`, the gap in pixels between the trigger and the popup.',
  },
  text: {
    control: 'text',
    description: 'Text of `TooltipPopup`.',
  },
  trigger: {
    control: 'text',
    description:
      'Text of the `Button` that `TooltipTrigger` renders, which names the trigger.',
  },
}
