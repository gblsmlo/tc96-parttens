import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsPreference2 } from '@tc96/ui/blocks/application/settings/preference/settings-preference-2'
import { fn } from 'storybook/test'
import { settingsPreference2Data } from '../../fixtures/settings-preference-2.ts'

const meta = {
  args: { onValueChange: fn(), ...settingsPreference2Data },
  component: SettingsPreference2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Preference/Settings2/API Reference',
} satisfies Meta<typeof SettingsPreference2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
