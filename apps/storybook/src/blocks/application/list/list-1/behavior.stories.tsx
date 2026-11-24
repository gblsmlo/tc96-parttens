import type { Meta, StoryObj } from '@storybook/react-vite'
import { List1 } from '@tc96/blocks/application/list/list-1'
import { expect, within } from 'storybook/test'
import { metrics } from '../fixtures/list-1.ts'
import { type List1Controls, list1ControlArgs } from './list-1-controls.ts'
import { ComposedList1 } from './list-1-layouts.tsx'

const meta = {
  args: list1ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List1/Behavior',
} satisfies Meta<List1Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachMetricShowsNameDescriptionAndValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Receita')).toBeVisible()
    await expect(canvas.getByText('Receita recorrente do mês')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-metric="revenue"]'),
    ).toHaveTextContent(/R\$\s*482\.300,00/)
  },
}

export const TrendDirectionFollowsTheSign: Story = {
  play: async ({ canvasElement }) => {
    const trends = canvasElement.querySelectorAll(
      '[data-slot="trend-indicator"]',
    )
    await expect(trends).toHaveLength(4)
    await expect(trends[0]).toHaveAttribute('data-direction', 'up')
    await expect(trends[0]).toHaveTextContent('Alta de')
    await expect(trends[2]).toHaveAttribute('data-direction', 'down')
    await expect(trends[2]).toHaveTextContent('Queda de')
    await expect(trends[3]).toHaveAttribute('data-direction', 'flat')
    await expect(trends[3]).toHaveTextContent('Sem variação')
  },
}

export const KindFormatsTheValue: Story = {
  play: async ({ canvasElement }) => {
    const row = (id: string) =>
      canvasElement.querySelector(`[data-metric="${id}"] [data-slot="amount"]`)
    await expect(row('revenue')).toHaveTextContent(/R\$\s*482\.300,00/)
    await expect(row('customers')).toHaveTextContent('1.284')
    await expect(row('churn')).toHaveTextContent('2,1%')
  },
}

export const InitialsStandInForMissingIcon: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('CA')).toBeVisible()
  },
}

export const WithoutChangeNoTrendRenders: Story = {
  args: { showTrend: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="trend-indicator"]'),
    ).toHaveLength(0)
  },
}

export const EmptyMetricsShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma métrica ainda')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const CurrencyAndLocaleFormatValues: Story = {
  render: () => <List1 currency="USD" locale="en-US" metrics={metrics} />,
  play: async ({ canvasElement }) => {
    const row = (id: string) =>
      canvasElement.querySelector(`[data-metric="${id}"] [data-slot="amount"]`)
    await expect(row('revenue')).toHaveTextContent('$482,300.00')
    await expect(row('customers')).toHaveTextContent('1,284')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List1
      labels={{
        title: 'Indicadores',
        trend: { down: 'Caiu', flat: 'Estável', up: 'Subiu' },
      }}
      metrics={metrics}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('list', { name: 'Indicadores' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-direction="up"]'),
    ).toHaveTextContent('Subiu')
    await expect(canvas.queryByText(/Alta de/)).toBeNull()
  },
}
