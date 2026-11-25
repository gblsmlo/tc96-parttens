import type { ArgTypes } from '@storybook/react-vite'
import type { Navbar10Method } from '@tc96/ui/blocks/application/navbar/navbar-10'

export interface Navbar10Controls {
  method: Navbar10Method
  path: string
  sending: boolean
  service: string
  showLogo: boolean
  showMenu: boolean
  showRequest: boolean
  showServices: boolean
  showUser: boolean
}

export const navbar10ControlArgs: Navbar10Controls = {
  method: 'GET',
  path: '/modelos/{id}',
  sending: false,
  service: 'models',
  showLogo: true,
  showMenu: true,
  showRequest: true,
  showServices: true,
  showUser: true,
}

export const navbar10ControlArgTypes: Partial<ArgTypes<Navbar10Controls>> = {
  method: {
    control: 'inline-radio',
    description: 'The `method` prop, shown in the select of the request bar.',
    options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  path: {
    control: 'text',
    description: 'The `path` prop, the value of the monospace input.',
  },
  sending: {
    control: 'boolean',
    description: 'Disables the Enviar button and blocks submitting with Enter.',
  },
  service: {
    control: 'inline-radio',
    description: 'The `service` prop, the id of the active service.',
    options: ['models', 'payments', 'webhooks'],
  },
  showLogo: {
    control: 'boolean',
    description: 'Passes `logo`; without it only the name shows.',
  },
  showMenu: {
    control: 'boolean',
    description:
      'Passes `menu`; without it the account menu lists only the user.',
  },
  showRequest: {
    control: 'boolean',
    description: 'Passes `onSend`; without it the request form is absent.',
  },
  showServices: {
    control: 'boolean',
    description:
      'Passes `services`, `service` and `onServiceChange`; without them no switcher.',
  },
  showUser: {
    control: 'boolean',
    description: 'Passes `user`; without it no account menu.',
  },
}
