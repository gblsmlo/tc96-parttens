import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowRunCard } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  component: FlowRunCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Run Card',
} satisfies Meta<typeof FlowRunCard>

export default meta
type Story = StoryObj<typeof meta>

export const StatusAndProgress: Story = {
  args: {
    run: {
      completed: 2,
      note: 'Enviar e-mail falhou',
      status: 'failed',
      total: 4,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Última execução' }),
    ).toBeVisible()
    await expect(canvas.getByText('Falhou')).toBeVisible()
    await expect(canvas.getByText('Enviar e-mail falhou')).toBeVisible()
    await expect(
      canvas.getByRole('progressbar', { name: 'Última execução: 50%' }),
    ).toBeInTheDocument()
  },
}

export const DescribesCompletedSteps: Story = {
  args: { run: { completed: 3, status: 'success', total: 3 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('3 de 3 passos concluídos')).toBeVisible()
    await expect(
      canvas.getByRole('progressbar', { name: 'Última execução: 100%' }),
    ).toBeInTheDocument()
  },
}

export const ZeroProgressWithoutSteps: Story = {
  args: { run: { completed: 0, status: 'not-run', total: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não executada')).toBeVisible()
    await expect(
      canvas.getByRole('progressbar', { name: 'Última execução: 0%' }),
    ).toBeInTheDocument()
  },
}
