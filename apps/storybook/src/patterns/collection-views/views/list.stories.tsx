import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionGroupingId,
  type ListItemDensity,
  ListView,
  type ListViewProps,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'
import { renderTaskListRow, useTasks } from '../fixtures/task-renderers'
import { createCollection, initialTasks, type Task } from '../fixtures/tasks'

const TasksListView = ListView as (props: ListViewProps<Task>) => ReactElement

const listArgs = {
  collection: createCollection(initialTasks),
  grouping: 'status' as const,
  renderItem: renderTaskListRow(() => undefined),
}

const openTask = fn()

function Example({
  collapseEmptyGroups = false,
  density = 'comfortable',
  empty = false,
  emptyGroup = false,
  groupBy = 'status',
  loading = false,
  onOpenTask,
  separated = false,
}: Readonly<{
  collapseEmptyGroups?: boolean
  density?: ListItemDensity
  empty?: boolean
  emptyGroup?: boolean
  groupBy?: CollectionGroupingId | null
  loading?: boolean
  onOpenTask?: (task: Task) => void
  separated?: boolean
}>) {
  const { tasks, updateTask } = useTasks()
  const visibleTasks = emptyGroup ? tasks.slice(0, 1) : tasks

  return (
    <div className="min-w-0 p-4">
      <TasksListView
        collapseEmptyGroups={collapseEmptyGroups}
        collection={createCollection(loading || empty ? [] : visibleTasks)}
        emptyGroupLabel="Nenhuma tarefa neste grupo."
        emptyMessage="Nenhuma tarefa para exibir."
        grouping={groupBy}
        loading={loading}
        loadingItemLabel="Carregando tarefa"
        renderGroupTitle={(group) => group.label}
        renderItem={renderTaskListRow(updateTask, density, onOpenTask)}
        separated={separated}
      />
    </div>
  )
}

const meta = {
  args: listArgs,
  argTypes: { collapseEmptyGroups: booleanArgType, loading: booleanArgType },
  component: TasksListView,
  parameters: {
    docs: {
      description: {
        component:
          'List building block. Documents grouping, loading and composition without fixtures or Tasks and Pipeline rules.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/List',
} satisfies Meta<typeof TasksListView>

export default meta

type Story = StoryObj<typeof meta>

export const GroupedByStatus: Story = {
  args: listArgs,
  play: async ({ canvasElement }) => {
    const contagem = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-group-count"]',
    )

    if (!contagem)
      throw new Error('A story não renderizou [data-slot="list-group-count"].')

    const medida = contagem.getBoundingClientRect()

    await expect(medida.width).toBe(medida.height)
    await expect(
      Number.parseFloat(getComputedStyle(contagem).borderRadius),
    ).toBeGreaterThan(medida.height / 2)

    const corpo = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-item-body"]',
    )

    await expect(getComputedStyle(corpo as HTMLElement).flexGrow).toBe('1')
  },
  render: () => <Example />,
}
export const GroupedByAssignee: Story = {
  args: listArgs,
  render: () => <Example groupBy="assignee" />,
}

export const Ungrouped: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Without a dimension (`grouping={null}`), the List reads the collection in the order the consumer passed: no header, no collapse, no per-group count.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="list-group"]'),
    ).toBeNull()

    const [first, second] = Array.from(
      canvasElement
        .querySelector('[data-slot="list-item-field"]')
        ?.querySelectorAll('button') ?? [],
    )

    if (!(first && second))
      throw new Error('A primeira linha não renderizou dois campos.')

    const left = first.getBoundingClientRect()
    const right = second.getBoundingClientRect()
    const y = left.top + left.height / 2
    const gapX = (left.right + right.left) / 2

    await expect(right.left).toBeGreaterThan(left.right)
    await expect(
      document
        .elementFromPoint(gapX, y)
        ?.closest('[data-slot="list-item-title-trigger"]'),
    ).not.toBeNull()

    const onField = document.elementFromPoint(left.left + left.width / 2, y)

    await expect(onField).not.toBeNull()
    await expect(
      onField?.closest('[data-slot="list-item-title-trigger"]'),
    ).toBeNull()
    await expect(first.contains(onField)).toBe(true)

    openTask.mockClear()
    await userEvent.click(document.elementFromPoint(gapX, y) as Element)
    await expect(openTask).toHaveBeenCalledTimes(1)
    await expect(openTask).toHaveBeenCalledWith(initialTasks[0])

    await userEvent.click(onField as Element)
    await expect(openTask).toHaveBeenCalledTimes(1)
    await userEvent.keyboard('{Escape}')

    await expect(
      canvasElement.querySelectorAll('[data-slot="list-item"]'),
    ).toHaveLength(initialTasks.length)
  },
  render: () => <Example groupBy={null} onOpenTask={openTask} />,
}
export const Loading: Story = {
  args: listArgs,
  render: () => <Example loading />,
}

export const EmptyUngrouped: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Without a dimension, an empty collection renders `emptyMessage` in the same `Empty` block an empty group uses. It stays hidden while `loading`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma tarefa para exibir.'),
    ).toBeInTheDocument()
    await expect(
      canvasElement.querySelector('[data-slot="list-item"]'),
    ).toBeNull()
  },
  render: () => <Example empty groupBy={null} />,
}

export const EmptyGroupsCollapsed: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'With `collapseEmptyGroups`, a group with no items starts closed and the populated one stays open. Opening or closing manually wins over the automatic behavior, and an untouched group reopens on its own when it receives an item.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[aria-label="Collapse Em andamento"]'),
    ).toBeTruthy()
    await expect(
      canvasElement.querySelector('[aria-label="Expand A fazer"]'),
    ).toBeTruthy()
  },
  render: () => <Example collapseEmptyGroups emptyGroup />,
}

export const Compact: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Compact density: the vertical rhythm belongs to the pattern, so the list tightens without the consumer overriding padding.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-item"]',
    )

    if (!row) throw new Error('A story não renderizou [data-slot="list-item"].')

    await expect(row.dataset.density).toBe('compact')
    await expect(
      Number.parseFloat(getComputedStyle(row).paddingTop),
    ).toBeLessThan(6)
  },
  render: () => <Example density="compact" />,
}

export const Separated: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'With `separated`, a subtle `Separator` appears between rows, in the flat list and inside each group, without inheriting the container border.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="separator"]').length,
    ).toBeGreaterThan(0)
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-item-title-trigger"]'),
    ).toHaveLength(initialTasks.length)
  },
  render: () => <Example groupBy={null} separated />,
}
