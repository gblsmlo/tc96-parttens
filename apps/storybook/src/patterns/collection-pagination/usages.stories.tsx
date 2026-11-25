import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  title: 'Patterns/CollectionPagination/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const Contacts: Story = {
  parameters: describe(
    'A contact list of 57 records, 25 per page, on the [Default](?path=/story/patterns-collectionpagination-layouts--default) layout, opened on the second page.',
  ),
  render: () => (
    <ComposedCollectionPagination
      {...collectionPaginationControlArgs}
      initialPage={2}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('26–50 de 57')).toBeVisible()
  },
}

export const Documents: Story = {
  parameters: describe(
    'A document library of 240 files, on the [Page Size Selector At Start](?path=/story/patterns-collectionpagination-layouts--page-size-selector-at-start) layout: the reader picks 10, 25 or 50 files per page.',
  ),
  render: () => (
    <PageSizeSelectorAtStartLayout
      {...collectionPaginationControlArgs}
      label="Paginação de documentos"
      pageSizeLabel="Documentos por página"
      total={240}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('navigation', {
        name: 'Paginação de documentos',
      }),
    ).toBeVisible()
  },
}

export const EmptySearch: Story = {
  parameters: describe(
    'A contact search that found nothing, on the [Default](?path=/story/patterns-collectionpagination-layouts--default) layout: the range reads 0 de 0 and every page button is disabled.',
  ),
  render: () => (
    <ComposedCollectionPagination
      {...collectionPaginationControlArgs}
      total={0}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('0 de 0')).toBeVisible()
  },
}
