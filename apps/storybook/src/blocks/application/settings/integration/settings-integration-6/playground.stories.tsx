import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration6Controls,
  settingsIntegration6ControlArgs,
  settingsIntegration6ControlArgTypes,
} from './settings-integration-6-controls.ts'
import { ComposedSettingsIntegration6 } from './settings-integration-6-layouts.tsx'

const meta = {
  args: settingsIntegration6ControlArgs,
  argTypes: settingsIntegration6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings6/Playground',
} satisfies Meta<SettingsIntegration6Controls>

export default meta

type Story = StoryObj<SettingsIntegration6Controls>

export const Playground: Story = {}
