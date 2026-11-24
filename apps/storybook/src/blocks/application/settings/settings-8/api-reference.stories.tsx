import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings8 } from '@tc96/ui/blocks/application/settings/settings-8'
import { fn } from 'storybook/test'

const meta = {
  args: { enabled: true, onEnabledChange: fn() },
  component: Settings8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings8/API Reference',
} satisfies Meta<typeof Settings8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
