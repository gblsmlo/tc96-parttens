import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar8Controls {
  category: string
  pending: boolean
  showCategories: boolean
  showDeploy: boolean
  showHomeLink: boolean
  showMenu: boolean
  showNotifications: boolean
  showUser: boolean
  unreadCount: number
}

export const navbar8ControlArgs: Navbar8Controls = {
  category: 'all',
  pending: false,
  showCategories: true,
  showDeploy: true,
  showHomeLink: false,
  showMenu: true,
  showNotifications: true,
  showUser: true,
  unreadCount: 3,
}

export const navbar8ControlArgTypes: Partial<ArgTypes<Navbar8Controls>> = {
  category: {
    control: 'inline-radio',
    description: 'The `category` prop; the checked pill.',
    options: ['all', 'code', 'research', 'data'],
  },
  pending: {
    control: 'boolean',
    description: 'Disables the Implantar button.',
  },
  showCategories: {
    control: 'boolean',
    description: 'Passes `categories`; without them no pills.',
  },
  showDeploy: {
    control: 'boolean',
    description: 'Passes `onDeploy`; without it no Implantar button.',
  },
  showHomeLink: {
    control: 'boolean',
    description: 'Passes `homeHref`; the brand becomes a link.',
  },
  showMenu: {
    control: 'boolean',
    description: 'Passes `menu`; without it the user menu shows only the user.',
  },
  showNotifications: {
    control: 'boolean',
    description: 'Passes `notifications`; without them no bell.',
  },
  showUser: {
    control: 'boolean',
    description: 'Passes `user`; without it no avatar menu.',
  },
  unreadCount: {
    control: { max: 4, min: 0, type: 'number' },
    description: 'How many notifications of the fixture are unread.',
  },
}
