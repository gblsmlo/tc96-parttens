import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal2 } from '@tc96/ui/blocks/data/legal/legal-2'
import { fn } from 'storybook/test'
import { contracts, owners } from '../fixtures/legal-2.ts'

const meta = {
  args: {
    contracts,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onQueueChange: fn(),
    onStatusChange: fn(),
    owners,
  },
  component: Legal2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal2/API Reference',
} satisfies Meta<typeof Legal2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
