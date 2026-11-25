import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration2Controls,
  settingsIntegration2ControlArgs,
  settingsIntegration2ControlArgTypes,
} from './settings-integration-2-controls.ts'
import { ComposedSettingsIntegration2 } from './settings-integration-2-layouts.tsx'

const meta = {
  args: settingsIntegration2ControlArgs,
  argTypes: settingsIntegration2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings2/Playground',
} satisfies Meta<SettingsIntegration2Controls>

export default meta

type Story = StoryObj<SettingsIntegration2Controls>

export const Playground: Story = {}
