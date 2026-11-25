import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRolePermission1 } from '@tc96/ui/blocks/application/settings/role-permission/settings-role-permission-1'
import { fn } from 'storybook/test'
import {
  capabilities,
  roles,
} from '../../fixtures/settings-role-permission-1.ts'

const meta = {
  args: {
    capabilities,
    onCapabilityChange: fn(),
    onRoleChange: fn(),
    roles,
    selectedRole: 'editor',
  },
  component: SettingsRolePermission1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Role Permission/Settings1/API Reference',
} satisfies Meta<typeof SettingsRolePermission1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
