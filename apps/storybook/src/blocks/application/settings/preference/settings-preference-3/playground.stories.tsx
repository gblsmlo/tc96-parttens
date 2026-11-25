import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsPreference3Controls,
  settingsPreference3ControlArgs,
  settingsPreference3ControlArgTypes,
} from './settings-preference-3-controls.ts'
import { ComposedSettingsPreference3 } from './settings-preference-3-layouts.tsx'

const meta = {
  args: settingsPreference3ControlArgs,
  argTypes: settingsPreference3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings3/Playground',
} satisfies Meta<SettingsPreference3Controls>

export default meta

type Story = StoryObj<SettingsPreference3Controls>

export const Playground: Story = {}
