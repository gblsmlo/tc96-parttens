import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImpactMap } from '@tc96/blocks/ai-agents/flow/impact-map'
import { expect, fn, within } from 'storybook/test'
import { links, nodes } from '../fixtures/impact-map.ts'

const meta = {
  args: { links, nodes, onNodeSelect: fn(), onRetry: fn() },
  component: ImpactMap,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/ImpactMap/States',
} satisfies Meta<typeof ImpactMap>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Árvore de impacto' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando mapa de impacto'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar o mapa de impacto',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { links: [], nodes: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum nó no mapa'),
    ).toBeVisible()
  },
}
