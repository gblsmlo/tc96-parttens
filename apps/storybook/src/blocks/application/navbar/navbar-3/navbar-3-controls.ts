import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar3Controls {
  hasUserActions: boolean
  notificationCount: number
  searchPlaceholder: string
}

export const navbar3ControlArgs: Navbar3Controls = {
  hasUserActions: true,
  notificationCount: 3,
  searchPlaceholder: 'Buscar páginas e ações',
}

export const navbar3ControlArgTypes: Partial<ArgTypes<Navbar3Controls>> = {
  hasUserActions: {
    control: 'boolean',
    description:
      'Whether `userActions` is passed; without it the user menu lists only the name and e-mail.',
  },
  notificationCount: {
    control: { max: 3, min: 0, type: 'number' },
    description:
      'How many notifications are passed; the badge counts the unread ones and zero renders the empty state.',
  },
  searchPlaceholder: {
    control: 'text',
    description:
      'Text of `labels.searchPlaceholder`, shown in the trigger and in the dialog input.',
  },
}
