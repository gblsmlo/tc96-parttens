import type { ArgTypes } from '@storybook/react-vite'

export interface Settings1Controls {
  avatarInitials: string
  email: string
  profileDescription: string
  sessionCount: number
  withActions: boolean
}

export const settings1ControlArgs: Settings1Controls = {
  avatarInitials: 'AR',
  email: 'ana@acme.com',
  profileDescription:
    'Como você aparece para sua equipe em todos os espaços de trabalho.',
  sessionCount: 2,
  withActions: true,
}

export const settings1ControlArgTypes: Partial<ArgTypes<Settings1Controls>> = {
  avatarInitials: {
    control: 'text',
    description: 'Initials shown in the avatar button.',
  },
  email: {
    control: 'text',
    description:
      'Starting value of the e-mail field; changing it restarts the field.',
  },
  profileDescription: {
    control: 'text',
    description:
      'Text of `labels.profileDescription`, under the profile title.',
  },
  sessionCount: {
    control: { min: 0, type: 'number' },
    description:
      'Count shown in the sessions row, in the singular or the plural.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes the callbacks; off removes the sign-out and delete buttons and the other handlers.',
  },
}
