import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionToolbar } from '@tc96/ui/patterns'
import { Slot } from '../../test-utils/anatomy-slot'
import { ToolbarCanvas } from './toolbar-canvas.tsx'

const meta = {
  component: CollectionToolbar,
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/CollectionToolbar/API Reference',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <CollectionToolbar
      center={<Slot name="center" />}
      left={<Slot name="left" />}
      right={<Slot name="right" />}
    />
  ),
}
