import type { ArgTypes } from '@storybook/react-vite'

export const drawerPositions = ['bottom', 'right', 'left', 'top'] as const

export type DrawerPosition = (typeof drawerPositions)[number]

export const drawerVariants = ['default', 'straight', 'inset'] as const

export type DrawerVariant = (typeof drawerVariants)[number]

export const drawerFooterVariants = ['default', 'bare'] as const

export type DrawerFooterVariant = (typeof drawerFooterVariants)[number]

export interface DrawerControls {
  actionLabel: string
  body: string
  cancelLabel: string
  description: string
  footer: boolean
  footerVariant: DrawerFooterVariant
  position: DrawerPosition
  showBar: boolean
  showCloseButton: boolean
  title: string
  trigger: string
  variant: DrawerVariant
}

export const drawerControlArgs: DrawerControls = {
  actionLabel: 'Save',
  body: 'Place the form or the details of the record here.',
  cancelLabel: 'Cancel',
  description: 'Describe what the drawer holds and what saving does.',
  footer: true,
  footerVariant: 'default',
  position: 'bottom',
  showBar: true,
  showCloseButton: false,
  title: 'Edit details',
  trigger: 'Open drawer',
  variant: 'default',
}

export const drawerControlArgTypes: Partial<ArgTypes<DrawerControls>> = {
  actionLabel: {
    control: 'text',
    description: 'Text of the footer `Button` that runs the action.',
  },
  body: {
    control: 'text',
    description: 'Text of `DrawerPanel`; empty removes the part.',
  },
  cancelLabel: {
    control: 'text',
    description: 'Text of the footer `DrawerClose`.',
  },
  description: {
    control: 'text',
    description: 'Text of `DrawerDescription`; empty removes the part.',
  },
  footer: {
    control: 'boolean',
    description: 'Adds `DrawerFooter` with the cancel and the action buttons.',
  },
  footerVariant: {
    control: 'inline-radio',
    description: 'The `variant` of `DrawerFooter`.',
    options: drawerFooterVariants,
  },
  position: {
    control: 'inline-radio',
    description:
      'The `position` of `Drawer`, the edge it opens from and is swiped back to.',
    options: drawerPositions,
  },
  showBar: {
    control: 'boolean',
    description: 'The `showBar` of `DrawerPopup`, the drag bar on the edge.',
  },
  showCloseButton: {
    control: 'boolean',
    description:
      'The `showCloseButton` of `DrawerPopup`, the close button at the top end.',
  },
  title: {
    control: 'text',
    description: 'Text of `DrawerTitle`, which names the drawer.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `DrawerTrigger`, which reopens the drawer.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The `variant` of `DrawerPopup`; `inset` acts from 640px up, so try it with a wide canvas.',
    options: drawerVariants,
  },
}
