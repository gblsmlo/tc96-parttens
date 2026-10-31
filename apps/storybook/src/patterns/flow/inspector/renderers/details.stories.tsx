import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspectorDetails } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  args: {
    items: [
      { id: 'type', label: 'Tipo', value: 'Ação' },
      { id: 'name', label: 'Nome', value: 'Enviar mensagem' },
    ],
  },
  component: FlowInspectorDetails,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Renderers/Details',
} satisfies Meta<typeof FlowInspectorDetails>

export default meta
type Story = StoryObj<typeof meta>

export const ListsPairsInOrder: Story = {
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Detalhes',
    })
    await expect(
      within(section)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual(['Tipo', 'Nome'])
    await expect(within(section).getByText('Enviar mensagem')).toBeVisible()
  },
}

export const SkipsItemsWithoutValue: Story = {
  args: {
    items: [
      { id: 'type', label: 'Tipo', value: 'Ação' },
      { id: 'description', label: 'Descrição' },
      { id: 'inputs', label: 'Entradas', value: null },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Descrição')).toBeNull()
    await expect(canvas.queryByText('Entradas')).toBeNull()
    await expect(canvas.getByText('Tipo')).toBeVisible()
  },
}

export const OwnerWithInitialsFallback: Story = {
  args: {
    items: [
      { id: 'owner', label: 'Responsável', owner: { name: 'Ana Souza' } },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByText('AS')).toBeVisible()
  },
}

export const HeadingFromLabels: Story = {
  args: {
    items: [{ id: 'type', label: 'Type', value: 'Action' }],
    labels: { details: 'Details' },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Details' }),
    ).toBeVisible()
  },
}
