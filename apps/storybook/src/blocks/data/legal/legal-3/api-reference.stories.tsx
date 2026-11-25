import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal3 } from '@tc96/ui/blocks/data/legal/legal-3'
import { fn } from 'storybook/test'
import {
  calendarAnchor,
  calendarNow,
  deadlines,
  owners,
} from '../fixtures/legal-3.ts'

const meta = {
  args: {
    anchor: calendarAnchor,
    now: calendarNow,
    deadlines,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onQueueChange: fn(),
    onStatusChange: fn(),
    owners,
  },
  component: Legal3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal3/API Reference',
} satisfies Meta<typeof Legal3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
