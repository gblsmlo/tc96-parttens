import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsPreference1Controls,
  settingsPreference1ControlArgs,
  settingsPreference1ControlArgTypes,
} from './settings-preference-1-controls.ts'
import { ComposedSettingsPreference1 } from './settings-preference-1-layouts.tsx'

const meta = {
  args: settingsPreference1ControlArgs,
  argTypes: settingsPreference1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings1/Playground',
} satisfies Meta<SettingsPreference1Controls>

export default meta

type Story = StoryObj<SettingsPreference1Controls>

export const Playground: Story = {}
