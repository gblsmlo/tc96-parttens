import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal8 } from '@tc96/ui/blocks/data/legal/legal-8'
import { fn } from 'storybook/test'
import { failures, nextSweepAt, runs } from '../fixtures/legal-8.ts'

const meta = {
  args: {
    counts: { failures: failures.length, runs: runs.length },
    failures,
    nextSweepAt,
    onOpenFailure: fn(),
    onRun: fn(),
    onViewChange: fn(),
    runs,
  },
  component: Legal8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal8/API Reference',
} satisfies Meta<typeof Legal8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
