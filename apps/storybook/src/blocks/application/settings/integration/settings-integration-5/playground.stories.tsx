import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsIntegration5Controls,
  settingsIntegration5ControlArgs,
  settingsIntegration5ControlArgTypes,
} from './settings-integration-5-controls.ts'
import { ComposedSettingsIntegration5 } from './settings-integration-5-layouts.tsx'

const meta = {
  args: settingsIntegration5ControlArgs,
  argTypes: settingsIntegration5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings5/Playground',
} satisfies Meta<SettingsIntegration5Controls>

export default meta

type Story = StoryObj<SettingsIntegration5Controls>

export const Playground: Story = {}
