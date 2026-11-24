import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar2Controls {
  environment: string
  organization: string
  project: string
}

export const navbar2ControlArgs: Navbar2Controls = {
  environment: 'staging',
  organization: 'acme',
  project: 'checkout',
}

export const navbar2ControlArgTypes: Partial<ArgTypes<Navbar2Controls>> = {
  environment: {
    control: 'select',
    description:
      'The `environmentId` that starts selected; its badge takes the `tone` of the option.',
    options: ['production', 'staging', 'development'],
  },
  organization: {
    control: 'select',
    description: 'The `organizationId` that starts selected.',
    options: ['acme', 'nuvem', 'verde'],
  },
  project: {
    control: 'select',
    description: 'The `projectId` that starts selected.',
    options: ['checkout', 'rastreio', 'portal'],
  },
}
