import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconRow } from '@tc96/parttens'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { IconRowCanvas } from './icon-row-canvas.tsx'

const meta = {
  component: IconRow,
  decorators: [IconRowCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/IconRow/API Reference',
} satisfies Meta<typeof IconRow>

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
