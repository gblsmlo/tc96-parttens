import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline3 } from '@tc96/blocks/application/timeline/timeline-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import { approvalSteps } from '../fixtures/timeline-3.ts'
import { timeline3ControlArgs } from './timeline-3-controls.ts'
import {
  ComposedTimeline3,
  type ComposedTimeline3Props,
} from './timeline-3-layouts.tsx'

const meta = {
  args: {
    ...timeline3ControlArgs,
    onApprove: fn(),
    onReject: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline3/Behavior',
} satisfies Meta<ComposedTimeline3Props>

export default meta

type Story = StoryObj<typeof meta>

export const EachStepShowsOwnerNameStatusAndDate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const steps = canvas.getAllByRole('listitem')
    await expect(steps).toHaveLength(4)
    await expect(within(steps[0]).getByText('Ana Costa')).toBeVisible()
    await expect(within(steps[0]).getByText('AC')).toBeVisible()
    await expect(within(steps[0]).getByText('Solicitação')).toBeVisible()
    await expect(within(steps[0]).getByText('Aprovado')).toBeVisible()
    await expect(within(steps[0]).getByText('12 nov 2026, 09:30')).toBeVisible()
    await expect(within(steps[2]).getByText('Pendente')).toBeVisible()
  },
}

export const RejectedStepShowsRejectedBadge: Story = {
  render: () => (
    <Timeline3
      steps={approvalSteps.map((step) =>
        step.id === 'finance' ? { ...step, status: 'rejected' } : step,
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Recusado')).toBeVisible()
  },
}

export const CurrentStepIsHighlighted: Story = {
  play: async ({ canvasElement }) => {
    const current = canvasElement.querySelector('[aria-current="step"]')
    await expect(current).toHaveAttribute('data-step', 'finance')
    await expect(
      within(current as HTMLElement).getByText('Etapa atual'),
    ).toBeVisible()
    await expect(canvasElement.querySelectorAll('[aria-current]')).toHaveLength(
      1,
    )
  },
}

export const ActionsAppearOnlyOnCurrentStep: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('button')).toHaveLength(2)
    const current = canvasElement.querySelector('[data-current]') as HTMLElement
    await expect(
      within(current).getByRole('button', { name: 'Aprovar' }),
    ).toBeVisible()
    await expect(
      within(current).getByRole('button', { name: 'Recusar' }),
    ).toBeVisible()
  },
}

export const NoCurrentStepHidesActions: Story = {
  render: () => <Timeline3 steps={approvalSteps} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const ApproveCallsOnApproveWithStepId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Aprovar' }),
    )
    await expect(args.onApprove).toHaveBeenCalledWith('finance')
    await expect(args.onReject).not.toHaveBeenCalled()
  },
}

export const RejectCallsOnRejectWithStepId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Recusar' }),
    )
    await expect(args.onReject).toHaveBeenCalledWith('finance')
    await expect(args.onApprove).not.toHaveBeenCalled()
  },
}

export const DecisionIsControlled: Story = {
  render: (args) => (
    <Timeline3
      currentStepId="finance"
      onApprove={args.onApprove}
      steps={approvalSteps}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Aprovar' }))
    await expect(args.onApprove).toHaveBeenCalledWith('finance')
    await expect(canvas.getAllByText('Pendente')).toHaveLength(2)
    await expect(canvas.getByRole('button', { name: 'Aprovar' })).toBeVisible()
  },
}

export const TrackScrolls: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const viewport = canvasElement.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement
    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
  },
}

export const EmptyStepsShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma etapa de aprovação')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando etapas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const ErrorShowsSurfaceWithRetry: Story = {
  args: { error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as etapas'),
    ).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const RetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesButton: Story = {
  render: () => <Timeline3 error steps={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as etapas'),
    ).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  args: { empty: true, error: true, pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando etapas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as etapas'),
    ).toBeNull()
    await expect(canvas.queryByText('Nenhuma etapa de aprovação')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  args: { empty: true, error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as etapas'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma etapa de aprovação')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Timeline3
      currentStepId="finance"
      labels={{
        approve: 'Aceitar',
        currentStep: 'Agora',
        reject: 'Negar',
        statuses: { approved: 'Ok', pending: 'Em espera', rejected: 'Não' },
        title: 'Trilha',
      }}
      steps={approvalSteps}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Trilha')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Aceitar' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Negar' })).toBeVisible()
    await expect(canvas.getByText('Agora')).toBeVisible()
    await expect(canvas.getAllByText('Ok')).toHaveLength(2)
    await expect(canvas.queryByText('Aprovado')).toBeNull()
  },
}
