import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration3 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-3'
import { fn } from 'storybook/test'
import { settingsIntegration3Keys } from '../../fixtures/settings-integration-3.ts'

const meta = {
  args: {
    keys: settingsIntegration3Keys,
    onActiveChange: fn(),
    onCopy: fn(),
    onCreate: fn(),
    onKeyAction: fn(),
  },
  component: SettingsIntegration3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings3/API Reference',
} satisfies Meta<typeof SettingsIntegration3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
