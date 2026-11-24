import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings2 } from '@tc96/blocks/application/settings/settings-2'
import { fn } from 'storybook/test'
import { settings2Options, settings2Values } from '../fixtures/settings-2.ts'

const meta = {
  args: {
    onValueChange: fn(),
    options: settings2Options,
    values: settings2Values,
  },
  component: Settings2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings2/API Reference',
} satisfies Meta<typeof Settings2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
