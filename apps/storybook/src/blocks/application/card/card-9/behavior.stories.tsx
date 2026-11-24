import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card9 } from '@tc96/ui/blocks/application/card/card-9'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { delivery } from '../fixtures/card-9.ts'
import { type Card9Controls, card9ControlArgs } from './card-9-controls.ts'
import { ComposedCard9 } from './card-9-layouts.tsx'

const meta = {
  args: { ...card9ControlArgs, onActionSelect: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card9/Behavior',
} satisfies Meta<Card9Controls & { onActionSelect: (actionId: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const DetailsAreNamedByTheirLabels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Detalhes da entrega' }),
    ).toBeVisible()
    await expect(canvas.getByText('Endereço')).toBeInTheDocument()
    await expect(canvas.getByText(delivery.address)).toBeVisible()
    await expect(canvas.getByText('Casa')).toBeVisible()
    await expect(canvas.getByText('#BR-54321-SP')).toBeVisible()
    await expect(canvas.getByText('há 24 min')).toBeVisible()
  },
}

export const NotesAreHiddenWithoutNotes: Story = {
  args: { withNotes: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText('Observações da entrega'),
    ).toBeNull()
  },
}

export const MenuCallsOnActionSelect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Mais ações da entrega',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar rastreio' }),
    )
    await expect(args.onActionSelect).toHaveBeenCalledWith('copy')
  },
}

export const MenuIsHiddenWithoutActions: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const MissingDeliveryShowsSkeleton: Story = {
  render: () => <Card9 />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando entrega'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorShowsTheErrorSurface: Story = {
  render: () => <Card9 delivery={delivery} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar a entrega'),
    ).toBeVisible()
  },
}
