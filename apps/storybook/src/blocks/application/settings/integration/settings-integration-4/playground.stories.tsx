import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration4Controls,
  settingsIntegration4ControlArgs,
  settingsIntegration4ControlArgTypes,
} from './settings-integration-4-controls.ts'
import { ComposedSettingsIntegration4 } from './settings-integration-4-layouts.tsx'

const meta = {
  args: settingsIntegration4ControlArgs,
  argTypes: settingsIntegration4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings4/Playground',
} satisfies Meta<SettingsIntegration4Controls>

export default meta

type Story = StoryObj<SettingsIntegration4Controls>

export const Playground: Story = {}
