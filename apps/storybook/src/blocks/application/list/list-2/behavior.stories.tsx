import type { Meta, StoryObj } from '@storybook/react-vite'
import { List2 } from '@tc96/blocks/application/list/list-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { entries } from '../fixtures/list-2.ts'
import { type List2Controls, list2ControlArgs } from './list-2-controls.ts'
import { ComposedList2 } from './list-2-layouts.tsx'

const meta = {
  args: { ...list2ControlArgs, onRangeChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List2/Behavior',
} satisfies Meta<List2Controls & { onRangeChange: (range: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const EachEntryShowsRankNameAmountAndShare: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rows = canvas.getAllByRole('listitem')
    await expect(rows).toHaveLength(4)
    await expect(within(rows[0]).getByText('Rafael Lima')).toBeVisible()
    await expect(within(rows[0]).getByText('Posição 1')).toBeInTheDocument()
    await expect(
      rows[0].querySelector('[data-slot="amount"]'),
    ).toHaveTextContent(/R\$\s*168\.000,00/)
    await expect(within(rows[0]).getByText('42%')).toBeVisible()
    await expect(within(rows[3]).getByText('Posição 4')).toBeInTheDocument()
  },
}

export const InitialsStandInForMissingIcon: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('RL')).toBeVisible()
  },
}

export const RangeSelectShowsCurrentLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Período' }),
    ).toHaveTextContent('Últimos 30 dias')
  },
}

export const RangeSelectCallsOnRangeChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Período' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Últimos 7 dias' }),
    )
    await waitFor(() => expect(args.onRangeChange).toHaveBeenCalledWith('7d'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(canvas.getByText('Marina Souza')).toBeVisible()
  },
}

export const RangeIsControlled: Story = {
  render: (args) => (
    <List2 entries={entries} onRangeChange={args.onRangeChange} range="12m" />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: 'Período' })
    await expect(select).toHaveTextContent('Últimos 12 meses')
    await userEvent.click(select)
    await userEvent.click(
      await screen.findByRole('option', { name: 'Últimos 7 dias' }),
    )
    await waitFor(() => expect(args.onRangeChange).toHaveBeenCalledWith('7d'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(select).toHaveTextContent('Últimos 12 meses')
  },
}

export const EmptyEntriesShowEmptyStateAndKeepRange: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum resultado no período')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
    await expect(
      canvas.getByRole('combobox', { name: 'Período' }),
    ).toBeVisible()
  },
}

export const CurrencyAndLocaleFormatAmounts: Story = {
  render: () => (
    <List2 currency="USD" entries={entries} locale="en-US" range="30d" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="amount"]'),
    ).toHaveTextContent('$168,000.00')
    await expect(within(canvasElement).getByText('42%')).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List2
      entries={entries}
      labels={{
        range: 'Janela',
        ranges: { '12m': '1A', '30d': '30D', '7d': '7D' },
        rank: (position) => `Lugar ${position}`,
        title: 'Melhores',
      }}
      range="30d"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Melhores')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Janela' }),
    ).toHaveTextContent('30D')
    await expect(canvas.getByText('Lugar 1')).toBeInTheDocument()
    await expect(canvas.queryByText('Posição 1')).toBeNull()
  },
}
