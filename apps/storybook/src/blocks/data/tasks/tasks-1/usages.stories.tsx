import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Tasks1,
  type Tasks1GroupBy,
  type Tasks1Priority,
  type Tasks1Status,
  type Tasks1Task,
} from '@tc96/ui/blocks/data/tasks/tasks-1'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { tasks1Handlers } from '../../../../mocks/tasks-1.ts'
import {
  assignees,
  pageSize,
  projects,
  type Tasks1Page,
  tags,
} from '../fixtures/tasks-1.ts'

const TeamTasks = () => {
  const queryClient = useQueryClient()
  const [groupBy, setGroupBy] = useState<Tasks1GroupBy | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Tasks1Status | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Tasks1Priority | null>(
    null,
  )
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
  })
  if (search) params.set('q', search)
  if (statusFilter) params.set('status', statusFilter)
  if (priorityFilter) params.set('priority', priorityFilter)
  if (projectFilter) params.set('projectId', projectFilter)
  const queryKey = ['data', 'tasks', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchJson<Tasks1Page>(`/data/tasks?${params.toString()}`),
    queryKey,
  })
  const update = (ids: readonly string[], change: Partial<Tasks1Task>) =>
    queryClient.setQueryData<Tasks1Page>(queryKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((task) =>
              ids.includes(task.id) ? { ...task, ...change } : task,
            ),
          }
        : current,
    )
  const firstPage = () => setPage(1)

  return (
    <Tasks1
      assignees={assignees}
      error={isError}
      filtered={Boolean(
        search || statusFilter || priorityFilter || projectFilter,
      )}
      groupBy={groupBy}
      onAssigneesChange={(id, assigneeIds) => update([id], { assigneeIds })}
      onBulkPriorityChange={(ids, priority) => update(ids, { priority })}
      onBulkStatusChange={(ids, status) => update(ids, { status })}
      onDueChange={(id, dueAt) => update([id], { dueAt, overdue: false })}
      onGroupByChange={setGroupBy}
      onPageChange={setPage}
      onPriorityChange={(id, priority) => update([id], { priority })}
      onPriorityFilterChange={(next) => {
        setPriorityFilter(next)
        firstPage()
      }}
      onProjectChange={(id, projectId) => update([id], { projectId })}
      onProjectFilterChange={(next) => {
        setProjectFilter(next)
        firstPage()
      }}
      onRetry={() => refetch()}
      onSearchChange={(next) => {
        setSearch(next)
        firstPage()
      }}
      onSelectedIdsChange={setSelectedIds}
      onStatusChange={(id, status) => update([id], { status })}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        firstPage()
      }}
      onTagsChange={(id, tagIds) => update([id], { tagIds })}
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      priorityFilter={priorityFilter}
      projectFilter={projectFilter}
      projects={projects}
      search={search}
      selectedIds={selectedIds}
      statusFilter={statusFilter}
      tags={tags}
      tasks={data?.items ?? []}
      total={data?.total}
    />
  )
}

const meta = {
  component: TeamTasks,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Tasks/Tasks1/Usages',
} satisfies Meta<typeof TeamTasks>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(tasks1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(tasks1Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(tasks1Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(tasks1Handlers.error)
  },
}
