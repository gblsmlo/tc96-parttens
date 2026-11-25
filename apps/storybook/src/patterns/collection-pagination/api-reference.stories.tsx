import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPagination } from '@tc96/ui/patterns'
import { fn } from 'storybook/test'
import { CollectionPaginationCanvas } from './collection-pagination-canvas.tsx'

const meta = {
  args: {
    label: 'CollectionPagination',
    onPageChange: fn(),
    page: 2,
    pageCount: 3,
    pageSize: 25,
    total: 57,
  },
  component: CollectionPagination,
  decorators: [CollectionPaginationCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/CollectionPagination/API Reference',
} satisfies Meta<typeof CollectionPagination>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
