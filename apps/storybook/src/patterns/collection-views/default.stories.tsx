import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutGridIcon, Rows3Icon, Table2Icon } from 'lucide-react'
import { useState } from 'react'
import {
  Action,
  type CollectionDefinition,
  CollectionPagination,
  CollectionProvider,
  CollectionToolbar,
  type CollectionViewMode,
  CollectionViewOutlet,
  type DataGridColumnDef,
  KanbanCard,
  KanbanCardHeader,
  KanbanCardTitle,
  ListItem,
  ListItemBody,
  ListItemTitle,
  ListItemTitleTrigger,
  PresetsMenu,
  useCollectionPreferences,
  useDataGrid,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'

interface WorkItem {
  id: string
  status: string
  title: string
}

const items: WorkItem[] = [
  { id: 'item-1', status: 'todo', title: 'Prepare the first draft' },
  { id: 'item-2', status: 'doing', title: 'Review the open questions' },
  { id: 'item-3', status: 'done', title: 'Confirm the shared structure' },
  { id: 'item-4', status: 'todo', title: 'Collect feedback from the team' },
  { id: 'item-5', status: 'doing', title: 'Update the project timeline' },
  { id: 'item-6', status: 'done', title: 'Publish the project notes' },
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

const pageSize = 3
const viewModes: readonly ViewSettingsMode<CollectionViewMode>[] = [
  { value: 'list', label: 'Lista', icon: Rows3Icon },
  { value: 'kanban', label: 'Kanban', icon: LayoutGridIcon },
  { value: 'datagrid', label: 'Tabela', icon: Table2Icon },
]

function CollectionViewsDefault() {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [page, setPage] = useState(1)
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize)
  const visibleCollection = { ...collection, items: visibleItems }
  const { table } = useDataGrid({
    columns,
    data: visibleItems,
    getRowId: (item) => item.id,
  })

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="font-semibold text-2xl">Tasks</h1>
          <p className="text-muted-foreground text-sm">
            All work items in one collection.
          </p>
        </div>
        <CollectionToolbar
          aria-label="Task collection toolbar"
          endSlot={
            <>
              <ViewSettingsMenu
                mode={preferences.view}
                modes={viewModes}
                onClearFilters={() => undefined}
                onModeChange={(view) =>
                  setPreferences((current) => ({ ...current, view }), 'view')
                }
              >
                <ViewSettingsSection label="Exibição">
                  <MenuSub>
                    <MenuSubTrigger>
                      <Rows3Icon aria-hidden="true" />
                      Group by
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuRadioGroup
                        onValueChange={(groupBy) =>
                          setPreferences(
                            (current) => ({ ...current, groupBy }),
                            'grouping',
                          )
                        }
                        value={preferences.groupBy ?? ''}
                      >
                        <MenuRadioItem value="status">Status</MenuRadioItem>
                      </MenuRadioGroup>
                    </MenuSubPopup>
                  </MenuSub>
                </ViewSettingsSection>
                <MenuSeparator />
                <ViewSettingsSection label="Filtros">
                  <MenuGroup>
                    <MenuGroupLabel>No filters</MenuGroupLabel>
                    <MenuItem disabled>
                      Configure filters for this collection
                    </MenuItem>
                  </MenuGroup>
                </ViewSettingsSection>
              </ViewSettingsMenu>
              <Action label="New task" onClick={() => undefined} />
            </>
          }
          startSlot={
            <PresetsMenu
              count={items.length}
              countLabel="6 tasks"
              label="All tasks"
            >
              <MenuGroup>
                <MenuGroupLabel>Saved views</MenuGroupLabel>
                <MenuItem>All tasks</MenuItem>
                <MenuItem>My tasks</MenuItem>
                <MenuItem>Completed</MenuItem>
              </MenuGroup>
            </PresetsMenu>
          }
          variant="plain"
        />
      </header>

      <section aria-label="Collection view" className="min-h-0 flex-1">
        <CollectionViewOutlet
          collection={visibleCollection}
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
      </section>

      <CollectionPagination
        label="Task collection pagination"
        onPageChange={setPage}
        page={page}
        pageCount={Math.ceil(items.length / pageSize)}
        pageSize={pageSize}
        total={items.length}
      />
    </main>
  )
}

function CollectionViewsComposition() {
  return (
    <CollectionProvider
      collection={collection}
      defaultPreferences={{ groupBy: 'status', view: 'list' }}
    >
      <CollectionViewsDefault />
    </CollectionProvider>
  )
}

const meta = {
  component: CollectionViewsComposition,
  parameters: {
    docs: {
      description: {
        component:
          'Tela padrão de uma collection com topbar, alternância entre List, Kanban e Data Grid e paginação controlada compartilhando o mesmo recorte de itens.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Default',
} satisfies Meta<typeof CollectionViewsComposition>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
