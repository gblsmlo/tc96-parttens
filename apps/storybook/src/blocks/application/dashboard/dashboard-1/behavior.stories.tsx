import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard1 } from '@tc96/blocks/application/dashboard/dashboard-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  capacity,
  exceptions,
  filterOptions,
  kpis,
} from '../fixtures/dashboard-1.ts'
import {
  type Dashboard1Controls,
  dashboard1ControlArgs,
} from './dashboard-1-controls.ts'
import { ComposedDashboard1 } from './dashboard-1-layouts.tsx'

const meta = {
  args: { ...dashboard1ControlArgs, onFilterChange: fn(), onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard1/Behavior',
} satisfies Meta<
  Dashboard1Controls & { onFilterChange: () => void; onRetry: () => void }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = {
  capacity,
  exceptions,
  filter: 'all',
  filterOptions,
  kpis,
  onFilterChange: () => undefined,
}

export const KpisShowFormattedValuesAndDeltas: Story = {
  play: async ({ canvasElement }) => {
    const open = canvasElement.querySelector('[data-kpi="open"]')
    await expect(open).toHaveTextContent('128')
    await expect(open).toHaveTextContent('-8%')
    await expect(
      canvasElement.querySelector('[data-kpi="sla"]'),
    ).toHaveTextContent('94,3%')
    await expect(
      canvasElement.querySelector('[data-kpi="risk"]'),
    ).toHaveTextContent('R$ 184.500')
  },
}

export const ChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = within(canvasElement).getByRole('img', {
      name: 'Capacidade utilizada por centro de distribuição',
    })
    await expect(chart).toHaveAccessibleDescription(
      /Campinas: 820 de 1\.000.*Recife: 790 de 800/,
    )
  },
}

export const TableListsEveryException: Story = {
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Exceções abertas',
    })
    await expect(within(table).getAllByRole('row')).toHaveLength(
      exceptions.length + 1,
    )
    await expect(
      canvasElement.querySelector('[data-exception="e1"]'),
    ).toHaveTextContent('26 h')
  },
}

export const StatusBadgesShowTheStatus: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-exception="e2"] [data-slot="badge"]'),
    ).toHaveTextContent('Escalada')
  },
}

export const FilterCallsOnFilterChange: Story = {
  render: (args) => (
    <Dashboard1 {...baseProps} onFilterChange={args.onFilterChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Todas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Escaladas' }))
    await expect(args.onFilterChange).toHaveBeenCalledWith('Escalada')
  },
}

export const FilterIsControlledByTheConsumer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Escaladas' }))
    const table = canvas.getByRole('table', { name: 'Exceções abertas' })
    await expect(within(table).getAllByRole('row')).toHaveLength(3)
    await expect(canvas.queryByText('PED-48213')).toBeNull()
  },
}

export const NoRowsShowMessageInsideTable: Story = {
  render: () => (
    <Dashboard1 {...baseProps} exceptions={[]} filter="Resolvida" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma exceção para este filtro'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma exceção de expedição')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando exceções de expedição'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Exceções de expedição')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as exceções'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard1 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => (
    <Dashboard1
      {...baseProps}
      capacity={[]}
      error
      exceptions={[]}
      kpis={[]}
      pending
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando exceções de expedição'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => (
    <Dashboard1 {...baseProps} capacity={[]} error exceptions={[]} kpis={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma exceção de expedição')).toBeNull()
  },
}

export const LocaleAndCurrencyFormatValues: Story = {
  render: () => <Dashboard1 {...baseProps} currency="USD" locale="en-US" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kpi="risk"]'),
    ).toHaveTextContent('$184,500')
    await expect(
      canvasElement.querySelector('[data-kpi="sla"]'),
    ).toHaveTextContent('94.3%')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard1
      {...baseProps}
      labels={{
        columnOrder: 'Order',
        delay: (hours) => `${hours} hours`,
        exceptionsTitle: 'Open exceptions',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Open exceptions' })
    await expect(within(table).getByText('Order')).toBeVisible()
    await expect(canvas.getByText('26 hours')).toBeVisible()
  },
}
