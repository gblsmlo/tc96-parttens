import type { Meta, StoryObj } from '@storybook/react-vite'
import { List6 } from '@tc96/blocks/application/list/list-6'
import { movers } from '../fixtures/list-6.ts'

const meta = {
  args: { movers, onQueryChange: () => {}, query: '' },
  component: List6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List6/API Reference',
} satisfies Meta<typeof List6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
