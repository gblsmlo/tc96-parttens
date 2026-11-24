import type { Meta, StoryObj } from '@storybook/react-vite'
import { NextSteps1 } from '@tc96/blocks/records/next-steps-1'
import { Slot } from '../../../test-utils/anatomy-slot'
import { NextSteps1Canvas } from './next-steps-1-canvas.tsx'

const meta = {
  decorators: [NextSteps1Canvas],
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Records/NextSteps1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <NextSteps1
      onDismiss={() => undefined}
      rows={[
        {
          detail: <Slot name="detail" />,
          id: 'row',
          status: 'pending',
          title: <Slot name="title" />,
        },
      ]}
      tasks={[{ actionLabel: 'Ação', id: 'task', title: 'Tarefa' }]}
    />
  ),
}
