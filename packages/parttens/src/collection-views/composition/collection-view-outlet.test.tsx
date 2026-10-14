import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ReactElement } from 'react'
import type { CollectionDataTableViewProps } from './collection-view-outlet'

await import('../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { CollectionProvider } = await import('../store/collection-provider')
const { CollectionViewOutlet } = await import('./collection-view-outlet')
const { useDataTable } = await import('../views/data-table/use-data-table')

afterEach(cleanup)

interface Item {
  id: string
  title: string
}

const collection = {
  getKey: (item: Item) => item.id,
  getLabel: (item: Item) => item.title,
  groupings: [],
  items: [{ id: 'a', title: 'Primeiro item' }],
}

type OutletProps = Omit<
  Parameters<typeof CollectionViewOutlet<Item>>[0],
  'collection' | 'renderGalleryItem' | 'renderKanbanItem' | 'renderListItem'
>

function Outlet({
  onRowClick,
  view,
  withGalleryRenderer = true,
  withKanbanRenderer = true,
  withListRenderer = true,
  withTable = false,
  ...props
}: Readonly<
  OutletProps & {
    onRowClick?: CollectionDataTableViewProps<Item>['onRowClick']
    view: 'calendar' | 'datatable' | 'gallery' | 'kanban' | 'list'
    withGalleryRenderer?: boolean
    withKanbanRenderer?: boolean
    withListRenderer?: boolean
    withTable?: boolean
  }
>): ReactElement {
  const { table } = useDataTable<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: collection.items,
    getRowId: (item) => item.id,
  })

  return (
    <CollectionProvider
      collection={collection}
      defaultPreferences={{ groupBy: null, view }}
    >
      <CollectionViewOutlet
        collection={collection}
        {...(withGalleryRenderer
          ? { renderGalleryItem: (item: Item) => item.title }
          : {})}
        {...(withKanbanRenderer
          ? { renderKanbanItem: (item: Item) => item.title }
          : {})}
        {...(withListRenderer
          ? { renderListItem: (item: Item) => item.title }
          : {})}
        {...(withTable
          ? { datatable: { 'aria-label': 'Itens', onRowClick, table } }
          : {})}
        {...props}
      />
    </CollectionProvider>
  )
}

describe('CollectionViewOutlet', () => {
  test('renders the GalleryView for the gallery view', () => {
    const { container } = render(<Outlet view="gallery" />)

    expect(container.querySelector('[data-slot="gallery-view"]')).toBeTruthy()
    expect(screen.getByText('Primeiro item')).toBeTruthy()
  })

  test('renders the DataTable for the datatable view', () => {
    render(<Outlet view="datatable" withTable />)

    expect(screen.getByRole('table', { name: 'Itens' })).toBeTruthy()
    expect(screen.getByText('Primeiro item')).toBeTruthy()
  })

  test('renders a view that is not the list without renderListItem', () => {
    render(<Outlet view="datatable" withListRenderer={false} withTable />)

    expect(screen.getByRole('table', { name: 'Itens' })).toBeTruthy()
  })

  test('forwards datatable.onRowClick to the row trigger', () => {
    const onRowClick = mock()
    render(<Outlet onRowClick={onRowClick} view="datatable" withTable />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir registro' }))

    expect(onRowClick).toHaveBeenCalledTimes(1)
    expect(onRowClick.mock.calls[0][0].id).toBe('a')
  })

  test('requires the props of the views that need consumer configuration', () => {
    const originalError = console.error
    console.error = () => undefined
    try {
      expect(() => render(<Outlet view="datatable" />)).toThrow(
        'a view "datatable" exige a prop `datatable`',
      )
      expect(() => render(<Outlet view="calendar" />)).toThrow(
        'a view "calendar" exige a prop `calendar`',
      )
      expect(() =>
        render(<Outlet view="gallery" withGalleryRenderer={false} />),
      ).toThrow('a view "gallery" exige a prop `renderGalleryItem`')
      expect(() =>
        render(<Outlet view="kanban" withKanbanRenderer={false} />),
      ).toThrow('a view "kanban" exige a prop `renderKanbanItem`')
      expect(() =>
        render(<Outlet view="list" withListRenderer={false} />),
      ).toThrow('a view "list" exige a prop `renderListItem`')
    } finally {
      console.error = originalError
    }
  })
})
