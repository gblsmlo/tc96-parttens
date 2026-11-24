import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings11 } from '@tc96/blocks/application/settings/settings-11'
import { fn } from 'storybook/test'
import { settings11Groups } from '../fixtures/settings-11.ts'

const meta = {
  args: { groups: settings11Groups, onCreate: fn(), onStatusAction: fn() },
  component: Settings11,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings11/API Reference',
} satisfies Meta<typeof Settings11>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
