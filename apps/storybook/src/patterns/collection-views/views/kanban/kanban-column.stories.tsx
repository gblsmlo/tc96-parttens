import type { Meta, StoryObj } from '@storybook/react-vite'
import { type KanbanColumnData, KanbanView } from '@tc96/parttens'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { ChevronRightIcon, EllipsisIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { renderTaskKanbanCard, useTasks } from '../../fixtures/task-renderers'
import type { Task, TaskStatus } from '../../fixtures/tasks'
import { projectTaskColumns } from './kanban-tasks'

type ColumnState = Partial<
  Pick<KanbanColumnData<Task>, 'collapsed' | 'color' | 'hidden'>
>

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
  column: KanbanColumnData<Task>
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
  const { setTasks, tasks, updateTask } = useTasks()
  const [states, setStates] = useState<Record<string, ColumnState>>({})
  const columns = useMemo(
    () =>
      projectTaskColumns(tasks).map((column) => {
        const state = states[column.id]
        return {
          ...column,
          collapsed: state?.collapsed ?? column.id === collapsedColumnId,
          color: state?.color ?? column.color,
          hidden: state?.hidden ?? column.id === hiddenColumnId,
        }
      }),
    [collapsedColumnId, hiddenColumnId, states, tasks],
  )
  const updateColumn = (
    id: string,
    update: (column: KanbanColumnData<Task>) => ColumnState,
  ) =>
    setStates((current) => {
      const column = columns.find((candidate) => candidate.id === id)
      return column ? { ...current, [id]: update(column) } : current
    })
  const addCard = (id: string) =>
    setTasks((current) => [
      ...current,
      {
        assigneeId: 'ana',
        description: 'Tarefa criada pela coluna.',
        end: null,
        estimate: 0,
        id: `TSK-${200 + current.length}`,
        priority: 'medium',
        start: '2026-10-14T15:00:00.000Z',
        status: id as TaskStatus,
        title: 'Nova tarefa',
      },
    ])

  return (
    <div className="flex h-144 min-w-0 flex-col gap-3 p-4">
      <KanbanView
        columns={columns}
        getColumnActions={() => ({ onAddCard: addCard })}
        getKey={(task) => task.id}
        renderCard={renderTaskKanbanCard(updateTask)}
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
                    ...states[current.id],
                    color,
                  }))
                }
              />
              <MenuSeparator />
              <MenuItem
                onClick={() =>
                  updateColumn(column.id, (current) => ({
                    ...states[current.id],
                    collapsed: !current.collapsed,
                  }))
                }
              >
                {column.collapsed ? 'Expandir coluna' : 'Compactar coluna'}
              </MenuItem>
              <MenuItem
                onClick={() =>
                  updateColumn(column.id, (current) => ({
                    ...states[current.id],
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
export const Collapsed: Story = { args: { collapsedColumnId: 'backlog' } }
export const Hidden: Story = { args: { hiddenColumnId: 'backlog' } }
