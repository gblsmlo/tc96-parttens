import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { CollectionProvider } = await import('../store/collection-provider')
const { CollectionLayoutOutlet } = await import('./collection-layout-outlet')

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

function Outlet({
  layout,
  withGalleryRenderer = true,
  withKanbanRenderer = true,
  withListRenderer = true,
}: Readonly<{
  layout: 'calendar' | 'datatable' | 'gallery' | 'kanban' | 'list'
  withGalleryRenderer?: boolean
  withKanbanRenderer?: boolean
  withListRenderer?: boolean
}>): ReactElement {
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
      />
    </CollectionProvider>
  )
}

describe('CollectionLayoutOutlet', () => {
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
