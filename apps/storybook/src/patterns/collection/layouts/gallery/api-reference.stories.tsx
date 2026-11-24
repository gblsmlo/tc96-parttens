import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '@tc96/ui/card'
import {
  type CollectionDefinition,
  GalleryRowSkeleton,
  GalleryView,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { Slot } from '../../../../test-utils/anatomy-slot'
import { GalleryCanvas } from './gallery-canvas.tsx'

interface AnatomyRecord {
  id: string
}

const anatomyCollection: CollectionDefinition<AnatomyRecord> = {
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [],
  records: [{ id: 'record-1' }, { id: 'record-2' }, { id: 'record-3' }],
}

const meta = {
  args: {
    collection: anatomyCollection,
    pageSize: 3,
    renderRecord: () => (
      <Card className="flex min-h-52 items-center justify-center">
        <Slot name="renderRecord" />
      </Card>
    ),
  },
  component: GalleryView<AnatomyRecord>,
  decorators: [GalleryCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Collection/Layouts/Gallery/API Reference',
} satisfies Meta<typeof GalleryView<AnatomyRecord>>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByText('renderRecord'),
    ).toHaveLength(3)
    await expect(
      canvasElement.querySelector('[data-slot="gallery-view"]'),
    ).toHaveAttribute('data-page-size', '3')
  },
}

export const SkeletonAnatomy: Story = {
  render: () => (
    <div className="grid max-w-sm">
      <GalleryRowSkeleton action descriptionLines={2} titleLines={2} />
    </div>
  ),
}
