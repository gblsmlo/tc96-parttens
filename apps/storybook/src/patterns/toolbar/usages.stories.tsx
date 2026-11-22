import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ToolbarCanvas } from './toolbar-canvas.tsx'
import { toolbarControlArgs } from './toolbar-controls.ts'
import { ComposedToolbar, SearchFieldToolbar } from './toolbar-layouts.tsx'

const meta = {
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskViews: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      switcherCreate
      switcherOptions
      switcherSearch
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(
      within(canvasElement).getByRole('toolbar', {
        name: 'Controles da coleção',
      }),
    )
    await expect(
      toolbar.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    ).toBeVisible()
    await expect(
      toolbar.getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
    await expect(
      toolbar.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible()
  },
}

export const TasksHeader: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      ariaLabel="Controles das tarefas"
      switcher={false}
      variant="text"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Tarefas' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Acompanhe e organize o trabalho da equipe.'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible()
  },
}

export const ContactsSearch: Story = {
  render: () => <SearchFieldToolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('searchbox', { name: 'Buscar contatos' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Novo contato' }),
    ).toBeVisible()
  },
}
