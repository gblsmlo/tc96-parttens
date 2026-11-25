import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration2 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'
import { fn } from 'storybook/test'
import { settingsIntegration2Apps } from '../../fixtures/settings-integration-2.ts'

const meta = {
  args: { apps: settingsIntegration2Apps, onConnect: fn(), onDisconnect: fn() },
  component: SettingsIntegration2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings2/API Reference',
} satisfies Meta<typeof SettingsIntegration2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
