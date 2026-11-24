import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline1 } from '@tc96/blocks/application/timeline/timeline-1'
import { expect, fn, within } from 'storybook/test'
import { events } from '../fixtures/timeline-1.ts'

const meta = {
  args: { events, onRetry: fn() },
  component: Timeline1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline1/States',
} satisfies Meta<typeof Timeline1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Atividades' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando atividades'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar as atividades',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { events: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma atividade ainda'),
    ).toBeVisible()
  },
}
