import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsWorkspace2Controls,
  settingsWorkspace2ControlArgs,
  settingsWorkspace2ControlArgTypes,
} from './settings-workspace-2-controls.ts'
import { ComposedSettingsWorkspace2 } from './settings-workspace-2-layouts.tsx'

const meta = {
  args: settingsWorkspace2ControlArgs,
  argTypes: settingsWorkspace2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsWorkspace2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Workspace/Settings2/Playground',
} satisfies Meta<SettingsWorkspace2Controls>

export default meta

type Story = StoryObj<SettingsWorkspace2Controls>

export const Playground: Story = {}
