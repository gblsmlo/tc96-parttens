import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState4Controls {
  copied: boolean
  copyLink: boolean
  invite: boolean
  title: string
}

export const emptyState4ControlArgs: EmptyState4Controls = {
  copied: false,
  copyLink: true,
  invite: true,
  title: 'Você ainda está sozinho por aqui',
}

export const emptyState4ControlArgTypes: Partial<
  ArgTypes<EmptyState4Controls>
> = {
  copied: {
    control: 'boolean',
    description: 'Switches the copy button to the `copied` label.',
  },
  copyLink: {
    control: 'boolean',
    description: 'Passes `onCopyLink`, which renders the copy button.',
  },
  invite: {
    control: 'boolean',
    description: 'Passes `onInvite`, which renders the invite button.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`.',
  },
}
