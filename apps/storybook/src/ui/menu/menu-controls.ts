import type { ArgTypes } from '@storybook/react-vite'

export const menuSides = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end',
] as const

export const menuAligns = ['start', 'center', 'end'] as const

export const menuCheckboxVariants = ['default', 'switch'] as const

export type MenuSide = (typeof menuSides)[number]

export type MenuAlign = (typeof menuAligns)[number]

export type MenuCheckboxVariant = (typeof menuCheckboxVariants)[number]

export interface MenuControls {
  align: MenuAlign
  checkboxItems: boolean
  checkboxVariant: MenuCheckboxVariant
  destructiveItem: boolean
  disabledItem: boolean
  icons: boolean
  inset: boolean
  label: string
  linkItem: boolean
  radioGroup: boolean
  shortcuts: boolean
  side: MenuSide
  submenu: boolean
  trigger: string
}

export const menuControlArgs: MenuControls = {
  align: 'center',
  checkboxItems: false,
  checkboxVariant: 'default',
  destructiveItem: false,
  disabledItem: false,
  icons: true,
  inset: false,
  label: '',
  linkItem: false,
  radioGroup: false,
  shortcuts: false,
  side: 'bottom',
  submenu: false,
  trigger: 'Open menu',
}

export const menuControlArgTypes: Partial<ArgTypes<MenuControls>> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `MenuPopup` against the trigger.',
    options: menuAligns,
  },
  checkboxItems: {
    control: 'boolean',
    description:
      'Adds a labelled `MenuGroup` with two `MenuCheckboxItem`s, the first one checked.',
  },
  checkboxVariant: {
    control: 'inline-radio',
    description:
      'The `variant` of each `MenuCheckboxItem`; acts only with `checkboxItems`.',
    options: menuCheckboxVariants,
  },
  destructiveItem: {
    control: 'boolean',
    description: 'Sets `variant="destructive"` on the last `MenuItem`, Delete.',
  },
  disabledItem: {
    control: 'boolean',
    description:
      'Sets `disabled` on the Archive `MenuItem`, which then says why inside the item.',
  },
  icons: {
    control: 'boolean',
    description: 'Adds an icon before the label of each action.',
  },
  inset: {
    control: 'boolean',
    description:
      'Drops the icon of Archive and sets `inset` on it, so its label lines up with the labels after an icon.',
  },
  label: {
    control: 'text',
    description:
      'Text of a `MenuGroupLabel` over the actions, which wraps them in a `MenuGroup`; empty removes both.',
  },
  linkItem: {
    control: 'boolean',
    description: 'Adds a `MenuLinkItem`, which renders an `a`.',
  },
  radioGroup: {
    control: 'boolean',
    description:
      'Adds a labelled `MenuGroup` with a `MenuRadioGroup` of two `MenuRadioItem`s.',
  },
  shortcuts: {
    control: 'boolean',
    description:
      'Adds a `MenuShortcut` to Edit and Duplicate, with `aria-keyshortcuts` on the item.',
  },
  side: {
    control: 'inline-radio',
    description: 'The `side` of the trigger `MenuPopup` opens on.',
    options: menuSides,
  },
  submenu: {
    control: 'boolean',
    description:
      'Adds a `MenuSub`: a `MenuSubTrigger` that opens a `MenuSubPopup`.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `MenuTrigger`, which opens and closes the menu.',
  },
}
