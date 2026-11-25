import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid2 } from '@tc96/ui/blocks/data/data-grid/data-grid-2'
import { fn } from 'storybook/test'
import {
  initialSort,
  members,
  pageSizeOptions,
} from '../fixtures/data-grid-2.ts'

const meta = {
  args: {
    members,
    onSave: fn(),
    onShowPausedChange: fn(),
    pageSize: 8,
    pageSizeOptions,
    sort: initialSort,
  },
  component: DataGrid2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid2/API Reference',
} satisfies Meta<typeof DataGrid2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
