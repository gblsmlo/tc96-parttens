import type { Meta, StoryObj } from '@storybook/react-vite'
import { List3 } from '@tc96/blocks/application/list/list-3'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { transactions } from '../fixtures/list-3.ts'
import { type List3Controls, list3ControlArgs } from './list-3-controls.ts'
import { ComposedList3 } from './list-3-layouts.tsx'

const meta = {
  args: { ...list3ControlArgs, onPeriodChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List3/Behavior',
} satisfies Meta<List3Controls & { onPeriodChange: (period: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const EachTransactionShowsDescriptionDateAndAmount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5)
    await expect(canvas.getByText('Pagamento do cliente Atlas')).toBeVisible()
    await expect(canvas.getByText(/20 de nov/)).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-transaction="atlas"] [data-kind]'),
    ).toHaveTextContent(/\+R\$\s*12\.500,00/)
  },
}

export const CreditAndDebitUseTheirOwnTone: Story = {
  play: async ({ canvasElement }) => {
    const credit = canvasElement.querySelector('[data-kind="credit"]')
    const debit = canvasElement.querySelector('[data-kind="debit"]')
    await expect(credit).toHaveClass('text-success-foreground')
    await expect(credit).toHaveTextContent('Entrada')
    await expect(credit).toHaveTextContent('+')
    await expect(debit).toHaveClass('text-destructive-foreground')
    await expect(debit).toHaveTextContent('Saída')
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
    await expect(canvas.getByText('Contrato anual Atlas')).toBeVisible()
  },
}

export const PeriodIsControlled: Story = {
  render: (args) => (
    <List3
      onPeriodChange={args.onPeriodChange}
      period="week"
      transactions={transactions}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Ano' }))
    await waitFor(() =>
      expect(args.onPeriodChange).toHaveBeenCalledWith('year'),
    )
    await expect(canvas.getByRole('tab', { name: 'Semana' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tab', { name: 'Ano' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  },
}

export const EmptyTransactionsShowEmptyStateAndKeepTabs: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma transação no período')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
    await expect(canvas.getByRole('tab', { name: 'Mês' })).toBeVisible()
  },
}

export const CurrencyAndLocaleFormatAmounts: Story = {
  render: () => (
    <List3
      currency="USD"
      locale="en-US"
      period="month"
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-transaction="atlas"] [data-kind]'),
    ).toHaveTextContent('+$12,500.00')
    await expect(
      canvasElement.querySelector('[data-transaction="rent"] [data-kind]'),
    ).toHaveTextContent('-$4,200.00')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List3
      labels={{
        credit: 'Recebido',
        debit: 'Pago',
        period: 'Janela',
        periods: { month: '30D', week: '7D', year: '1A' },
        title: 'Movimentações',
      }}
      period="month"
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Movimentações')).toBeVisible()
    await expect(canvas.getByRole('tablist', { name: 'Janela' })).toBeVisible()
    await expect(canvas.getByRole('tab', { name: '1A' })).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-kind="credit"]'),
    ).toHaveTextContent('Recebido')
  },
}
