import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { finance4ControlArgs } from './finance-4-controls.ts'
import { ComposedFinance4 } from './finance-4-layouts.tsx'

const meta = {
  args: {
    ...finance4ControlArgs,
    onBulkSettle: fn(),
    onViewChange: fn(),
  },
  component: ComposedFinance4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance4/Behavior',
} satisfies Meta<typeof ComposedFinance4>

export default meta

type Story = StoryObj<typeof meta>

const amountsOf = (root: HTMLElement, direction: 'in' | 'out') => [
  ...root.querySelectorAll<HTMLElement>(
    `[data-slot="finance-4-amount"][data-direction="${direction}"]`,
  ),
]

export const AmountCarriesItsSign: Story = {
  play: async ({ canvasElement }) => {
    const incoming = amountsOf(canvasElement, 'in')
    const outgoing = amountsOf(canvasElement, 'out')

    await expect(incoming.length).toBeGreaterThan(0)
    await expect(outgoing.length).toBeGreaterThan(0)
    for (const amount of incoming)
      await expect(amount.textContent).toMatch(/^\+/)
    for (const amount of outgoing)
      await expect(amount.textContent).toMatch(/^[-−]/)
  },
}

export const TableAmountCarriesItsSign: Story = {
  args: { mode: 'table' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('table', { name: 'Lançamentos' }),
    ).toBeVisible()
    for (const amount of amountsOf(canvasElement, 'out'))
      await expect(amount.textContent).toMatch(/^[-−]/)
  },
}

export const SelectionOpensActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('checkbox', {
        name: 'Selecionar Custas de distribuição',
      }),
    )
    const bar = within(
      await canvas.findByRole('toolbar', {
        name: 'Ações dos lançamentos selecionados',
      }),
    )

    await expect(bar.getByText('1 lançamento selecionado')).toBeVisible()
    await userEvent.click(
      bar.getByRole('button', { name: 'Marcar como quitado' }),
    )
    await expect(args.onBulkSettle).toHaveBeenCalledWith(['lanc-102'])
  },
}

export const SettleSkipsEntriesThatCannotSettle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('checkbox', {
        name: 'Selecionar Certidões da junta comercial',
      }),
    )
    const bar = within(
      await canvas.findByRole('toolbar', {
        name: 'Ações dos lançamentos selecionados',
      }),
    )

    await expect(
      bar.getByRole('button', { name: 'Marcar como quitado' }),
    ).toBeDisabled()
  },
}

export const FixedViewReportsTheChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: /Todos os lançamentos/ }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: /^A receber/ }),
    )

    await expect(args.onViewChange).toHaveBeenCalledWith('receivable')
    await waitFor(() => expect(amountsOf(canvasElement, 'out')).toHaveLength(0))
  },
}
