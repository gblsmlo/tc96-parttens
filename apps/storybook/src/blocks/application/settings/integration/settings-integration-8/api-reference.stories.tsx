import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration8 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-8'
import { fn } from 'storybook/test'
import { settingsIntegration8Items } from '../../fixtures/settings-integration-8.ts'

const meta = {
  args: {
    integrations: settingsIntegration8Items,
    onAllPausedChange: fn(),
    onCopyKey: fn(),
    onEnabledChange: fn(),
  },
  component: SettingsIntegration8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings8/API Reference',
} satisfies Meta<typeof SettingsIntegration8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
