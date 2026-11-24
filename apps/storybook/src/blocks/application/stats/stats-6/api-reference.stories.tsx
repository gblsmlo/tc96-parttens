import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats6 } from '@tc96/blocks/application/stats/stats-6'
import { fn } from 'storybook/test'
import { sleeves } from '../fixtures/stats-6.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', sleeves },
  component: Stats6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Stats/Stats6/API Reference',
} satisfies Meta<typeof Stats6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
