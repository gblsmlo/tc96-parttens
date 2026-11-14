import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  type KanbanCardSkeletonAnatomy,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  type KanbanViewProps,
} from '@tc96/parttens'
import { type ReactElement, useEffect, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../test-utils/sleep'
import { projectTaskColumns } from '../fixtures/kanban-tasks'
import { renderTaskKanbanCard, useTasks } from '../fixtures/task-renderers'
import { initialTasks, isStatus, type Task } from '../fixtures/tasks'

type KanbanArgs = KanbanViewProps<Task> & {
  collapsed: boolean
  hidden: boolean
}

const TasksKanban = KanbanView as (props: KanbanViewProps<Task>) => ReactElement

const hiddenControl = { table: { disable: true } } as const
const onAddCard = fn()
const LOAD_DELAY = 2000

const taskCardAnatomy: KanbanCardSkeletonAnatomy = {
  assignee: true,
  counts: 3,
  descriptionLines: 2,
  fields: 4,
  menu: true,
}

interface AnatomyCard {
  id: string
}

const anatomyColumns = ({
  collapsed,
  hidden,
}: Readonly<
  Pick<KanbanArgs, 'collapsed' | 'hidden'>
>): KanbanColumnData<AnatomyCard>[] => [
  {
    cards: [{ id: 'card-1' }, { id: 'card-2' }],
    collapsed,
    count: 2,
    id: 'first',
    title: 'Column',
  },
  {
    cards: [{ id: 'card-3' }],
    color: 'var(--chart-2)',
    count: 1,
    id: 'second',
    title: 'Column with color',
  },
  { cards: [], count: 0, hidden, id: 'third', title: 'Empty column' },
]

const usage = `
import { KanbanView } from '@acme/patterns'

<KanbanView
  columns={columns}
  getKey={(task) => task.id}
  getColumnActions={(column) => ({ onAddCard: addCard })}
  loading={isLoading}
  loadingCardAnatomy={{ menu: true, descriptionLines: 2, fields: 4, counts: 3 }}
  onMoveCard={({ card, targetColumnId }) => moveTask(card, targetColumnId)}
  renderCard={(task) => <KanbanCard>{/* KanbanCard slots */}</KanbanCard>}
/>
`

const docs = {
  api: [
    {
      description:
        'Controlled board of columns. Each `KanbanColumnData` carries its `cards`, `count`, `color`, `collapsed` and `hidden`; the consumer owns all of them. `renderCard` returns the whole card and runs in a memoized leaf. `onMoveCard` receives a drag between or inside columns and accepts or rejects it (a promise resolves the drop). While `loading`, each column renders `loadingCardCount` skeletons shaped by `loadingCardAnatomy`. Below `md` the board turns into one column at a time with a column selector.',
      name: 'KanbanView',
    },
    {
      description:
        'The card `renderCard` returns. See `Patterns/Collection/Layouts/Kanban/Card`.',
      name: 'KanbanCard',
    },
    {
      description:
        '`onAddCard` and `onOpenSettings` add buttons to a column header, named by `addLabel` and `settingsLabel`.',
      name: 'KanbanColumnActions',
    },
  ],
  description: {
    component:
      '`KanbanView` renders a collection as columns of cards. `Anatomy` shows the columns and the card slot, driven by the controls. `Usage` is the Tasks board with the same controls. `Behavior` is the usage under test: it starts loading and shows the board after a simulated delay, keeping the card height, then checks the column headers and the add action.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-16 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

function TasksBoard({
  collapsed,
  hidden,
  loading = false,
  loadingCardCount = 1,
}: Readonly<
  Pick<KanbanArgs, 'collapsed' | 'hidden' | 'loading' | 'loadingCardCount'>
>) {
  const { tasks, updateTask } = useTasks()
  const columns = projectTaskColumns(tasks).map((column) => ({
    ...column,
    collapsed: collapsed && column.id === 'backlog',
    hidden: hidden && column.id === 'done',
  }))

  return (
    <TasksKanban
      columns={columns}
      getColumnActions={() => ({ onAddCard })}
      getKey={(task) => task.id}
      loading={loading}
      loadingCardAnatomy={taskCardAnatomy}
      loadingCardCount={loadingCardCount}
      loadingCardLabel="Carregando tarefa"
      onMoveCard={({ card, targetColumnId }) => {
        if (!isStatus(targetColumnId)) return false
        updateTask(card.id, { status: targetColumnId })
        return true
      }}
      renderCard={renderTaskKanbanCard(updateTask)}
    />
  )
}

function LoadingBoard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <TasksBoard collapsed={false} hidden={false} loading={loading} />
}

const meta = {
  args: {
    collapsed: false,
    columns: projectTaskColumns(initialTasks),
    getKey: (task) => task.id,
    hidden: false,
    loading: false,
    loadingCardCount: 1,
    renderCard: renderTaskKanbanCard(() => undefined),
  },
  argTypes: {
    collapsed: { control: 'boolean' },
    columns: hiddenControl,
    getKey: hiddenControl,
    hidden: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingCardCount: { control: { max: 4, min: 1, type: 'range' } },
    renderCard: hiddenControl,
  },
  component: TasksKanban,
  decorators: [
    (Story) => (
      <div className="h-[44rem] w-6xl max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/Kanban',
} satisfies Meta<KanbanArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    if (args.loading) return
    await expect(
      canvasElement.querySelectorAll('[data-slot="kanban-column"]').length,
    ).toBeGreaterThan(0)
  },
  render: ({ collapsed, hidden, loading, loadingCardCount }) => (
    <KanbanView<AnatomyCard>
      columns={anatomyColumns({ collapsed, hidden })}
      getKey={(card) => card.id}
      loading={loading}
      {...(loadingCardCount ? { loadingCardCount } : {})}
      renderCard={() => (
        <KanbanCard>
          <div className="flex justify-center p-4">
            <KanbanCardTitle>
              <span className={slotClassName}>renderCard</span>
            </KanbanCardTitle>
          </div>
        </KanbanCard>
      )}
    />
  ),
}

export const Usage: Story = {
  render: (args) => <TasksBoard {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    collapsed: hiddenControl,
    hidden: hiddenControl,
    loading: hiddenControl,
    loadingCardCount: hiddenControl,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const board = canvasElement.querySelector<HTMLElement>(
      '[data-slot="kanban-view"]',
    )
    if (!board) throw new Error('The story did not render the board.')
    const firstTask = initialTasks.find((task) => task.status === 'backlog')

    await expect(board).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByText('Nenhum item nesta coluna.')).toBeNull()
    const firstColumn = () =>
      [
        ...board.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]'),
      ].find((column) => column.getBoundingClientRect().width > 0)
    const skeletonHeight = firstColumn()
      ?.querySelector('[data-pattern="kanban-card"]')
      ?.getBoundingClientRect().height

    await within(board).findAllByText(firstTask?.title ?? '', undefined, {
      timeout: LOAD_DELAY * 2,
    })
    await expect(board).not.toHaveAttribute('aria-busy')
    await expect(skeletonHeight).toBeGreaterThan(0)
    await expect(
      firstColumn()
        ?.querySelector('[data-pattern="kanban-card"]')
        ?.getBoundingClientRect().height,
    ).toBe(skeletonHeight)

    const column = firstColumn()
    if (!column) throw new Error('The board did not render a column.')
    const header = within(column)
    await expect(header.getByRole('heading', { name: 'Backlog' })).toBeVisible()

    onAddCard.mockClear()
    await userEvent.click(
      header.getByRole('button', { name: 'Adicionar item à seção Backlog' }),
    )
    await expect(onAddCard).toHaveBeenCalledWith('backlog')
  },
  render: () => <LoadingBoard />,
}
