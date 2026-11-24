import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings20 } from '@tc96/blocks/application/settings/settings-20'
import { fn } from 'storybook/test'
import {
  settings20Categories,
  settings20Channels,
  settings20Matrix,
} from '../fixtures/settings-20.ts'

const meta = {
  args: {
    categories: settings20Categories,
    channels: settings20Channels,
    matrix: settings20Matrix,
    onChange: fn(),
  },
  component: Settings20,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings20/API Reference',
} satisfies Meta<typeof Settings20>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
