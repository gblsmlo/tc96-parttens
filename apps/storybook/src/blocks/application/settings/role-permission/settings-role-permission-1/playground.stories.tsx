import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsRolePermission1Controls,
  settingsRolePermission1ControlArgs,
  settingsRolePermission1ControlArgTypes,
} from './settings-role-permission-1-controls.ts'
import { ComposedSettingsRolePermission1 } from './settings-role-permission-1-layouts.tsx'

const meta = {
  args: settingsRolePermission1ControlArgs,
  argTypes: settingsRolePermission1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsRolePermission1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Role Permission/Settings1/Playground',
} satisfies Meta<SettingsRolePermission1Controls>

export default meta

type Story = StoryObj<SettingsRolePermission1Controls>

export const Playground: Story = {}
