import type { ArgTypes } from '@storybook/react-vite'

export const sheetSides = ['right', 'left', 'top', 'bottom'] as const

export type SheetSide = (typeof sheetSides)[number]

export const sheetVariants = ['default', 'inset'] as const

export type SheetVariant = (typeof sheetVariants)[number]

export const sheetFooterVariants = ['default', 'bare'] as const

export type SheetFooterVariant = (typeof sheetFooterVariants)[number]

export interface SheetControls {
  actionLabel: string
  body: string
  cancelLabel: string
  description: string
  footer: boolean
  footerVariant: SheetFooterVariant
  showCloseButton: boolean
  side: SheetSide
  title: string
  trigger: string
  variant: SheetVariant
}

export const sheetControlArgs: SheetControls = {
  actionLabel: 'Save',
  body: 'Place the form or the details of the record here.',
  cancelLabel: 'Cancel',
  description: 'Describe what the sheet holds and what saving does.',
  footer: true,
  footerVariant: 'default',
  showCloseButton: true,
  side: 'right',
  title: 'Edit details',
  trigger: 'Open sheet',
  variant: 'default',
}

export const sheetControlArgTypes: Partial<ArgTypes<SheetControls>> = {
  actionLabel: {
    control: 'text',
    description: 'Text of the footer `Button` that runs the action.',
  },
  body: {
    control: 'text',
    description: 'Text of `SheetPanel`; empty removes the part.',
  },
  cancelLabel: {
    control: 'text',
    description: 'Text of the footer `SheetClose`.',
  },
  description: {
    control: 'text',
    description: 'Text of `SheetDescription`; empty removes the part.',
  },
  footer: {
    control: 'boolean',
    description: 'Adds `SheetFooter` with the cancel and the action buttons.',
  },
  footerVariant: {
    control: 'inline-radio',
    description: 'The `variant` of `SheetFooter`.',
    options: sheetFooterVariants,
  },
  showCloseButton: {
    control: 'boolean',
    description:
      'The `showCloseButton` of `SheetPopup`, the close button at the top end.',
  },
  side: {
    control: 'inline-radio',
    description: 'The `side` of `SheetPopup`, the edge it opens from.',
    options: sheetSides,
  },
  title: {
    control: 'text',
    description: 'Text of `SheetTitle`, which names the sheet.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `SheetTrigger`, which reopens the sheet.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The `variant` of `SheetPopup`; `inset` acts from 640px up, so try it with a wide canvas.',
    options: sheetVariants,
  },
}
