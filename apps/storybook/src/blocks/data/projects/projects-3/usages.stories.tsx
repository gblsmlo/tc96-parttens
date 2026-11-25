import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Projects3,
  type Projects3Archived,
  type Projects3Expanded,
  type Projects3GroupBy,
  type Projects3Mode,
  type Projects3Status,
  type Projects3Task,
} from '@tc96/ui/blocks/data/projects/projects-3'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { projects3Handlers } from '../../../../mocks/projects-3.ts'
import {
  assignees,
  type Projects3Page,
  pageSize,
  tags,
  types,
} from '../fixtures/projects-3.ts'

const updateTasks = (
  list: readonly Projects3Task[],
  ids: readonly string[],
  change: Partial<Projects3Task>,
): Projects3Task[] =>
  list.map((task) => ({
    ...task,
    ...(ids.includes(task.id) ? change : {}),
    ...(task.subtasks
      ? { subtasks: updateTasks(task.subtasks, ids, change) }
      : {}),
  }))

const TeamTasks = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Projects3Mode>('table')
  const [groupBy, setGroupBy] = useState<Projects3GroupBy | null>(null)
  const [expanded, setExpanded] = useState<Projects3Expanded>({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Projects3Status | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [archivedFilter, setArchivedFilter] =
    useState<Projects3Archived | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
  })
  if (search) params.set('q', search)
  if (statusFilter) params.set('status', statusFilter)
  if (assigneeFilter) params.set('assigneeId', assigneeFilter)
  if (archivedFilter) params.set('archived', archivedFilter)
  const queryKey = ['data', 'projects', 'tasks', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Projects3Page>(`/data/projects/tasks?${params.toString()}`),
    queryKey,
  })
  const update = (ids: readonly string[], change: Partial<Projects3Task>) =>
    queryClient.setQueryData<Projects3Page>(queryKey, (current) =>
      current
        ? { ...current, items: updateTasks(current.items, ids, change) }
        : current,
    )
  const firstPage = () => setPage(1)

  return (
    <Projects3
      archivedFilter={archivedFilter}
      assigneeFilter={assigneeFilter}
      assignees={assignees}
      error={isError}
      expanded={expanded}
      filtered={Boolean(search || statusFilter || assigneeFilter)}
      groupBy={groupBy}
      mode={mode}
      onArchivedFilterChange={(next) => {
        setArchivedFilter(next)
        firstPage()
      }}
      onAssigneeChange={(id, assigneeId) => update([id], { assigneeId })}
      onAssigneeFilterChange={(next) => {
        setAssigneeFilter(next)
        firstPage()
      }}
      onBulkStatusChange={(ids, status) => update(ids, { status })}
      onExpandedChange={setExpanded}
      onGroupByChange={setGroupBy}
      onModeChange={setMode}
      onPageChange={setPage}
      onPriorityChange={(id, priority) => update([id], { priority })}
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
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      search={search}
      selectedIds={selectedIds}
      statusFilter={statusFilter}
      tags={tags}
      tasks={data?.items ?? []}
      total={data?.total}
      types={types}
    />
  )
}

const meta = {
  component: TeamTasks,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Projects/Projects3/Usages',
} satisfies Meta<typeof TeamTasks>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects3Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects3Handlers.pending)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects3Handlers.error)
  },
}
