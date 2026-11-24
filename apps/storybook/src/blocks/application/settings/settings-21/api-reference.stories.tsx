import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings21 } from '@tc96/ui/blocks/application/settings/settings-21'
import { fn } from 'storybook/test'
import { settings21Apps } from '../fixtures/settings-21.ts'

const meta = {
  args: { apps: settings21Apps, onConnect: fn(), onDisconnect: fn() },
  component: Settings21,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings21/API Reference',
} satisfies Meta<typeof Settings21>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
