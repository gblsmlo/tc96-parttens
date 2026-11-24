import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats5 } from '@tc96/blocks/application/stats/stats-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { salesAndChurn } from '../fixtures/stats-5.ts'
import { type Stats5Controls, stats5ControlArgs } from './stats-5-controls.ts'
import { ComposedStats5 } from './stats-5-layouts.tsx'

const loaded = { items: salesAndChurn }

const retry = fn()

const meta = {
  args: stats5ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats5/Behavior',
} satisfies Meta<Stats5Controls>

export default meta

type Story = StoryObj<typeof meta>

export const ColumnsShowLabelValueAndTrend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const columns = canvas.getAllByRole('listitem')
    await expect(columns).toHaveLength(3)
    await expect(
      within(columns[0]).getByText('Receita recorrente'),
    ).toBeVisible()
    await expect(within(columns[0]).getByText(/184\.500,00/)).toBeVisible()
    await expect(within(columns[1]).getByText('326')).toBeVisible()
    await expect(within(columns[2]).getByText('2,4%')).toBeVisible()
  },
}

export const TrendReadsAsTextAndDirection: Story = {
  play: async ({ canvasElement }) => {
    const trends = canvasElement.querySelectorAll('[data-slot="stats-5-trend"]')
    await expect(trends[0]).toHaveAttribute('data-direction', 'up')
    await expect(trends[0]).toHaveTextContent('Alta de 8,20%')
    await expect(trends[2]).toHaveAttribute('data-direction', 'down')
    await expect(trends[2]).toHaveTextContent('Queda de 3,10%')
  },
}

export const LowerIsBetterTurnsADropGood: Story = {
  play: async ({ canvasElement }) => {
    const trends = canvasElement.querySelectorAll('[data-slot="stats-5-trend"]')
    await expect(trends[2]).toHaveAttribute('data-tone', 'good')
    await expect(trends[0]).toHaveAttribute('data-tone', 'good')
  },
}

export const ARiseInChurnIsBad: Story = {
  args: { churnTrend: 0.05 },
  play: async ({ canvasElement }) => {
    const trends = canvasElement.querySelectorAll('[data-slot="stats-5-trend"]')
    await expect(trends[2]).toHaveAttribute('data-direction', 'up')
    await expect(trends[2]).toHaveAttribute('data-tone', 'bad')
  },
}

export const ZeroTrendIsFlat: Story = {
  args: { revenueTrend: 0 },
  play: async ({ canvasElement }) => {
    const trend = canvasElement.querySelector('[data-slot="stats-5-trend"]')
    await expect(trend).toHaveAttribute('data-direction', 'flat')
    await expect(trend).toHaveAttribute('data-tone', 'neutral')
    await expect(trend).toHaveTextContent('Sem variação')
  },
}

export const CurrencyAndLocaleFormatValues: Story = {
  render: () => <Stats5 currency="USD" items={salesAndChurn} locale="en-US" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('$184,500.00')).toBeVisible()
    await expect(canvas.getByText('326')).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Stats5
      items={[salesAndChurn[0]]}
      labels={{ title: 'Resumo comercial', up: 'Subiu' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Resumo comercial' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="stats-5-trend"]'),
    ).toHaveTextContent('Subiu 8,20%')
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Stats5 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando vendas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('region', { name: 'Vendas e cancelamentos' }),
    ).toBeVisible()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Stats5 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as vendas'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Stats5 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Stats5 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando vendas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as vendas'),
    ).toBeNull()
  },
}
