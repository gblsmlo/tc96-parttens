import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCanvas } from './settings-canvas.tsx'
import {
  type SettingsControls,
  settingsControlArgs,
  settingsControlArgTypes,
} from './settings-controls.ts'
import { ComposedSettings } from './settings-layouts.tsx'

const meta = {
  args: settingsControlArgs,
  argTypes: settingsControlArgTypes,
  decorators: [SettingsCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSettings {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Playground',
} satisfies Meta<SettingsControls>

export default meta

type Story = StoryObj<SettingsControls>

export const Playground: Story = {}
