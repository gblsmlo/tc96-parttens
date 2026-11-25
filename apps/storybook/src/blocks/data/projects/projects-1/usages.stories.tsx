import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Projects1,
  type Projects1Expanded,
  type Projects1Task,
  type Projects1View,
} from '@tc96/ui/blocks/data/projects/projects-1'
import { useMemo, useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { projects1Handlers } from '../../../../mocks/projects-1.ts'
import { tasksForView } from '../fixtures/projects-1.ts'

const TaskDelivery = () => {
  const [view, setView] = useState<Projects1View>('all')
  const [expanded, setExpanded] = useState<Projects1Expanded>({})
  const [showSubtasks, setShowSubtasks] = useState(true)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Projects1Task[]>('/data/tasks'),
    queryKey: ['data', 'tasks'],
  })
  const all = data ?? []
  const tasks = useMemo(() => tasksForView(view, data ?? []), [data, view])

  return (
    <Projects1
      error={isError}
      expanded={expanded}
      onExpandedChange={setExpanded}
      onRetry={() => refetch()}
      onShowSubtasksChange={setShowSubtasks}
      onViewChange={setView}
      pending={isPending}
      showSubtasks={showSubtasks}
      tasks={tasks}
      view={view}
      viewCounts={{
        active: tasksForView('active', all).length,
        all: all.length,
        backlog: tasksForView('backlog', all).length,
      }}
    />
  )
}

const meta = {
  component: TaskDelivery,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Projects/Projects1/Usages',
} satisfies Meta<typeof TaskDelivery>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects1Handlers.pending)
  },
}
