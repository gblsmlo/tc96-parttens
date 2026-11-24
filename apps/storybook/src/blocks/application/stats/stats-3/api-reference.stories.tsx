import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats3 } from '@tc96/blocks/application/stats/stats-3'
import { capacity } from '../fixtures/stats-3.ts'

const meta = {
  args: { items: capacity },
  component: Stats3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Stats/Stats3/API Reference',
} satisfies Meta<typeof Stats3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
