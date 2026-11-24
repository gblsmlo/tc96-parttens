import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings6 } from '@tc96/blocks/application/settings/settings-6'
import { fn } from 'storybook/test'
import { roles, seats, team } from '../fixtures/settings-6.ts'

const meta = {
  args: {
    invitations: team.invitations,
    members: team.members,
    onInvitationAction: fn(),
    onInvite: fn(),
    onMemberAction: fn(),
    onRoleChange: fn(),
    roles,
    seats,
  },
  component: Settings6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings6/API Reference',
} satisfies Meta<typeof Settings6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
