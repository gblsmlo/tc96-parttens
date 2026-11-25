import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration6 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-6'
import { fn } from 'storybook/test'
import { settingsIntegration6Apps } from '../../fixtures/settings-integration-6.ts'

const meta = {
  args: {
    apps: settingsIntegration6Apps,
    onConnect: fn(),
    onDisconnect: fn(),
    onEnabledChange: fn(),
  },
  component: SettingsIntegration6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings6/API Reference',
} satisfies Meta<typeof SettingsIntegration6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
