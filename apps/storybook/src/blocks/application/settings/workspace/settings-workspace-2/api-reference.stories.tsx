import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsWorkspace2 } from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-2'
import { fn } from 'storybook/test'
import { roles, seats, team } from '../../fixtures/settings-workspace-2.ts'

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
  component: SettingsWorkspace2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Workspace/Settings2/API Reference',
} satisfies Meta<typeof SettingsWorkspace2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
