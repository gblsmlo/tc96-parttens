import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration4 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'
import { fn } from 'storybook/test'
import { settingsIntegration4Sections } from '../../fixtures/settings-integration-4.ts'

const meta = {
  args: {
    onAction: fn(),
    onCreate: fn(),
    sections: settingsIntegration4Sections,
  },
  component: SettingsIntegration4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings4/API Reference',
} satisfies Meta<typeof SettingsIntegration4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
