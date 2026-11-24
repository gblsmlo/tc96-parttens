import type { Meta, StoryObj } from '@storybook/react-vite'
import { RunMonitor } from '@tc96/blocks/ai-agents/flow/run-monitor'
import { expect, fn, within } from 'storybook/test'
import { connections, steps } from '../fixtures/run-monitor.ts'

const meta = {
  args: {
    connections,
    onApprove: fn(),
    onReject: fn(),
    onReplay: fn(),
    onRetry: fn(),
    steps,
  },
  component: RunMonitor,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/RunMonitor/States',
} satisfies Meta<typeof RunMonitor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('group', {
        name: 'Compilar, Concluído',
      }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando execução'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar a execução'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { connections: [], steps: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum passo na execução'),
    ).toBeVisible()
  },
}
