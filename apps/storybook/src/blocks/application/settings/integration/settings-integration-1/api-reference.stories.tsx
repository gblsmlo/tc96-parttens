import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration1 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-1'
import { fn } from 'storybook/test'
import { endpoints } from '../../fixtures/settings-integration-1.ts'

const meta = {
  args: {
    endpoints,
    onCreate: fn(),
    onEnabledChange: fn(),
    onEndpointAction: fn(),
  },
  component: SettingsIntegration1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Integration/Settings1/API Reference',
} satisfies Meta<typeof SettingsIntegration1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
