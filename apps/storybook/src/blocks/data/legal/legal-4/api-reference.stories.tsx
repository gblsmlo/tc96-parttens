import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal4 } from '@tc96/ui/blocks/data/legal/legal-4'
import { fn } from 'storybook/test'
import { clients, owners } from '../fixtures/legal-4.ts'

const meta = {
  args: {
    clients,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onQueueChange: fn(),
    onStatusChange: fn(),
    owners,
  },
  component: Legal4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal4/API Reference',
} satisfies Meta<typeof Legal4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
