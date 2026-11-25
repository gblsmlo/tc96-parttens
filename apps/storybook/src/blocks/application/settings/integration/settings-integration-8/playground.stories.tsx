import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration8Controls,
  settingsIntegration8ControlArgs,
  settingsIntegration8ControlArgTypes,
} from './settings-integration-8-controls.ts'
import { ComposedSettingsIntegration8 } from './settings-integration-8-layouts.tsx'

const meta = {
  args: settingsIntegration8ControlArgs,
  argTypes: settingsIntegration8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings8/Playground',
} satisfies Meta<SettingsIntegration8Controls>

export default meta

type Story = StoryObj<SettingsIntegration8Controls>

export const Playground: Story = {}
