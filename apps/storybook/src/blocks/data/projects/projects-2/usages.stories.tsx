import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Projects2,
  type Projects2Expanded,
  type Projects2Task,
  type Projects2View,
} from '@tc96/ui/blocks/data/projects/projects-2'
import { useMemo, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { projects2Handlers } from '../../../../mocks/projects-2.ts'
import { tasksForView } from '../fixtures/projects-2.ts'

const TaskDelivery = () => {
  const [view, setView] = useState<Projects2View>('all')
  const [expanded, setExpanded] = useState<Projects2Expanded>({})
  const [showSubtasks, setShowSubtasks] = useState(true)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Projects2Task[]>('/data/table/tasks'),
    queryKey: ['data', 'table', 'tasks'],
  })
  const all = data ?? []
  const tasks = useMemo(() => tasksForView(view, data ?? []), [data, view])

  return (
    <Projects2
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
  title: 'Blocks/Data/Projects/Projects2/Usages',
} satisfies Meta<typeof TaskDelivery>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Concluir o handshake do registro para instalações privadas',
      ),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await userEvent.click(canvas.getByRole('tab', { name: /Backlog/ }))
    await expect(
      await canvas.findByText('Permitir notas fiscais em lote'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma tarefa para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as tarefas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(projects2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando tarefas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
  },
}
