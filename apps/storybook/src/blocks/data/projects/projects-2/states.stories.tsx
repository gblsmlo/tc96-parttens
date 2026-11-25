import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects2 } from '@tc96/ui/blocks/data/projects/projects-2'
import { expect, fn, within } from 'storybook/test'
import { initialExpanded, tasks } from '../fixtures/projects-2.ts'

const meta = {
  args: { expanded: initialExpanded, onRetry: fn(), tasks },
  component: Projects2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects2/States',
} satisfies Meta<typeof Projects2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando tarefas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as tarefas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { tasks: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma tarefa para exibir.'),
    ).toBeVisible()
  },
}
