import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline4 } from '@tc96/blocks/application/timeline/timeline-4'
import { fn } from 'storybook/test'
import { activityEntries } from '../fixtures/timeline-4.ts'

const meta = {
  args: { entries: activityEntries, onOpenChange: fn(), open: false },
  component: Timeline4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Timeline/Timeline4/API Reference',
} satisfies Meta<typeof Timeline4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
