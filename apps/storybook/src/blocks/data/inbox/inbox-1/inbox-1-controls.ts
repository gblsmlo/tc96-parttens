import type { ArgTypes } from '@storybook/react-vite'
import {
  type Inbox1Category,
  inbox1Categories,
} from '@tc96/ui/blocks/data/inbox/inbox-1'

export type Inbox1CategoryControl = Inbox1Category | 'all'

export interface Inbox1Controls {
  category: Inbox1CategoryControl
  colors: boolean
  counts: boolean
  empty: boolean
  markError: boolean
  member: boolean
  openable: boolean
  readToggle: boolean
  title: string
}

export const inbox1ControlArgs: Inbox1Controls = {
  category: 'all',
  colors: true,
  counts: false,
  empty: false,
  markError: false,
  member: false,
  openable: true,
  readToggle: true,
  title: 'Inbox',
}

export const inbox1ControlArgTypes: Partial<ArgTypes<Inbox1Controls>> = {
  category: {
    control: 'select',
    description:
      'The selected category; `all` passes `null` (Todos). The view switcher changes it too and calls `onCategoryChange`.',
    options: ['all', ...inbox1Categories],
  },
  colors: {
    control: 'boolean',
    description:
      'Passes `originColors`, one CSS color per origin; off, every entry icon sits on the muted frame.',
  },
  counts: {
    control: 'boolean',
    description:
      'Passes `counts`, the unread entries of each category, shown beside each view in the category switcher popup and read in its name through `labels.viewCountName`.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no entries, which renders the empty message, or the filtered one while a category or a filter is set.',
  },
  markError: {
    control: 'boolean',
    description:
      'Passes `markError`, which renders the alert of a read change that failed.',
  },
  member: {
    control: 'boolean',
    description:
      'On, `categories` leaves Monitoramento out and the monitoring entries arrive with `openable: false` and the ready hint in `reason`, so their rows have no open button.',
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpen`; on, a row and the Abrir action open the entry.',
  },
  readToggle: {
    control: 'boolean',
    description:
      'Passes `onReadChange`; off, the read column shows the dot without a button.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and the table.',
  },
}
