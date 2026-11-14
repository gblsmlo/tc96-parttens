import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionDefinition,
  ListRow,
  ListRowBody,
  type ListRowDensity,
  ListRowTitle,
  ListView,
  type ListViewProps,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { renderTaskListRow, useTasks } from '../fixtures/task-renderers'
import { createCollection, initialTasks, type Task } from '../fixtures/tasks'

type ListArgs = ListViewProps<Task> & {
  density: ListRowDensity
  empty: boolean
}

const TasksListView = ListView as (props: ListViewProps<Task>) => ReactElement

const hidden = { table: { disable: true } } as const

interface AnatomyRecord {
  group: string
  id: string
}

const anatomyCollection = (
  records: readonly AnatomyRecord[],
): CollectionDefinition<AnatomyRecord> => ({
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [
    {
      getGroupId: (record) => record.group,
      id: 'status',
      label: 'Group',
      options: [
        { id: 'first', label: 'Group' },
        { id: 'second', label: 'Empty group' },
      ],
    },
  ],
  records: [...records],
})

const anatomyRecords: readonly AnatomyRecord[] = [
  { group: 'first', id: 'record-1' },
  { group: 'first', id: 'record-2' },
]

const openTask = fn()
const onCollapsedGroupIdsChange = fn()

const usage = `
import { ListRow, ListView } from '@acme/patterns'

<ListView
  collection={collection}
  grouping="status"
  collapseEmptyGroups
  loading={isLoading}
  loadingRecordAnatomy={{ media: 'icon', pills: 4 }}
  getGroupActions={(group) => ({ onAddRecord: addRecord })}
  renderRecord={(task) => <ListRow>{/* ListRow slots */}</ListRow>}
/>
`

