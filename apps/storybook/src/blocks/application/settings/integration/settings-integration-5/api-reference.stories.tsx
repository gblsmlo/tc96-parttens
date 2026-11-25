import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration5 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-5'
import { fn } from 'storybook/test'
import { settingsIntegration5Apps } from '../../fixtures/settings-integration-5.ts'

const meta = {
  args: {
    apps: settingsIntegration5Apps,
    onChannelChange: fn(),
    onConnect: fn(),
    onDisconnect: fn(),
  },
  component: SettingsIntegration5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings5/API Reference',
} satisfies Meta<typeof SettingsIntegration5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
