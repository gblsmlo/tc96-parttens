import type { Meta, StoryObj } from '@storybook/react-vite'
import { RunMonitor } from '@tc96/ui/blocks/ai-agents/flow/run-monitor'
import { expect, fn, userEvent, within } from 'storybook/test'
import { connections, steps } from '../fixtures/run-monitor.ts'
import {
  type RunMonitorControls,
  runMonitorControlArgs,
} from './run-monitor-controls.ts'
import { ComposedRunMonitor } from './run-monitor-layouts.tsx'

type BehaviorArgs = RunMonitorControls & {
  onApprove: (stepId: string) => void
  onReject: (stepId: string) => void
  onReplay: () => void
  onRetry: () => void
}

const meta = {
  args: {
    ...runMonitorControlArgs,
    onApprove: fn(),
    onReject: fn(),
    onReplay: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRunMonitor {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/RunMonitor/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const EachStepShowsItsStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('group', { name: 'Obter código, Concluído' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Análise estática, Falhou' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', {
        name: 'Varredura de segurança, Executando',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', {
        name: 'Liberar release, Aguardando aprovação',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Publicar em produção, Pendente' }),
    ).toBeVisible()
  },
}

export const StepShowsItsDurationWhenGiven: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('group', { name: 'Compilar, Concluído' }),
    ).toHaveTextContent('38.0s')
    await expect(
      canvas.getByRole('group', { name: 'Publicar em produção, Pendente' }),
    ).not.toHaveTextContent(/\d+(\.\d)?s/)
  },
}

export const SummaryCountsTheSucceededSteps: Story = {
  play: async ({ canvasElement }) => {
    const summary = canvasElement.querySelector(
      '[data-slot="run-monitor-summary"]',
    )
    await expect(summary).toHaveTextContent('3 de 7 passos concluídos')
    await expect(summary).toHaveTextContent('Falhou')
  },
}

export const CanvasIsReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole('group', { name: 'Compilar, Concluído' })
    await expect(
      canvasElement.querySelector('[data-slot="flow-canvas"]'),
    ).toHaveAttribute('data-locked')
    await expect(canvas.queryByRole('button', { name: /Adicionar/ })).toBeNull()
  },
}

export const ApproveCallsOnApproveWithTheStepId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Aprovar Liberar release',
      }),
    )
    await expect(args.onApprove).toHaveBeenCalledTimes(1)
    await expect(args.onApprove).toHaveBeenCalledWith('approval')
  },
}

export const RejectCallsOnRejectWithTheStepId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Recusar Liberar release',
      }),
    )
    await expect(args.onReject).toHaveBeenCalledTimes(1)
    await expect(args.onReject).toHaveBeenCalledWith('approval')
  },
}

export const ApprovalButtonsListOnlyTheWaitingSteps: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('button', { name: /^Aprovar / }),
    ).toHaveLength(1)
    await expect(
      canvas.getAllByRole('button', { name: /^Recusar / }),
    ).toHaveLength(1)
  },
}

export const WithoutWaitingStepsShowsNoPendingApproval: Story = {
  args: { waiting: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma aprovação pendente.')).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Aprovar / })).toBeNull()
  },
}

export const WithoutOnApproveHidesApprove: Story = {
  render: () => (
    <RunMonitor connections={connections} onReject={fn()} steps={steps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: /^Aprovar / })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: /^Recusar / }),
    ).toBeVisible()
  },
}

export const WithoutOnRejectHidesReject: Story = {
  render: () => (
    <RunMonitor connections={connections} onApprove={fn()} steps={steps} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: /^Recusar / })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: /^Aprovar / }),
    ).toBeVisible()
  },
}

export const ReplayCallsOnReplay: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Reexecutar' }),
    )
    await expect(args.onReplay).toHaveBeenCalledTimes(1)
  },
}

export const WithoutOnReplayHidesReplay: Story = {
  args: { replay: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Reexecutar' }),
    ).toBeNull()
  },
}

export const EmptyStepsShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum passo na execução')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="flow-canvas"]'),
    ).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando execução')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByText('Execução do pipeline')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Reexecutar' }),
    ).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a execução'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <RunMonitor connections={connections} error steps={steps} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <RunMonitor connections={[]} error pending steps={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando execução')).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.queryByText('Nenhum passo na execução')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <RunMonitor connections={[]} error steps={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhum passo na execução')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <RunMonitor
      connections={connections}
      labels={{
        replay: 'Rodar de novo',
        statuses: {
          failed: 'Quebrou',
          pending: 'Na fila',
          running: 'Rodando',
          succeeded: 'Feito',
          'waiting-approval': 'Esperando OK',
        },
        title: 'Release 4.2',
      }}
      onReplay={fn()}
      steps={steps}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Release 4.2')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Rodar de novo' }),
    ).toBeVisible()
    await expect(
      await canvas.findByRole('group', { name: 'Compilar, Feito' }),
    ).toBeVisible()
  },
}
