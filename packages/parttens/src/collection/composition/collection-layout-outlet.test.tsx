import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ReactElement } from 'react'
import type { CollectionDataTableViewProps } from './collection-layout-outlet'

await import('../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { CollectionProvider } = await import('../store/collection-provider')
const { CollectionLayoutOutlet } = await import('./collection-layout-outlet')
const { useDataTable } = await import('../layouts/data-table/use-data-table')

afterEach(cleanup)

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

type OutletProps = Omit<
  Parameters<typeof CollectionLayoutOutlet<Item>>[0],
  | 'collection'
  | 'renderGalleryRecord'
  | 'renderKanbanRecord'
  | 'renderListRecord'
>

function Outlet({
  onRowClick,
  layout,
  withGalleryRenderer = true,
  withKanbanRenderer = true,
  withListRenderer = true,
  withTable = false,
  ...props
}: Readonly<
  OutletProps & {
    onRowClick?: CollectionDataTableViewProps<Item>['onRowClick']
    layout: 'calendar' | 'datatable' | 'gallery' | 'kanban' | 'list'
    withGalleryRenderer?: boolean
    withKanbanRenderer?: boolean
    withListRenderer?: boolean
    withTable?: boolean
  }
>): ReactElement {
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
        {...(withGalleryRenderer
          ? { renderGalleryRecord: (record: Item) => record.title }
          : {})}
        {...(withKanbanRenderer
          ? { renderKanbanRecord: (record: Item) => record.title }
          : {})}
        {...(withListRenderer
          ? { renderListRecord: (record: Item) => record.title }
          : {})}
        {...(withTable
          ? { datatable: { 'aria-label': 'Itens', onRowClick, table } }
          : {})}
        {...props}
      />
    </CollectionProvider>
  )
}

describe('CollectionLayoutOutlet', () => {
  test('renders the GalleryView for the gallery layout', () => {
    const { container } = render(<Outlet layout="gallery" />)

    expect(container.querySelector('[data-slot="gallery-view"]')).toBeTruthy()
    expect(screen.getByText('Primeiro item')).toBeTruthy()
  })

  test('renders the DataTable for the datatable layout', () => {
    render(<Outlet layout="datatable" withTable />)

    expect(screen.getByRole('table', { name: 'Itens' })).toBeTruthy()
    expect(screen.getByText('Primeiro item')).toBeTruthy()
  })

  test('renders a layout that is not the list without renderListRecord', () => {
    render(<Outlet layout="datatable" withListRenderer={false} withTable />)

    expect(screen.getByRole('table', { name: 'Itens' })).toBeTruthy()
  })

  test('forwards datatable.onRowClick to the row trigger', () => {
    const onRowClick = mock()
    render(<Outlet onRowClick={onRowClick} layout="datatable" withTable />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir registro' }))

    expect(onRowClick).toHaveBeenCalledTimes(1)
    expect(onRowClick.mock.calls[0][0].id).toBe('a')
  })

  test('requires the props of the views that need consumer configuration', () => {
    const originalError = console.error
    console.error = () => undefined
    try {
      expect(() => render(<Outlet layout="datatable" />)).toThrow(
        'o layout "datatable" exige a prop `datatable`',
      )
      expect(() => render(<Outlet layout="calendar" />)).toThrow(
        'o layout "calendar" exige a prop `calendar`',
      )
      expect(() =>
        render(<Outlet layout="gallery" withGalleryRenderer={false} />),
      ).toThrow('o layout "gallery" exige a prop `renderGalleryRecord`')
      expect(() =>
        render(<Outlet layout="kanban" withKanbanRenderer={false} />),
      ).toThrow('o layout "kanban" exige a prop `renderKanbanRecord`')
      expect(() =>
        render(<Outlet layout="list" withListRenderer={false} />),
      ).toThrow('o layout "list" exige a prop `renderListRecord`')
    } finally {
      console.error = originalError
    }
  })
})
