import type { Meta, StoryObj } from '@storybook/react-vite'
import { List5 } from '@tc96/blocks/application/list/list-5'
import { modules } from '../fixtures/list-5.ts'

const meta = {
  args: { modules, onAdd: () => {}, onBrowseMore: () => {} },
  component: List5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List5/API Reference',
} satisfies Meta<typeof List5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
