import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration3Controls,
  settingsIntegration3ControlArgs,
  settingsIntegration3ControlArgTypes,
} from './settings-integration-3-controls.ts'
import { ComposedSettingsIntegration3 } from './settings-integration-3-layouts.tsx'

const meta = {
  args: settingsIntegration3ControlArgs,
  argTypes: settingsIntegration3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings3/Playground',
} satisfies Meta<SettingsIntegration3Controls>

export default meta

type Story = StoryObj<SettingsIntegration3Controls>

export const Playground: Story = {}
