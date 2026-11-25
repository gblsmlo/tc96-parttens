import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsWorkspace1Controls,
  settingsWorkspace1ControlArgs,
  settingsWorkspace1ControlArgTypes,
} from './settings-workspace-1-controls.ts'
import { ComposedSettingsWorkspace1 } from './settings-workspace-1-layouts.tsx'

const meta = {
  args: settingsWorkspace1ControlArgs,
  argTypes: settingsWorkspace1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsWorkspace1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Workspace/Settings1/Playground',
} satisfies Meta<SettingsWorkspace1Controls>

export default meta

type Story = StoryObj<SettingsWorkspace1Controls>

export const Playground: Story = {}
