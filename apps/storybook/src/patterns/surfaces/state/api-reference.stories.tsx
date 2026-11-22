import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateGuard, StateSurface } from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot'
import { StateCanvas } from './state-canvas.tsx'

const meta = {
  decorators: [StateCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Surfaces/State/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <StateSurface
      actions={<Slot name="actions" />}
      description={<Slot name="description" />}
      kind="empty"
      title={<Slot name="title" />}
    />
  ),
}

export const LoadingAnatomy: Story = {
  render: () => (
    <StateGuard
      state="loading"
      surface={{
        description: <Slot name="description" />,
        title: <Slot name="title" />,
      }}
    >
      <Slot name="children" />
    </StateGuard>
  ),
}
