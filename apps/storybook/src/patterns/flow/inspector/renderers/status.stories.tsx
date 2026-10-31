import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspectorStatus } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  component: FlowInspectorStatus,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Renderers/Status',
} satisfies Meta<typeof FlowInspectorStatus>

export default meta
type Story = StoryObj<typeof meta>

export const LastRunAndTestRuns: Story = {
  args: {
    durationMs: 1500,
    runId: 'run_1',
    stats: { completed: 6, entered: 8 },
    status: 'failed',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const last = canvas.getByRole('region', { name: 'Última execução' })
    await expect(within(last).getByText('Falhou')).toBeVisible()
    await expect(within(last).getByText('1,5 s')).toBeVisible()
    await expect(within(last).getByText('run_1')).toBeVisible()
    const tests = canvas.getByRole('region', { name: 'Execuções de teste' })
    await expect(within(tests).getByText('8')).toBeVisible()
    await expect(within(tests).getByText('6')).toBeVisible()
    await expect(within(tests).getByText('25%')).toBeVisible()
    await expect(
      canvas.queryByText('Nenhuma execução chegou a este passo.'),
    ).toBeNull()
  },
}

export const OnlyGroupsItReceives: Story = {
  args: { status: 'success' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Última execução' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('region', { name: 'Execuções de teste' }),
    ).toBeNull()
    await expect(canvas.queryByText('Duração')).toBeNull()
  },
}

export const NoRunReachedStep: Story = {
  args: { stats: { completed: 0, entered: 0 }, status: 'not-run' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma execução chegou a este passo.'),
    ).toBeVisible()
    await expect(canvas.getByText('—')).toBeVisible()
  },
}
