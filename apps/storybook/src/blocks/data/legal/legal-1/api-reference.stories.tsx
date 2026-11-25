import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal1 } from '@tc96/ui/blocks/data/legal/legal-1'
import { fn } from 'storybook/test'
import { cases, owners } from '../fixtures/legal-1.ts'

const meta = {
  args: {
    cases,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onQueueChange: fn(),
    onStatusChange: fn(),
    owners,
  },
  component: Legal1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal1/API Reference',
} satisfies Meta<typeof Legal1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
