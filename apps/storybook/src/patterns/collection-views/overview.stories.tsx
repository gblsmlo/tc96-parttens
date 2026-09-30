import {
  CollectionProvider,
  CollectionViewOutlet,
  type DataGridColumnDef,
  KanbanCard,
  KanbanCardHeader,
  KanbanCardTitle,
  ListItem,
  ListItemBody,
  ListItemTitle,
  ListItemTitleTrigger,
  type CollectionDefinition,
  type CollectionViewMode,
  useCollectionPreferences,
  useDataGrid,
} from 'tc96/blocks'
import type { Meta, StoryObj } from '@storybook/react-vite'

interface WorkItem {
  id: string
  status: string
  title: string
}

const items: WorkItem[] = [
  { id: 'item-1', status: 'todo', title: 'Prepare the first draft' },
  { id: 'item-2', status: 'doing', title: 'Review the open questions' },
  { id: 'item-3', status: 'done', title: 'Confirm the shared structure' },
]

const collection: CollectionDefinition<WorkItem> = {
  getKey: (item) => item.id,
  getLabel: (item) => item.title,
  groupings: [
    {
      getGroupId: (item) => item.status,
      id: 'status',
      label: 'Status',
      options: [
        { id: 'todo', label: 'To do' },
        { id: 'doing', label: 'In progress' },
        { id: 'done', label: 'Done' },
      ],
    },
  ],
  items,
}

const columns: DataGridColumnDef<WorkItem>[] = [
  {
    accessorKey: 'title',
    header: 'Item',
    meta: { label: 'Item', type: 'text' },
    minSize: 240,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status', type: 'text' },
    minSize: 160,
  },
]

function CollectionViewsOverview() {
  const { preferences, setPreferences } = useCollectionPreferences()
  const { table } = useDataGrid({
    columns,
    data: items,
    getRowId: (item) => item.id,
  })
  const modes: { id: CollectionViewMode; label: string }[] = [
    { id: 'list', label: 'List' },
    { id: 'kanban', label: 'Kanban' },
    { id: 'datagrid', label: 'Data grid' },
  ]

  return (
    <div className="flex flex-col gap-4 p-6">
      <div
        className="flex flex-wrap gap-2"
        aria-label="Choose a collection view"
      >
        {modes.map((mode) => (
          <button
            aria-pressed={preferences.view === mode.id}
            className="rounded-md border px-3 py-1.5 text-sm"
            key={mode.id}
            onClick={() =>
              setPreferences(
                (current) => ({ ...current, view: mode.id }),
                'view',
              )
            }
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
      <CollectionViewOutlet
        collection={collection}
        datagrid={{ table, 'aria-label': 'Work items' }}
        renderKanbanItem={(item) => (
          <KanbanCard key={item.id} variant="interactive">
            <KanbanCardHeader>
              <KanbanCardTitle>{item.title}</KanbanCardTitle>
            </KanbanCardHeader>
          </KanbanCard>
        )}
        renderListItem={(item) => (
          <ListItem key={item.id}>
            <ListItemBody>
              <ListItemTitle>
                <ListItemTitleTrigger>{item.title}</ListItemTitleTrigger>
              </ListItemTitle>
            </ListItemBody>
          </ListItem>
        )}
      />
    </div>
  )
}

function CollectionViewsComposition() {
  return (
    <CollectionProvider
      collection={collection}
      defaultPreferences={{ groupBy: 'status', view: 'list' }}
    >
      <CollectionViewsOverview />
    </CollectionProvider>
  )
}

const meta = {
  component: CollectionViewsComposition,
  parameters: {
    docs: {
      description: {
        component:
          'Visão composta da mesma coleção em List, Kanban e Data Grid. Use as stories de cada view para explorar seus contratos e estados isolados.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/Collection Views/Overview',
} satisfies Meta<typeof CollectionViewsComposition>

export default meta
type Story = StoryObj<typeof meta>
export const SharedCollection: Story = {}
