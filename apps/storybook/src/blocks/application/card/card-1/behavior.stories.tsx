import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card1, type Card1Props } from '@tc96/ui/blocks/application/card/card-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { facts } from '../fixtures/card-1.ts'
import { type Card1Controls, card1ControlArgs } from './card-1-controls.ts'
import { ComposedCard1 } from './card-1-layouts.tsx'

const loaded: Card1Props = { facts }

const retry = fn()

const meta = {
  args: card1ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card1/Behavior',
} satisfies Meta<Card1Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachFactShowsLabelAndValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Detalhes' })).toBeVisible()
    await expect(canvas.getByText('Responsável')).toBeVisible()
    await expect(canvas.getByText('Marina Costa')).toBeVisible()
    await expect(canvas.getByText('30 de janeiro de 2027')).toBeVisible()
  },
}

export const BadgeAccentShowsItsLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Em andamento')).toBeVisible()
  },
}

export const PeopleAccentIsNamedByTheFact: Story = {
  play: async ({ canvasElement }) => {
    const people = within(canvasElement).getByRole('list', { name: 'Equipe' })
    await expect(people).toBeVisible()
    await expect(people).toHaveTextContent('+1')
  },
}

export const IconAccentIsHiddenFromAssistiveTech: Story = {
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('[data-fact="review"]')
    await expect(tile?.querySelector('[aria-hidden="true"]')).not.toBeNull()
  },
}

export const FactWithoutAccentRendersOnlyTheValue: Story = {
  args: { accents: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="badge"]'),
    ).toHaveLength(0)
    await expect(within(canvasElement).queryByRole('list')).toBeNull()
  },
}

export const LabelsOverrideTheTitle: Story = {
  render: () => <Card1 facts={facts} labels={{ title: 'Resumo' }} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Resumo' }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card1 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando detalhes')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card1 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os detalhes'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Card1 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card1 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando detalhes')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os detalhes'),
    ).toBeNull()
  },
}
