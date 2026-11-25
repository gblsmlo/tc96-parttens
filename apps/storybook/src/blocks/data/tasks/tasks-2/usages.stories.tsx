import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Tasks2,
  type Tasks2GroupBy,
  type Tasks2Mode,
  type Tasks2Sort,
  type Tasks2Status,
  type Tasks2Task,
} from '@tc96/ui/blocks/data/tasks/tasks-2'
import { useState } from 'react'
import {
  createOptions,
  now,
  people,
  projects,
  tags,
  tasks,
} from '../fixtures/tasks-2.ts'

interface AllTasksProps {
  error?: boolean
  pending?: boolean
  startingTasks?: Tasks2Task[]
}

const AllTasks = ({
  error = false,
  pending = false,
  startingTasks = tasks,
}: Readonly<AllTasksProps>) => {
  const [items, setItems] = useState(startingTasks)
  const [mode, setMode] = useState<Tasks2Mode>('list')
  const [groupBy, setGroupBy] = useState<Tasks2GroupBy | null>('priority')
  const [sort, setSort] = useState<Tasks2Sort>('due')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Tasks2Status | null>(null)
  const update = (id: string, change: Partial<Tasks2Task>) =>
    setItems((current) =>
      current.map((task) => (task.id === id ? { ...task, ...change } : task)),
    )
  const visible = items.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (!statusFilter || task.status === statusFilter),
  )

  return (
    <Tasks2
      createOptions={createOptions}
      error={error}
      filtered={Boolean(search || statusFilter)}
      groupBy={groupBy}
      mode={mode}
      now={now}
      onAssigneesChange={(id, assigneeIds) => update(id, { assigneeIds })}
      onCreate={() => undefined}
      onDueChange={(id, dueAt) => update(id, { dueAt, overdue: false })}
      onGroupByChange={setGroupBy}
      onModeChange={setMode}
      onOpen={() => undefined}
      onPriorityChange={(id, priority) => update(id, { priority })}
      onProjectChange={(id, projectId) => update(id, { projectId })}
      onRetry={() => undefined}
      onSearchChange={setSearch}
      onSortChange={setSort}
      onStatusChange={(id, status) => update(id, { status })}
      onStatusFilterChange={setStatusFilter}
      pending={pending}
      people={people}
      projects={projects}
      search={search}
      sort={sort}
      statusFilter={statusFilter}
      tags={tags}
      tasks={visible}
    />
  )
}

const meta = {
  component: AllTasks,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks2/Usages',
} satisfies Meta<typeof AllTasks>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {}

export const Empty: Story = {
  args: { startingTasks: [] },
}

export const Pending: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
}
