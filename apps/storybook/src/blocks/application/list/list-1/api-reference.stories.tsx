import type { Meta, StoryObj } from '@storybook/react-vite'
import { List1 } from '@tc96/ui/blocks/application/list/list-1'
import { metrics } from '../fixtures/list-1.ts'

const meta = {
  args: { metrics },
  component: List1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List1/API Reference',
} satisfies Meta<typeof List1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
