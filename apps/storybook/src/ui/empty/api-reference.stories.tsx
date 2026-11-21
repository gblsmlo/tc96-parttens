import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { Slot } from '../../test-utils/anatomy-slot'
import { EmptyCanvas } from './empty-frame.tsx'

const meta = {
  component: Empty,
  decorators: [EmptyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Empty/API Reference',
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg aria-hidden="true" data-anatomy="media" viewBox="0 0 18 18">
            <rect
              fill="none"
              height="17"
              rx="3"
              stroke="currentColor"
              strokeDasharray="2 2"
              width="17"
              x="0.5"
              y="0.5"
            />
          </svg>
        </EmptyMedia>
        <EmptyTitle>
          <Slot name="EmptyTitle" />
        </EmptyTitle>
        <EmptyDescription>
          <Slot name="EmptyDescription" />
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Slot name="EmptyContent" />
      </EmptyContent>
    </Empty>
  ),
}
