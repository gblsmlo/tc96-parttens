import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPaginationCanvas } from './collection-pagination-canvas.tsx'
import { collectionPaginationControlArgs } from './collection-pagination-controls.ts'
import {
  ComposedCollectionPagination,
  PageSizeSelectorAtStartLayout,
} from './collection-pagination-layouts.tsx'

const meta = {
  decorators: [CollectionPaginationCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionPagination/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ComposedCollectionPagination {...collectionPaginationControlArgs} />
  ),
}

export const PageSizeSelectorAtStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The rows-per-page selector at the start, then the range beside the page buttons at the end. For a collection whose reader chooses how many records each page holds.',
      },
    },
  },
  render: () => (
    <PageSizeSelectorAtStartLayout {...collectionPaginationControlArgs} />
  ),
}
