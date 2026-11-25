import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsPreference3 } from '@tc96/ui/blocks/application/settings/preference/settings-preference-3'
import { fn } from 'storybook/test'
import { settingsPreference3Data } from '../../fixtures/settings-preference-3.ts'

const meta = {
  args: {
    ...settingsPreference3Data,
    onColorThemeChange: fn(),
    onModeChange: fn(),
  },
  component: SettingsPreference3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Preference/Settings3/API Reference',
} satisfies Meta<typeof SettingsPreference3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
