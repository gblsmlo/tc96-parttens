import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings22 } from '@tc96/blocks/application/settings/settings-22'
import { fn } from 'storybook/test'
import { settings22Keys } from '../fixtures/settings-22.ts'

const meta = {
  args: {
    keys: settings22Keys,
    onActiveChange: fn(),
    onCopy: fn(),
    onCreate: fn(),
    onKeyAction: fn(),
  },
  component: Settings22,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings22/API Reference',
} satisfies Meta<typeof Settings22>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
