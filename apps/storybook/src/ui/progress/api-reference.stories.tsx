import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@tc96/ui/progress'
import { Slot } from '../../test-utils/anatomy-slot'
import { ProgressCanvas } from './progress-frame.tsx'

const meta = {
  args: { value: 60 },
  component: Progress,
  decorators: [ProgressCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Progress/API Reference',
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Progress {...args}>
      <div className="flex items-center gap-2">
        <ProgressLabel>
          <Slot name="ProgressLabel" />
        </ProgressLabel>
        <ProgressValue className="ms-auto">
          {() => <Slot name="ProgressValue" />}
        </ProgressValue>
      </div>
      <ProgressTrack className="flex h-6 items-center">
        <ProgressIndicator className="flex items-center px-2 text-primary-foreground text-xs">
          ProgressIndicator
        </ProgressIndicator>
        <span className="px-2 text-foreground text-xs">ProgressTrack</span>
      </ProgressTrack>
    </Progress>
  ),
}
