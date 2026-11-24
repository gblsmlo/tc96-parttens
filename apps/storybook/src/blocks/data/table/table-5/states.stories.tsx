import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table5 } from '@tc96/ui/blocks/data/table/table-5'
import { expect, fn, within } from 'storybook/test'
import { initialExpanded, tasks } from '../fixtures/table-5.ts'

const meta = {
  args: { expanded: initialExpanded, onRetry: fn(), tasks },
  component: Table5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table5/States',
} satisfies Meta<typeof Table5>

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
