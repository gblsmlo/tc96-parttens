import type { ArgTypes } from '@storybook/react-vite'

export const contextMenuSides = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end',
] as const

export const contextMenuAligns = ['start', 'center', 'end'] as const

export const contextMenuCheckboxVariants = ['default', 'switch'] as const

export type ContextMenuSide = (typeof contextMenuSides)[number]

export type ContextMenuAlign = (typeof contextMenuAligns)[number]

export type ContextMenuCheckboxVariant =
  (typeof contextMenuCheckboxVariants)[number]

export interface ContextMenuControls {
  align: ContextMenuAlign
  checkboxItems: boolean
  checkboxVariant: ContextMenuCheckboxVariant
  destructiveItem: boolean
  disabledItem: boolean
  icons: boolean
  inset: boolean
  label: string
  linkItem: boolean
  radioGroup: boolean
  shortcuts: boolean
  side: ContextMenuSide
  submenu: boolean
  trigger: string
}

export const contextMenuControlArgs: ContextMenuControls = {
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
  trigger: 'Right-click here',
}

export const contextMenuControlArgTypes: Partial<
  ArgTypes<ContextMenuControls>
> = {
  align: {
    control: 'inline-radio',
    description: 'The `align` of `ContextMenuPopup` against the pointer.',
    options: contextMenuAligns,
  },
  checkboxItems: {
    control: 'boolean',
    description:
      'Adds a labelled `ContextMenuGroup` with two `ContextMenuCheckboxItem`s, the first one checked.',
  },
  checkboxVariant: {
    control: 'inline-radio',
    description:
      'The `variant` of each `ContextMenuCheckboxItem`; acts only with `checkboxItems`.',
    options: contextMenuCheckboxVariants,
  },
  destructiveItem: {
    control: 'boolean',
    description:
      'Sets `variant="destructive"` on the last `ContextMenuItem`, Delete.',
  },
  disabledItem: {
    control: 'boolean',
    description:
      'Sets `disabled` on the Archive `ContextMenuItem`, which then says why inside the item.',
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
      'Text of a `ContextMenuGroupLabel` over the actions, which wraps them in a `ContextMenuGroup`; empty removes both.',
  },
  linkItem: {
    control: 'boolean',
    description: 'Adds a `ContextMenuLinkItem`, which renders an `a`.',
  },
  radioGroup: {
    control: 'boolean',
    description:
      'Adds a labelled `ContextMenuGroup` with a `ContextMenuRadioGroup` of two `ContextMenuRadioItem`s.',
  },
  shortcuts: {
    control: 'boolean',
    description:
      'Adds a `ContextMenuShortcut` to Edit and Duplicate, with `aria-keyshortcuts` on the item.',
  },
  side: {
    control: 'select',
    description:
      'The `side` of the pointer `ContextMenuPopup` opens on; the story opens it at the center of the area.',
    options: contextMenuSides,
  },
  submenu: {
    control: 'boolean',
    description:
      'Adds a `ContextMenuSub`: a `ContextMenuSubTrigger` that opens a `ContextMenuSubPopup`.',
  },
  trigger: {
    control: 'text',
    description:
      'Text of the `ContextMenuTrigger` area; a right-click or a long press on it opens the menu.',
  },
}
