import type { Meta, StoryObj } from '@storybook/react-vite'
import { List6, type List6Props } from '@tc96/ui/blocks/application/list/list-6'
import { expect, fn, userEvent, within } from 'storybook/test'
import { movers } from '../fixtures/list-6.ts'
import { type List6Controls, list6ControlArgs } from './list-6-controls.ts'
import { ComposedList6 } from './list-6-layouts.tsx'

const loaded: List6Props = { movers, onQueryChange: () => {}, query: '' }

const retry = fn()

const meta = {
  args: list6ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List6/Behavior',
} satisfies Meta<List6Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachRowShowsNameStatusPriceAndChange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('row')).toHaveLength(6)
    await expect(canvas.getByText('Aurora Energia')).toBeVisible()
    await expect(canvas.getByText('Atrasado')).toBeVisible()
    await expect(canvas.getByText('Suspenso')).toBeVisible()
    await expect(canvas.getByText(/R\$\s12,50/)).toBeVisible()
    await expect(canvas.getByText(/\+4,21%/)).toBeVisible()
  },
}

export const InitialsStandInForTheLogo: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('AE')).toBeVisible()
  },
}

export const CurrencyAndLocaleFormatThePrice: Story = {
  args: { currency: 'USD', locale: 'en-US' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('$38.42')).toBeVisible()
    await expect(canvas.getByText('+4.21%')).toBeVisible()
  },
}

export const ChangeCarriesTheTrend: Story = {
  play: async ({ canvasElement }) => {
    const count = (trend: string) =>
      canvasElement.querySelectorAll(`[data-trend="${trend}"]`).length
    await expect(count('up')).toBe(2)
    await expect(count('down')).toBe(2)
    await expect(count('flat')).toBe(1)
  },
}

const onQueryChange = fn()

export const TypingCallsOnQueryChange: Story = {
  render: () => (
    <List6 movers={movers} onQueryChange={onQueryChange} query="" />
  ),
  play: async ({ canvasElement }) => {
    onQueryChange.mockClear()
    await userEvent.type(
      within(canvasElement).getByRole('searchbox', { name: 'Buscar ativos' }),
      'a',
    )
    await expect(onQueryChange).toHaveBeenCalledWith('a')
  },
}

export const TheConsumerFiltersTheRows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar ativos' }),
      'delta',
    )
    await expect(canvas.getAllByRole('row')).toHaveLength(2)
    await expect(canvas.getByText('Delta Saúde')).toBeVisible()
  },
}

export const NoMatchShowsTheNoResultState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar ativos' }),
      'zzz',
    )
    await expect(canvas.getByText('Nenhum ativo encontrado')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(
      canvas.getByRole('searchbox', { name: 'Buscar ativos' }),
    ).toBeVisible()
  },
}

export const NoRowsShowsTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sem ativos')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List6
      labels={{
        columnPrice: 'Cotação',
        search: 'Filtrar',
        statuses: { delayed: 'Lento', halted: 'Parado', live: 'Aberto' },
      }}
      movers={movers}
      onQueryChange={() => {}}
      query=""
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('columnheader', { name: 'Cotação' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('searchbox', { name: 'Filtrar' }),
    ).toBeVisible()
    await expect(canvas.getByText('Parado')).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <List6 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando ativos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <List6 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os ativos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <List6 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <List6 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando ativos')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os ativos'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <List6 {...loaded} movers={[]} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os ativos'),
    ).toBeVisible()
    await expect(canvas.queryByText('Sem ativos')).toBeNull()
  },
}
