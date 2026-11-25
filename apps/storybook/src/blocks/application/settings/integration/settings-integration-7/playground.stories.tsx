import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration7Controls,
  settingsIntegration7ControlArgs,
  settingsIntegration7ControlArgTypes,
} from './settings-integration-7-controls.ts'
import { ComposedSettingsIntegration7 } from './settings-integration-7-layouts.tsx'

const meta = {
  args: settingsIntegration7ControlArgs,
  argTypes: settingsIntegration7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings7/Playground',
} satisfies Meta<SettingsIntegration7Controls>

export default meta

type Story = StoryObj<SettingsIntegration7Controls>

export const Playground: Story = {}