const docs = {
  api: [
    {
      description:
        'Controlled list of a collection. `grouping` names a dimension of `collection.groupings`, and `null` reads the records flat, in the order the consumer passed. Group collapse is its only state, uncontrolled or controlled through `collapsedGroupIds`. `renderRecord` runs in a memoized leaf: it re-runs only when its identity or the record changes.',
      name: 'ListView',
    },
    {
      description:
        'One collapsible group: header with the title, the count and the optional add action, then its rows. `ListView` renders it for each group; `getGroupActions` gives the add action.',
      name: 'ListGroup',
    },
    {
      description:
        'The row `renderRecord` returns. See `Patterns/Collection/Layouts/List/Row`.',
      name: 'ListRow',
    },
  ],
  description: {
    component:
      '`ListView` renders a collection as a flat list or as collapsible groups. `Anatomy` shows the groups and the record slots, driven by the controls. `Usage` is the Tasks list with the same controls. `Behavior` is the usage under test: the loading groups, the group count, `collapseEmptyGroups` (an empty group starts closed, every group stays open while loading, an untouched group reopens when a task moves into it), `onCollapsedGroupIdsChange`, collapse and the click contract of a row.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-16 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

const tasksWithoutInProgress = initialTasks.filter(
  (task) => task.status !== 'in-progress',
)

function TasksList({
  collapseEmptyGroups = false,
  density,
  empty,
  grouping,
  loading = false,
  onCollapsedGroupIdsChange,
  separated = false,
  startingTasks = initialTasks,
}: Readonly<
  Omit<ListArgs, 'collection' | 'renderRecord'> & {
    startingTasks?: readonly Task[]
  }
>) {
  const { tasks, updateTask } = useTasks(startingTasks)

  return (
    <ListView<Task>
      collapseEmptyGroups={collapseEmptyGroups}
      collection={createCollection(loading || empty ? [] : tasks)}
      emptyGroupLabel="Nenhuma tarefa neste grupo."
      emptyMessage="Nenhuma tarefa para exibir."
      grouping={grouping}
      loading={loading}
      loadingRecordAnatomy={{ media: 'icon', pills: 4 }}
      loadingRecordLabel="Carregando tarefa"
      {...(onCollapsedGroupIdsChange ? { onCollapsedGroupIdsChange } : {})}
      renderGroupTitle={(group) => group.label}
      renderRecord={renderTaskListRow(updateTask, density, openTask)}
      separated={separated}
    />
  )
}

const meta = {
  args: {
    collapseEmptyGroups: false,
    collection: createCollection(initialTasks),
    density: 'comfortable',
    empty: false,
    grouping: 'status',
    loading: false,
    renderRecord: renderTaskListRow(() => undefined),
    separated: false,
  },
  argTypes: {
    collapseEmptyGroups: { control: 'boolean' },
    collection: hidden,
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    empty: { control: 'boolean' },
    grouping: {
      control: 'inline-radio',
      mapping: { none: null },
      options: ['status', 'assignee', 'none'],
    },
    loading: { control: 'boolean' },
    renderRecord: hidden,
    separated: { control: 'boolean' },
  },
  component: TasksListView,
  decorators: [
    (Story) => (
      <div className="w-5xl max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/List',
} satisfies Meta<ListArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  argTypes: {
    density: hidden,
    grouping: {
      control: 'inline-radio',
      mapping: { none: null },
      options: ['status', 'none'],
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-group"]'),
    ).toHaveLength(2)
    await expect(
      canvasElement.querySelector('[data-slot="list-group-header"]'),
    ).not.toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="list-group-count"]'),
    ).not.toBeNull()
  },
  render: ({ collapseEmptyGroups, empty, grouping, loading, separated }) => (
    <ListView<AnatomyRecord>
      collapseEmptyGroups={collapseEmptyGroups}
      collection={anatomyCollection(loading || empty ? [] : anatomyRecords)}
      emptyGroupLabel={<span className={slotClassName}>Empty group</span>}
      emptyMessage={<span className={slotClassName}>Empty message</span>}
      grouping={grouping === null ? null : 'status'}
      loading={loading}
      loadingRecordAnatomy={{
        action: false,
        lines: 1,
        media: 'none',
        pills: 0,
      }}
      renderGroupTitle={(group) => (
        <span className={slotClassName}>{group.label}</span>
      )}
      renderRecord={() => (
        <ListRow interactive={false}>
          <ListRowBody>
            <ListRowTitle>
              <span className={slotClassName}>renderRecord</span>
            </ListRowTitle>
          </ListRowBody>
        </ListRow>
      )}
      separated={separated}
    />
  ),
}

export const Usage: Story = {
  render: (args) => <TasksList {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    collapseEmptyGroups: hidden,
    empty: hidden,
    grouping: hidden,
    loading: hidden,
  },
  play: async ({ canvasElement }) => {
    const [loadingView, loadedView] = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="list-view"]'),
    ]
    if (!(loadingView && loadedView))
      throw new Error('The story did not render both lists.')
    const loading = within(loadingView)
    const loaded = within(loadedView)

    await expect(loadingView).toHaveAttribute('aria-busy', 'true')
    await expect(
      loading.getAllByRole('status', { name: 'Carregando tarefa' }),
    ).toHaveLength(
      loadingView.querySelectorAll('[data-slot="list-group"]').length,
    )
    await expect(loading.queryByText('Nenhuma tarefa neste grupo.')).toBeNull()
    await expect(
      loading.queryAllByRole('button', { name: /^Expand / }),
    ).toHaveLength(0)

    await expect(
      loaded.getByRole('button', { name: 'Expand Em andamento' }),
    ).toBeVisible()
    await expect(
      loaded.getByRole('button', { name: 'Collapse A fazer' }),
    ).toBeVisible()

    const [status] = within(
      loaded.getByRole('region', { name: 'A fazer' }),
    ).getAllByRole('combobox', { name: /^Status/ })
    if (!status) throw new Error('The A fazer group did not render a task.')
    await userEvent.click(status)
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole('option', {
        name: 'Em andamento',
      }),
    )
    await loaded.findByRole('button', { name: 'Collapse Em andamento' })

    onCollapsedGroupIdsChange.mockClear()
    await userEvent.click(
      loaded.getByRole('button', { name: 'Collapse Em andamento' }),
    )
    await expect(onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:in-progress',
    ])
    await userEvent.click(
      await loaded.findByRole('button', { name: 'Expand Em andamento' }),
    )
    await expect(onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([])

    const count = loadedView.querySelector<HTMLElement>(
      '[data-slot="list-group-count"]',
    )
    if (!count) throw new Error('The story did not render a group count.')
    const box = count.getBoundingClientRect()
    await expect(box.width).toBe(box.height)

    const [collapse] = loaded.getAllByRole('button', { name: /^Collapse / })
    if (!collapse) throw new Error('The story did not render an open group.')
    const label = collapse.getAttribute('aria-label')?.replace('Collapse ', '')
    await userEvent.click(collapse)
    const expand = await loaded.findByRole('button', {
      name: `Expand ${label}`,
    })
    await userEvent.click(expand)
    await loaded.findByRole('button', { name: `Collapse ${label}` })

    const field = loadedView.querySelector('[data-slot="list-row-field"]')
    const [first, second] = [...(field?.querySelectorAll('button') ?? [])]
    if (!(first && second))
      throw new Error('The first row did not render two field controls.')
    const left = first.getBoundingClientRect()
    const right = second.getBoundingClientRect()
    const y = left.top + left.height / 2
    const gap = canvasElement.ownerDocument.elementFromPoint(
      (left.right + right.left) / 2,
      y,
    )
    if (!gap) throw new Error('Nothing is rendered between the fields.')

    openTask.mockClear()
    await userEvent.click(gap)
    await expect(openTask).toHaveBeenCalledTimes(1)
    const title = field
      ?.closest('[data-slot="list-row"]')
      ?.querySelector('[data-slot="list-row-title"]')?.textContent
    await expect(openTask.mock.calls[0]?.[0]?.title).toBe(title)

    await userEvent.click(first)
    await expect(openTask).toHaveBeenCalledTimes(1)
    await userEvent.keyboard('{Escape}')
  },
  render: (args) => (
    <div className="grid gap-4">
      <TasksList
        {...args}
        collapseEmptyGroups
        empty={false}
        grouping="assignee"
        loading
      />
      <TasksList
        {...args}
        collapseEmptyGroups
        empty={false}
        grouping="status"
        loading={false}
        onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
        startingTasks={tasksWithoutInProgress}
      />
    </div>
  ),
}
