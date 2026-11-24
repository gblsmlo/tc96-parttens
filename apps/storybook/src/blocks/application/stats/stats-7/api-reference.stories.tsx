import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats7 } from '@tc96/ui/blocks/application/stats/stats-7'
import { stats7Metrics } from '../fixtures/stats-7.ts'

const meta = {
  args: { metrics: stats7Metrics },
  component: Stats7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Stats/Stats7/API Reference',
} satisfies Meta<typeof Stats7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
