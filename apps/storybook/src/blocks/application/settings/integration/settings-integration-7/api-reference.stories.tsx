import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration7 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-7'
import { fn } from 'storybook/test'
import { settingsIntegration7Apps } from '../../fixtures/settings-integration-7.ts'

const meta = {
  args: {
    apps: settingsIntegration7Apps,
    onAction: fn(),
    onBuild: fn(),
  },
  component: SettingsIntegration7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings7/API Reference',
} satisfies Meta<typeof SettingsIntegration7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
