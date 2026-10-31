import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionDataTableViewProps,
  type CollectionLayout,
  CollectionLayoutOutlet,
  CollectionProvider,
  useDataTable,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

interface Item {
  id: string
  title: string
}

const collection = {
  getKey: (record: Item) => record.id,
  getLabel: (record: Item) => record.title,
  groupings: [],
  records: [{ id: 'a', title: 'Primeiro item' }],
}

const openRow = fn()

function Outlet({
  layout,
  onRowClick,
  withListRenderer = true,
}: Readonly<{
  layout: CollectionLayout
  onRowClick?: CollectionDataTableViewProps<Item>['onRowClick']
  withListRenderer?: boolean
}>) {
  const { table } = useDataTable<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: collection.records,
    getRowId: (record) => record.id,
  })

  return (
    <CollectionProvider
      collection={collection}
      defaultPreferences={{ groupBy: null, layout }}
    >
      <CollectionLayoutOutlet
        collection={collection}
        datatable={{ 'aria-label': 'Itens', onRowClick, table }}
        renderGalleryRecord={(record: Item) => record.title}
        renderKanbanRecord={(record: Item) => record.title}
        {...(withListRenderer
          ? { renderListRecord: (record: Item) => record.title }
          : {})}
      />
    </CollectionProvider>
  )
}

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Composition/Layout Outlet',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const GalleryLayout: Story = {
  render: () => <Outlet layout="gallery" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Primeiro item'),
    ).toBeInTheDocument()
  },
}

export const DataTableLayout: Story = {
  render: () => <Outlet layout="datatable" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('table', { name: 'Itens' }),
    ).toBeInTheDocument()
    await expect(canvas.getByText('Primeiro item')).toBeInTheDocument()
  },
}

export const DataTableWithoutListRenderer: Story = {
  render: () => <Outlet layout="datatable" withListRenderer={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Itens' }),
    ).toBeInTheDocument()
  },
}

export const DataTableRowClickForwardsRecord: Story = {
  render: () => <Outlet layout="datatable" onRowClick={openRow} />,
  play: async ({ canvasElement }) => {
    openRow.mockClear()

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Abrir registro' }),
    )

    await expect(openRow).toHaveBeenCalledTimes(1)
    await expect(openRow.mock.calls[0][0]).toMatchObject({ id: 'a' })
  },
}
