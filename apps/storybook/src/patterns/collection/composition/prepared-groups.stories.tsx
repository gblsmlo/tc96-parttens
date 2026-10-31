import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionGroup,
  CollectionLayoutOutlet,
  CollectionProvider,
  ListView,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

interface Item {
  id: string
  title: string
}

const collection = {
  records: [{ id: 'ignored', title: 'Ignored source item' }],
  getKey: (record: Item) => record.id,
  getLabel: (record: Item) => record.title,
  groupings: [],
}

const groups: CollectionGroup<Item>[] = [
  {
    count: 900,
    grouping: 'external',
    id: 'stable-id',
    label: 'Prepared group',
    records: [{ id: 'prepared', title: 'Prepared item' }],
    value: 'external',
  },
  {
    count: 0,
    grouping: 'external',
    id: 'empty-id',
    label: 'Empty prepared group',
    records: [],
    value: null,
  },
]

const UNDECLARED_GROUPING = 'undeclared'

const renderItem = (record: Item) => <span>{record.title}</span>

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Composition/Prepared Groups',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ListViewWithPreparedGroups: Story = {
  render: () => (
    <ListView
      collection={collection}
      grouping={UNDECLARED_GROUPING}
      groups={groups}
      renderRecord={renderItem}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Prepared item')).toBeInTheDocument()
    await expect(canvas.getByText('900')).toBeInTheDocument()
    await expect(canvas.getByText('Empty prepared group')).toBeInTheDocument()
    await expect(canvas.queryByText('Ignored source item')).toBeNull()
  },
}

export const ExplicitEmptyGroupsNeverFallBack: Story = {
  render: () => (
    <ListView
      collection={collection}
      grouping={null}
      groups={[]}
      renderRecord={renderItem}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText('Ignored source item'),
    ).toBeNull()
  },
}

export const OutletListUsesPreparedGroups: Story = {
  render: () => (
    <CollectionProvider
      collection={collection}
      preferences={{ groupBy: null, layout: 'list' }}
    >
      <CollectionLayoutOutlet
        collection={collection}
        groups={groups}
        renderKanbanRecord={renderItem}
        renderListRecord={renderItem}
      />
    </CollectionProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Prepared item')).toBeInTheDocument()
    await expect(canvas.queryByText('Ignored source item')).toBeNull()
  },
}

export const OutletKanbanUsesPreparedGroups: Story = {
  render: () => (
    <CollectionProvider
      collection={collection}
      preferences={{ groupBy: null, layout: 'kanban' }}
    >
      <CollectionLayoutOutlet
        collection={collection}
        groups={groups}
        renderKanbanRecord={renderItem}
        renderListRecord={renderItem}
      />
    </CollectionProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText('Prepared item').length).toBeGreaterThan(0)
    await expect(canvas.queryByText('Ignored source item')).toBeNull()
  },
}

export const OutletListEmptyMessage: Story = {
  render: () => {
    const emptyCollection = { ...collection, records: [] as Item[] }

    return (
      <CollectionProvider
        collection={emptyCollection}
        preferences={{ groupBy: null, layout: 'list' }}
      >
        <CollectionLayoutOutlet
          collection={emptyCollection}
          list={{ emptyMessage: 'Nothing here yet.' }}
          renderKanbanRecord={renderItem}
          renderListRecord={renderItem}
        />
      </CollectionProvider>
    )
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nothing here yet.'),
    ).toBeInTheDocument()
  },
}
