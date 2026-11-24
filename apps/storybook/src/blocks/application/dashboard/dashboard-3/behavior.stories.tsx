import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard3 } from '@tc96/blocks/application/dashboard/dashboard-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import { crew, forecast, queue } from '../fixtures/dashboard-3.ts'
import {
  type Dashboard3Controls,
  dashboard3ControlArgs,
} from './dashboard-3-controls.ts'
import { ComposedDashboard3 } from './dashboard-3-layouts.tsx'

const meta = {
  args: { ...dashboard3ControlArgs, onAction: fn(), onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard3/Behavior',
} satisfies Meta<
  Dashboard3Controls & { onAction: (id: string) => void; onRetry: () => void }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = { crew, forecast, queue }

export const CrewTableShowsMemberRoleAndShift: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-member="m2"]')
    await expect(row).toHaveTextContent('Rafael Lima')
    await expect(row).toHaveTextContent('Operador de empilhadeira')
    await expect(row).toHaveTextContent('Manhã')
    await expect(row?.querySelector('[data-slot="badge"]')).toHaveTextContent(
      'Parcial',
    )
  },
}

export const CoverageBarsShowTheRatio: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', {
      name: 'Cobertura de Júlia Andrade',
    })
    await expect(bar).toHaveAttribute('aria-valuenow', '0.35')
    await expect(
      canvasElement.querySelector('[data-member="m3"]'),
    ).toHaveTextContent('35%')
  },
}

export const ActionQueueListsItems: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Fila de ações',
    })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(
      queue.length,
    )
    await expect(
      canvasElement.querySelector('[data-queue-item="q1"] [data-slot="badge"]'),
    ).toHaveTextContent('Alta')
    await expect(
      canvasElement.querySelector('[data-queue-item="q3"] [data-slot="badge"]'),
    ).toBeNull()
  },
}

export const ActionButtonCallsOnActionWithTheId: Story = {
  render: (args) => <Dashboard3 {...baseProps} onAction={args.onAction} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Resolver: Cobrir turno da tarde',
      }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('q1')
  },
}

export const ActionLabelOverridesTheDefault: Story = {
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[data-queue-item="q2"]')
    await expect(item?.querySelector('button')).toHaveTextContent('Aprovar')
    await expect(
      canvasElement.querySelector('[data-queue-item="q1"] button'),
    ).toHaveTextContent('Resolver')
  },
}

export const ActionButtonsRenderOnlyWithOnAction: Story = {
  args: { actions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Cobrir turno da tarde')).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /Resolver/ })).toBeNull()
  },
}

export const ForecastChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = within(canvasElement).getByRole('img', {
      name: 'Oferta de pessoal e demanda prevista ao longo do dia',
    })
    await expect(chart).toHaveAccessibleDescription(
      /06h: oferta 20, previsão 18.*18h: oferta 18, previsão 16/,
    )
  },
}

export const NoCrewShowsMessageInsideTable: Story = {
  render: () => <Dashboard3 {...baseProps} crew={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma pessoa escalada'),
    ).toBeVisible()
  },
}

export const NoQueueShowsMessage: Story = {
  render: () => <Dashboard3 {...baseProps} queue={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma ação pendente'),
    ).toBeVisible()
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma escala cadastrada')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando cobertura das equipes'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Cobertura das equipes')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a cobertura'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard3 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Dashboard3 crew={[]} error forecast={[]} pending queue={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando cobertura das equipes'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Dashboard3 crew={[]} error forecast={[]} queue={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma escala cadastrada')).toBeNull()
  },
}

export const LocaleFormatsCoverage: Story = {
  render: () => <Dashboard3 {...baseProps} locale="en-US" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-member="m1"]'),
    ).toHaveTextContent('92%')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard3
      {...baseProps}
      labels={{ action: 'Fix', crewTitle: 'Shift crew', queueTitle: 'Queue' }}
      onAction={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('table', { name: 'Shift crew' }),
    ).toBeVisible()
    await expect(canvas.getByRole('list', { name: 'Queue' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Fix: Cobrir turno da tarde' }),
    ).toBeVisible()
  },
}
