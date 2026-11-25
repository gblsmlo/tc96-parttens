import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsPreference1 } from '@tc96/ui/blocks/application/settings/preference/settings-preference-1'
import { fn } from 'storybook/test'
import {
  settingsPreference1Options,
  settingsPreference1Values,
} from '../../fixtures/settings-preference-1.ts'

const meta = {
  args: {
    onValueChange: fn(),
    options: settingsPreference1Options,
    values: settingsPreference1Values,
  },
  component: SettingsPreference1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Preference/Settings1/API Reference',
} satisfies Meta<typeof SettingsPreference1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
