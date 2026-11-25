import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsPreference2Controls,
  settingsPreference2ControlArgs,
  settingsPreference2ControlArgTypes,
} from './settings-preference-2-controls.ts'
import { ComposedSettingsPreference2 } from './settings-preference-2-layouts.tsx'

const meta = {
  args: settingsPreference2ControlArgs,
  argTypes: settingsPreference2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings2/Playground',
} satisfies Meta<SettingsPreference2Controls>

export default meta

type Story = StoryObj<SettingsPreference2Controls>

export const Playground: Story = {}
