import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard3 } from '@tc96/blocks/application/dashboard/dashboard-3'
import { expect, fn, within } from 'storybook/test'
import { crew, forecast, queue } from '../fixtures/dashboard-3.ts'

const meta = {
  args: { crew, forecast, onAction: fn(), onRetry: fn(), queue },
  component: Dashboard3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard3/States',
} satisfies Meta<typeof Dashboard3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Equipe do turno' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando cobertura das equipes'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar a cobertura'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { crew: [], forecast: [], queue: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma escala cadastrada'),
    ).toBeVisible()
  },
}
