import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  RunMonitor,
  type RunMonitorConnection,
  type RunMonitorStep,
} from '@tc96/ui/blocks/ai-agents/flow/run-monitor'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { runMonitorHandlers } from '../../../../mocks/run-monitor.ts'

interface RunData {
  connections: RunMonitorConnection[]
  steps: RunMonitorStep[]
}

const ReleaseRun = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RunData>('/flow/run-monitor'),
    queryKey: ['flow', 'run-monitor'],
    retry: false,
  })

  return (
    <RunMonitor
      connections={data?.connections ?? []}
      error={isError}
      onApprove={fn()}
      onReject={fn()}
      onReplay={fn()}
      onRetry={() => refetch()}
      pending={isPending}
      steps={data?.steps ?? []}
    />
  )
}

const meta = {
  component: ReleaseRun,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/AI & Agents/Flow/RunMonitor/Usages',
} satisfies Meta<typeof ReleaseRun>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(runMonitorHandlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('group', { name: 'Compilar, Concluído' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Aprovar Liberar release' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(runMonitorHandlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum passo na execução'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(runMonitorHandlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar a execução'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(runMonitorHandlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando execução'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
