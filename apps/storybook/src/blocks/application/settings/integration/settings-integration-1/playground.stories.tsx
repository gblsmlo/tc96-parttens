import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration1Controls,
  settingsIntegration1ControlArgs,
  settingsIntegration1ControlArgTypes,
} from './settings-integration-1-controls.ts'
import { ComposedSettingsIntegration1 } from './settings-integration-1-layouts.tsx'

const meta = {
  args: settingsIntegration1ControlArgs,
  argTypes: settingsIntegration1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings1/Playground',
} satisfies Meta<SettingsIntegration1Controls>

export default meta

type Story = StoryObj<SettingsIntegration1Controls>

export const Playground: Story = {}
