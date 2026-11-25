import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal5 } from '@tc96/ui/blocks/data/legal/legal-5'
import { fn } from 'storybook/test'
import {
  clients,
  counts,
  owners,
  phases,
  records,
  tags,
} from '../fixtures/legal-5.ts'

const meta = {
  args: {
    clients,
    counts,
    onCreate: fn(),
    onModeChange: fn(),
    onOwnerChange: fn(),
    onPageChange: fn(),
    onPhaseChange: fn(),
    onSearchChange: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onViewChange: fn(),
    owners,
    page: 1,
    pageCount: 1,
    pageSize: 25,
    phases,
    records,
    tags,
    total: records.length,
  },
  component: Legal5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal5/API Reference',
} satisfies Meta<typeof Legal5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
