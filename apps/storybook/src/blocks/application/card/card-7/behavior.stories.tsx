import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card7 } from '@tc96/blocks/application/card/card-7'
import { expect, fn, userEvent, within } from 'storybook/test'
import { contact, items, stats } from '../fixtures/card-7.tsx'
import { type Card7Controls, card7ControlArgs } from './card-7-controls.ts'
import { ComposedCard7 } from './card-7-layouts.tsx'

const retry = fn()

const meta = {
  args: { ...card7ControlArgs, onAction: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card7/Behavior',
} satisfies Meta<Card7Controls & { onAction: () => void }>

export default meta

type Story = StoryObj<typeof meta>

export const ContactShowsNameStatusAndEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Mara Alves' }),
    ).toBeVisible()
    await expect(canvas.getByText('Aberta a propostas')).toBeVisible()
    await expect(canvas.getByText('mara.alves@northline.com.br')).toBeVisible()
  },
}

export const StatsPairLabelAndValue: Story = {
  play: async ({ canvasElement }) => {
    const summary = within(canvasElement).getByLabelText('Resumo')
    await expect(within(summary).getAllByRole('term')).toHaveLength(
      stats.length,
    )
    await expect(within(summary).getByText('R$ 7,2 mi')).toBeVisible()
  },
}

export const ItemAmountsAreFormattedAsCurrency: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Negócios' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(
      items.length,
    )
    await expect(within(list).getByText(/^R\$\s7\.840\.000$/)).toBeVisible()
  },
}

export const ActionCallsOnAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar proposta' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

export const OptionalPartsAreHidden: Story = {
  args: {
    withAction: false,
    withItems: false,
    withStats: false,
    withStatus: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('list')).toBeNull()
    await expect(canvas.queryByLabelText('Resumo')).toBeNull()
    await expect(canvas.queryByText('Aberta a propostas')).toBeNull()
  },
}

export const MissingContactShowsSkeleton: Story = {
  render: () => <Card7 />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando contato'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card7 contact={contact} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card7 contact={contact} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contato')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar o contato'),
    ).toBeNull()
  },
}
