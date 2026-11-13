import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionDataTableViewProps,
  type CollectionLayout,
  CollectionLayoutOutlet,
  CollectionProvider,
  useCollectionPreferences,
  useDataTable,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
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

const groupedCollection = {
  ...collection,
  groupings: [
    {
      getGroupId: () => 'todo',
      id: 'status',
      label: 'Status',
      options: [{ id: 'todo', label: 'A fazer' }],
    },
  ],
}

const switchableLayouts = [
  { label: 'Tabela', layout: 'datatable' },
  { label: 'Lista', layout: 'list' },
  { label: 'Kanban', layout: 'kanban' },
  { label: 'Galeria', layout: 'gallery' },
] as const satisfies readonly { label: string; layout: CollectionLayout }[]

function LayoutButtons() {
  const { preferences, setPreferences } = useCollectionPreferences()

  return (
    <div className="flex gap-2 p-2">
      {switchableLayouts.map(({ label, layout }) => (
        <Button
          aria-pressed={preferences.layout === layout}
          key={layout}
          onClick={() =>
            setPreferences((current) => ({ ...current, layout }), 'layout')
          }
          size="sm"
          variant="outline"
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

function LoadingOutlet({
  layout,
  listLoading,
}: Readonly<{ layout: CollectionLayout; listLoading?: boolean }>) {
  const { table } = useDataTable<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: groupedCollection.records,
    getRowId: (record) => record.id,
  })

  return (
    <CollectionProvider
      collection={groupedCollection}
      defaultPreferences={{ groupBy: 'status', layout }}
    >
      <LayoutButtons />
      <CollectionLayoutOutlet
        collection={groupedCollection}
        datatable={{ 'aria-label': 'Itens', table }}
        loading
        {...(listLoading === undefined
          ? {}
          : { list: { loading: listLoading } })}
        renderGalleryRecord={(record: Item) => record.title}
        renderKanbanRecord={(record: Item) => record.title}
        renderListRecord={(record: Item) => record.title}
      />
    </CollectionProvider>
  )
}

function layoutRoot(canvasElement: HTMLElement, slot: string) {
  const root = canvasElement.querySelector(`[data-slot="${slot}"]`)

  if (!root) throw new Error(`Missing [data-slot="${slot}"]`)

  return root
}

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

export const LoadingAcrossLayouts: Story = {
  render: () => <LoadingOutlet layout="datatable" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('table', { name: 'Itens' })).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Lista' }))
    await expect(layoutRoot(canvasElement, 'list-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Kanban' }))
    await expect(layoutRoot(canvasElement, 'kanban-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Galeria' }))
    await expect(layoutRoot(canvasElement, 'gallery-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByText('Primeiro item')).not.toBeInTheDocument()
  },
}

export const LayoutLoadingOverridesOutlet: Story = {
  render: () => <LoadingOutlet layout="list" listLoading={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(layoutRoot(canvasElement, 'list-view')).not.toHaveAttribute(
      'aria-busy',
    )
    await expect(canvas.getByText('Primeiro item')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Tabela' }))
    await expect(canvas.getByRole('table', { name: 'Itens' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}
