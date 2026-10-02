import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  KanbanCard,
  KanbanCardHeader,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { ChevronRightIcon, EllipsisIcon } from 'lucide-react'
import { useState } from 'react'

interface ExampleCard {
  id: string
  title: string
}

const initialColumns: KanbanColumnData<ExampleCard>[] = [
  {
    cards: [{ id: 'lead-1', title: 'Review the proposal' }],
    color: '#ef4444',
    count: 1,
    id: 'lost',
    title: 'Lost',
  },
  {
    cards: [{ id: 'lead-2', title: 'Prepare a follow-up' }],
    color: '#3b82f6',
    count: 1,
    id: 'active',
    title: 'Active',
  },
  { cards: [], color: '#22c55e', count: 0, id: 'done', title: 'Done' },
]

const colors = [
  { label: 'Vermelho', value: '#ef4444' },
  { label: 'Laranja', value: '#f97316' },
  { label: 'Âmbar', value: '#f59e0b' },
  { label: 'Lima', value: '#84cc16' },
  { label: 'Verde', value: '#22c55e' },
  { label: 'Ciano', value: '#06b6d4' },
  { label: 'Azul', value: '#3b82f6' },
  { label: 'Roxo', value: '#a855f7' },
  { label: 'Violeta', value: '#8b5cf6' },
  { label: 'Rosa', value: '#ec4899' },
  { label: 'Amarelo', value: '#eab308' },
  { label: 'Cinza', value: '#6b7280' },
] as const

function ColumnColorPopover({
  column,
  onChange,
}: Readonly<{
  column: KanbanColumnData<ExampleCard>
  onChange: (color: string) => void
}>) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <MenuItem
            className="grid-cols-[1fr_auto] gap-3"
            closeOnClick={false}
          />
        }
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-full"
            style={{ backgroundColor: column.color ?? 'var(--card)' }}
          />
          Cor
        </span>
        <ChevronRightIcon aria-hidden="true" className="size-4" />
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        aria-label={`Cores da coluna ${column.title}`}
        className="w-40"
        side="right"
      >
        <div className="grid grid-cols-4 gap-1.5 p-1">
          {colors.map((color) => (
            <button
              aria-label={`Cor ${color.label}`}
              aria-pressed={column.color === color.value}
              className="size-7 rounded-md outline-none ring-offset-2 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-ring"
              key={color.value}
              onClick={() => onChange(color.value)}
              style={{ backgroundColor: color.value }}
              title={color.label}
              type="button"
            />
          ))}
        </div>
      </PopoverPopup>
    </Popover>
  )
}

function ColumnExample({
  collapsedColumnId,
  hiddenColumnId,
}: {
  collapsedColumnId?: string
  hiddenColumnId?: string
}) {
  const [columns, setColumns] = useState((): KanbanColumnData<ExampleCard>[] =>
    initialColumns.map((column) => ({
      ...column,
      cards: [...column.cards],
      collapsed: column.id === collapsedColumnId,
      hidden: column.id === hiddenColumnId,
    })),
  )
  const hiddenCount = columns.filter((column) => column.hidden).length
  const updateColumn = (
    id: string,
    update: (
      column: KanbanColumnData<ExampleCard>,
    ) => KanbanColumnData<ExampleCard>,
  ) =>
    setColumns((current) =>
      current.map((column) => (column.id === id ? update(column) : column)),
    )
  const addCard = (id: string) =>
    updateColumn(id, (column) => {
      const next = column.cards.length + 1
      return {
        ...column,
        cards: [
          ...column.cards,
          { id: `${id}-${next}`, title: `New card ${next}` },
        ],
        count: column.count + 1,
      }
    })

  return (
    <div className="flex h-144 min-w-0 flex-col gap-3 p-4">
      <CollectionToolbar
        aria-label="Ações da coleção"
        endSlot={
          <ViewSettingsMenu
            activeFilterCount={hiddenCount}
            clearLabel="Restaurar colunas"
            onClearFilters={() =>
              setColumns((current) =>
                current.map((column) => ({ ...column, hidden: false })),
              )
            }
          >
            <ViewSettingsSection label="Colunas">
              {columns.map((column) => (
                <MenuCheckboxItem
                  checked={!column.hidden}
                  key={column.id}
                  onCheckedChange={(checked) =>
                    updateColumn(column.id, (current) => ({
                      ...current,
                      hidden: !checked,
                    }))
                  }
                >
                  {column.title}
                </MenuCheckboxItem>
              ))}
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
      <KanbanView
        columns={columns}
        getColumnActions={() => ({ onAddCard: addCard })}
        getKey={(card) => card.id}
        renderCard={(card) => (
          <KanbanCard>
            <KanbanCardHeader>
              <KanbanCardTitle>{card.title}</KanbanCardTitle>
            </KanbanCardHeader>
          </KanbanCard>
        )}
        renderHeaderActions={(column) => (
          <Menu>
            <MenuTrigger
              render={
                <button
                  aria-label={`Configurar coluna ${column.title}`}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                  type="button"
                />
              }
            >
              <EllipsisIcon aria-hidden="true" className="size-4" />
            </MenuTrigger>
            <MenuPopup align="end" className="w-44">
              <ColumnColorPopover
                column={column}
                onChange={(color) =>
                  updateColumn(column.id, (current) => ({
                    ...current,
                    color,
                  }))
                }
              />
              <MenuSeparator />
              <MenuItem
                onClick={() =>
                  updateColumn(column.id, (current) => ({
                    ...current,
                    collapsed: !current.collapsed,
                  }))
                }
              >
                {column.collapsed ? 'Expandir coluna' : 'Compactar coluna'}
              </MenuItem>
              <MenuItem
                onClick={() =>
                  updateColumn(column.id, (current) => ({
                    ...current,
                    hidden: true,
                  }))
                }
              >
                Ocultar coluna
              </MenuItem>
            </MenuPopup>
          </Menu>
        )}
      />
    </div>
  )
}

const meta = {
  component: ColumnExample,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Column',
} satisfies Meta<typeof ColumnExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
export const Collapsed: Story = { args: { collapsedColumnId: 'lost' } }
export const Hidden: Story = { args: { hiddenColumnId: 'lost' } }
