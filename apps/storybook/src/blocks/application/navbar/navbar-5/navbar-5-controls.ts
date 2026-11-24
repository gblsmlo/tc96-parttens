import type { ArgTypes } from '@storybook/react-vite'
import type { Navbar5Status } from '@tc96/blocks/application/navbar/navbar-5'

export interface Navbar5Controls {
  maxPeople: number
  pending: boolean
  peopleCount: number
  showActions: boolean
  showPublish: boolean
  status: Navbar5Status
}

export const navbar5ControlArgs: Navbar5Controls = {
  maxPeople: 3,
  pending: false,
  peopleCount: 5,
  showActions: true,
  showPublish: true,
  status: 'draft',
}

export const navbar5ControlArgTypes: Partial<ArgTypes<Navbar5Controls>> = {
  maxPeople: {
    control: { max: 5, min: 0, type: 'number' },
    description: 'The `maxPeople` prop; the rest becomes the +K counter.',
  },
  pending: {
    control: 'boolean',
    description: 'Disables the Publicar button and the menu trigger.',
  },
  peopleCount: {
    control: { max: 5, min: 0, type: 'number' },
    description: 'How many people of the fixture the `people` prop carries.',
  },
  showActions: {
    control: 'boolean',
    description:
      'Passes `actions` and `onPublishAction`; without them no menu.',
  },
  showPublish: {
    control: 'boolean',
    description: 'Passes `onPublish`; without it the split control is absent.',
  },
  status: {
    control: 'inline-radio',
    description: 'The `status` prop, which sets the Badge text and tone.',
    options: ['draft', 'published', 'changed'],
  },
}
