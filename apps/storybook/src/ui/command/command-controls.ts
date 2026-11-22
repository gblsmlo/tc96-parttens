import type { ArgTypes } from '@storybook/react-vite'

export interface CommandControls {
  dialog: boolean
  disabledItem: boolean
  empty: string
  footer: boolean
  groups: boolean
  label: string
  panel: boolean
  placeholder: string
  query: string
  separators: boolean
  shortcuts: boolean
  trigger: string
}

export const commandControlArgs: CommandControls = {
  dialog: true,
  disabledItem: false,
  empty: 'No results found.',
  footer: true,
  groups: true,
  label: 'Command palette',
  panel: true,
  placeholder: 'Search for apps and commands…',
  query: '',
  separators: true,
  shortcuts: true,
  trigger: 'Open command palette',
}

export const commandControlArgTypes: Partial<ArgTypes<CommandControls>> = {
  dialog: {
    control: 'boolean',
    description:
      'Renders `Command` inside `CommandDialog`, with `CommandDialogTrigger` and `CommandDialogPopup`; off renders it inline on the page.',
  },
  disabledItem: {
    control: 'boolean',
    description: 'Sets `disabled` on the `Billing` `CommandItem`.',
  },
  empty: {
    control: 'text',
    description:
      'Text of `CommandEmpty`, shown when nothing matches; empty removes the part.',
  },
  footer: {
    control: 'boolean',
    description: 'Adds `CommandFooter` with the keyboard hints.',
  },
  groups: {
    control: 'boolean',
    description:
      'Lists the items in a `CommandGroup` per group, with a `CommandGroupLabel`; off lists them flat.',
  },
  label: {
    control: 'text',
    description:
      'The `aria-label` of `CommandDialogPopup` and `CommandInput`, which names the dialog and the search field.',
  },
  panel: {
    control: 'boolean',
    description: 'Wraps `CommandEmpty` and `CommandList` in a `CommandPanel`.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `CommandInput`, shown while it is empty.',
  },
  query: {
    control: 'text',
    description:
      'The `defaultValue` of `Command`: the text the search field starts with, which filters the list.',
  },
  separators: {
    control: 'boolean',
    description:
      'Adds a `CommandSeparator` after each group; acts only with `groups`.',
  },
  shortcuts: {
    control: 'boolean',
    description: 'Adds a `CommandShortcut` to the items of the Settings group.',
  },
  trigger: {
    control: 'text',
    description:
      'Text of `CommandDialogTrigger`, which reopens the dialog; acts only with `dialog`.',
  },
}
