import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card4 } from '@tc96/blocks/application/card/card-4'
import { expect, fn, within } from 'storybook/test'
import { meetings } from '../fixtures/card-4.ts'

const meta = {
  args: { meetings, onJoin: fn(), onRetry: fn() },
  component: Card4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card4/States',
} satisfies Meta<typeof Card4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Agenda de reuniões' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando reuniões'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as reuniões'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { meetings: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma reunião hoje'),
    ).toBeVisible()
  },
}
