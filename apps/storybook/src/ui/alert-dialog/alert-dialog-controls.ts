import type { ArgTypes } from '@storybook/react-vite'

export const alertDialogFooterVariants = ['default', 'bare'] as const

export type AlertDialogFooterVariant =
  (typeof alertDialogFooterVariants)[number]

export interface AlertDialogControls {
  bottomStickOnMobile: boolean
  cancel: boolean
  cancelLabel: string
  confirmLabel: string
  description: string
  footerVariant: AlertDialogFooterVariant
  title: string
  trigger: string
}

export const alertDialogControlArgs: AlertDialogControls = {
  bottomStickOnMobile: true,
  cancel: true,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  description: 'Describe what happens when the action is confirmed.',
  footerVariant: 'default',
  title: 'Confirm this action?',
  trigger: 'Open alert dialog',
}

export const alertDialogControlArgTypes: Partial<
  ArgTypes<AlertDialogControls>
> = {
  bottomStickOnMobile: {
    control: 'boolean',
    description:
      'The `bottomStickOnMobile` of `AlertDialogPopup`; acts below 640px, so try it with the viewport toolbar.',
  },
  cancel: {
    control: 'boolean',
    description: 'Adds the `AlertDialogClose` that cancels, before the action.',
  },
  cancelLabel: {
    control: 'text',
    description: 'Text of the cancel `AlertDialogClose`.',
  },
  confirmLabel: {
    control: 'text',
    description: 'Text of the `AlertDialogClose` that confirms the action.',
  },
  description: {
    control: 'text',
    description: 'Text of `AlertDialogDescription`; empty removes the part.',
  },
  footerVariant: {
    control: 'inline-radio',
    description: 'The `variant` of `AlertDialogFooter`.',
    options: alertDialogFooterVariants,
  },
  title: {
    control: 'text',
    description: 'Text of `AlertDialogTitle`, which names the dialog.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `AlertDialogTrigger`, which reopens the dialog.',
  },
}
