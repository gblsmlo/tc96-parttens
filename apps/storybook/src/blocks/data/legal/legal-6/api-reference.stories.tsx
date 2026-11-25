import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal6 } from '@tc96/ui/blocks/data/legal/legal-6'
import { fn } from 'storybook/test'
import {
  countDeadlineQueues,
  deadlines,
  kinds,
  owners,
  readDeadlineQueue,
} from '../fixtures/legal-6.ts'

const meta = {
  args: {
    counts: countDeadlineQueues(deadlines),
    deadlines: readDeadlineQueue(deadlines, { view: 'mine' }).items,
    kinds,
    onCreate: fn(),
    onOpen: fn(),
    onViewChange: fn(),
    owners,
    view: 'mine',
  },
  component: Legal6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal6/API Reference',
} satisfies Meta<typeof Legal6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
