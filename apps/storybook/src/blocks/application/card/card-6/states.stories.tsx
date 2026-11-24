import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card6 } from '@tc96/blocks/application/card/card-6'
import { expect, fn, within } from 'storybook/test'
import { jobs } from '../fixtures/card-6.ts'

const meta = {
  args: {
    jobs,
    onApply: fn(),
    onSaveChange: fn(),
    saved: ['data'],
    onRetry: fn(),
  },
  component: Card6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card6/States',
} satisfies Meta<typeof Card6>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Vagas recomendadas' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando vagas'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as vagas'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { jobs: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma vaga recomendada'),
    ).toBeVisible()
  },
}
