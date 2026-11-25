import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPaginationCanvas } from './collection-pagination-canvas.tsx'
import {
  type CollectionPaginationControls,
  collectionPaginationControlArgs,
  collectionPaginationControlArgTypes,
} from './collection-pagination-controls.ts'
import { ComposedCollectionPagination } from './collection-pagination-layouts.tsx'

const meta = {
  args: collectionPaginationControlArgs,
  argTypes: collectionPaginationControlArgTypes,
  decorators: [CollectionPaginationCanvas],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedCollectionPagination {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/CollectionPagination/Playground',
} satisfies Meta<CollectionPaginationControls>

export default meta

type Story = StoryObj<CollectionPaginationControls>

export const Playground: Story = {}
