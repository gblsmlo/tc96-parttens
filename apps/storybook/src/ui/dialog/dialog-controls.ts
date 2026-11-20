import type { ArgTypes } from '@storybook/react-vite'

export const dialogFooterVariants = ['default', 'bare'] as const

export type DialogFooterVariant = (typeof dialogFooterVariants)[number]

export interface DialogControls {
  actionLabel: string
  body: string
  bottomStickOnMobile: boolean
  cancelLabel: string
  description: string
  footer: boolean
  footerVariant: DialogFooterVariant
  showCloseButton: boolean
  title: string
  trigger: string
}

export const dialogControlArgs: DialogControls = {
  actionLabel: 'Save',
  body: 'Place the form or the content of the task here.',
  bottomStickOnMobile: true,
  cancelLabel: 'Cancel',
  description: 'Describe what the dialog is for and what saving does.',
  footer: true,
  footerVariant: 'default',
  showCloseButton: true,
  title: 'Edit details',
  trigger: 'Open dialog',
}

export const dialogControlArgTypes: Partial<ArgTypes<DialogControls>> = {
  actionLabel: {
    control: 'text',
    description: 'Text of the footer `Button` that runs the action.',
  },
  body: {
    control: 'text',
    description: 'Text of `DialogPanel`; empty removes the part.',
  },
  bottomStickOnMobile: {
    control: 'boolean',
    description:
      'The `bottomStickOnMobile` of `DialogPopup`; acts below 640px, so try it with the viewport toolbar.',
  },
  cancelLabel: {
    control: 'text',
    description: 'Text of the footer `DialogClose`.',
  },
  description: {
    control: 'text',
    description: 'Text of `DialogDescription`; empty removes the part.',
  },
  footer: {
    control: 'boolean',
    description: 'Adds `DialogFooter` with the cancel and the action buttons.',
  },
  footerVariant: {
    control: 'inline-radio',
    description: 'The `variant` of `DialogFooter`.',
    options: dialogFooterVariants,
  },
  showCloseButton: {
    control: 'boolean',
    description:
      'The `showCloseButton` of `DialogPopup`, the close button at the top end.',
  },
  title: {
    control: 'text',
    description: 'Text of `DialogTitle`, which names the dialog.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `DialogTrigger`, which reopens the dialog.',
  },
}
