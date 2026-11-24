import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Stats6,
  type Stats6Props,
} from '@tc96/ui/blocks/application/stats/stats-6'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { sleeves } from '../fixtures/stats-6.ts'
import { type Stats6Controls, stats6ControlArgs } from './stats-6-controls.ts'
import { ComposedStats6 } from './stats-6-layouts.tsx'

const loaded: Stats6Props = { period: 'month', sleeves }

const retry = fn()

const meta = {
  args: { ...stats6ControlArgs, onPeriodChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats6/Behavior',
} satisfies Meta<Stats6Controls & { onPeriodChange: (period: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const SleevesShowNameAmountAndDelta: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cards = canvasElement.querySelectorAll('[data-slot="stats-6-sleeve"]')
    await expect(cards).toHaveLength(3)
    await expect(canvas.getByText('Renda fixa')).toBeVisible()
    await expect(canvas.getByText(/471\.000,00/)).toBeVisible()
    const trends = canvasElement.querySelectorAll(
      '[data-slot="trend-indicator"]',
    )
    await expect(trends[0]).toHaveAttribute('data-direction', 'up')
    await expect(trends[0]).toHaveTextContent('Alta de 2,10%')
  },
}

export const MeterShowsAllocationShare: Story = {
  play: async ({ canvasElement }) => {
    const meters = within(canvasElement).getAllByRole('meter')
    await expect(meters).toHaveLength(3)
    await expect(meters[0]).toHaveAttribute('aria-valuetext', '47%')
    await expect(meters[1]).toHaveAttribute('aria-valuetext', '32%')
    await expect(meters[2]).toHaveAttribute('aria-valuetext', '21%')
  },
}

export const NegativeDeltaReadsAsDrop: Story = {
  args: { delta: -0.034 },
  play: async ({ canvasElement }) => {
    const trend = canvasElement.querySelector('[data-slot="trend-indicator"]')
    await expect(trend).toHaveAttribute('data-direction', 'down')
    await expect(trend).toHaveTextContent('Queda de 3,40%')
  },
}

export const PeriodTabsCallsOnPeriodChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Mês' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(canvas.getByRole('tab', { name: 'Ano' }))
    await waitFor(() =>
      expect(args.onPeriodChange).toHaveBeenCalledWith('year'),
    )
    await expect(canvas.getByRole('tab', { name: 'Ano' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByText(/455\.000,00/)).toBeVisible()
  },
}

export const PeriodIsControlled: Story = {
  render: (args) => (
    <Stats6
      onPeriodChange={args.onPeriodChange}
      period="week"
      sleeves={sleeves}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Dia' }))
    await waitFor(() => expect(args.onPeriodChange).toHaveBeenCalledWith('day'))
    await expect(canvas.getByRole('tab', { name: 'Semana' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tab', { name: 'Dia' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  },
}

export const CurrencyAndLocaleFormatAmounts: Story = {
  render: () => (
    <Stats6 currency="USD" locale="en-US" period="month" sleeves={sleeves} />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('$471,000.00')).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Stats6
      labels={{
        period: 'Janela',
        periods: { day: '1D', month: '1M', week: '1S', year: '1A' },
        share: 'Peso',
        title: 'Carteira',
      }}
      period="month"
      sleeves={sleeves}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Carteira')).toBeVisible()
    await expect(canvas.getByRole('tablist', { name: 'Janela' })).toBeVisible()
    await expect(canvas.getByRole('tab', { name: '1A' })).toBeVisible()
    await expect(canvas.getAllByText('Peso')).toHaveLength(3)
    await expect(canvas.queryByText('Participação')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Stats6 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando carteira')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('region', { name: 'Alocação da carteira' }),
    ).toBeVisible()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Stats6 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a carteira'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Stats6 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Stats6 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando carteira')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar a carteira'),
    ).toBeNull()
  },
}
