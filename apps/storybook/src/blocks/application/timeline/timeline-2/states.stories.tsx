import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline2 } from '@tc96/blocks/application/timeline/timeline-2'
import { expect, fn, within } from 'storybook/test'
import { releases } from '../fixtures/timeline-2.ts'

const meta = {
  args: { onRetry: fn(), releases },
  component: Timeline2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline2/States',
} satisfies Meta<typeof Timeline2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Histórico de versões' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando histórico de versões'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar o histórico de versões',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { releases: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma versão publicada'),
    ).toBeVisible()
  },
}
