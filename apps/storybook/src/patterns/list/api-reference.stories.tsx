import type { Meta, StoryObj } from '@storybook/react-vite'
import { List } from '@tc96/ui/patterns'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { ListCanvas } from './list-canvas.tsx'

const meta = {
  component: List,
  decorators: [ListCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/List/API Reference',
} satisfies Meta<typeof List>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    actions: <Slot name="actions" />,
    description: <Slot name="description" />,
    icon: <IconSlot />,
    title: <Slot name="title" />,
  },
}
