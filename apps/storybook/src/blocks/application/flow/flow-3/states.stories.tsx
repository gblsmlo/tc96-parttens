import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow3 } from '@tc96/ui/blocks/application/flow/flow-3'
import { expect, fn, within } from 'storybook/test'
import { connections, steps } from '../fixtures/flow-3.ts'

const meta = {
  args: {
    connections,
    onApprove: fn(),
    onReject: fn(),
    onReplay: fn(),
    onRetry: fn(),
    steps,
  },
  component: Flow3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow3/States',
} satisfies Meta<typeof Flow3>

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
