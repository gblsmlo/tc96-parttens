import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsWorkspace2Controls {
  invite: string
  title: string
  withActions: boolean
  withInvitations: boolean
  withSeats: boolean
}

export const settingsWorkspace2ControlArgs: SettingsWorkspace2Controls = {
  invite: 'Convidar membros',
  title: 'Membros',
  withActions: true,
  withInvitations: true,
  withSeats: true,
}

export const settingsWorkspace2ControlArgTypes: Partial<
  ArgTypes<SettingsWorkspace2Controls>
> = {
  invite: {
    control: 'text',
    description: 'Text of `labels.invite`, the button of `onInvite`.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onInvite`, `onMemberAction`, `onRoleChange` and `onInvitationAction`; off removes the Invite button and the row menus.',
  },
  withInvitations: {
    control: 'boolean',
    description:
      'Passes the pending invitations; off passes an empty list, which hides the invitations section.',
  },
  withSeats: {
    control: 'boolean',
    description:
      'Passes `seats`; off removes the seats description under the title.',
  },
}
