import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings3 } from '@tc96/blocks/application/settings/settings-3'
import { fn } from 'storybook/test'
import { settings3Data } from '../fixtures/settings-3.ts'

const meta = {
  args: { onValueChange: fn(), ...settings3Data },
  component: Settings3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings3/API Reference',
} satisfies Meta<typeof Settings3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
