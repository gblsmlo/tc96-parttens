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
  parameters: {
    controls: { exclude: ['groupOpen'] },
    layout: 'centered',
  },
  render: (args) => <ComposedSettings {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Stories',
} satisfies Meta<SettingsControls>

export default meta

type Story = StoryObj<SettingsControls>

export const Default: Story = {}

export const Closed: Story = {
  args: { groupOpen: false },
}
