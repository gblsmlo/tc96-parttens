import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ToolbarCanvas } from './toolbar-canvas.tsx'
import { toolbarControlArgs } from './toolbar-controls.ts'
import {
  ComposedToolbar,
  GroupToolbar,
  SearchFieldToolbar,
  SpreadsheetSettingsToolbar,
} from './toolbar-layouts.tsx'

const meta = {
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionToolbar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

const toolbarIn = (canvasElement: HTMLElement, name = 'Controles da coleção') =>
  within(within(canvasElement).getByRole('toolbar', { name }))

export const TaskViews: Story = {
  parameters: describe(
    `The saved views of a task list, on the [Default](?path=/story/patterns-collectiontoolbar-layouts--default) layout: the view switcher in \`left\`, with search, options and creation in its popover, and the view settings and the main action in \`right\`.`,
  ),
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      switcher={{ create: true, options: true, search: true }}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = toolbarIn(canvasElement)
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
  parameters: describe(
    `The header of a task list with no saved views, on the [Default](?path=/story/patterns-collectiontoolbar-layouts--default) layout: a heading with its description in \`left\`, the settings and the action in \`right\`.`,
  ),
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      ariaLabel="Controles das tarefas"
      left="heading"
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
    await expect(
      canvas.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible()
  },
}

export const ContactsSearch: Story = {
  parameters: describe(
    `A contact list searched by name, on the [Default](?path=/story/patterns-collectiontoolbar-layouts--default) layout: the search field in \`left\`, the sort and type filter and the action in \`right\`.`,
  ),
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

export const TasksSearchAtCenter: Story = {
  parameters: describe(
    `A task list whose search stays centered, on the [Left Center Right](?path=/story/patterns-collectiontoolbar-layouts--left-center-right) layout: the view switcher in \`left\`, the search field in \`center\` and the settings and the action in \`right\`.`,
  ),
  render: () => <ComposedToolbar {...toolbarControlArgs} center="search" />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarIn(canvasElement)
    await expect(
      toolbar.getByRole('searchbox', { name: 'Buscar tarefas' }),
    ).toBeVisible()
    await expect(
      toolbar.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    ).toBeVisible()
  },
}

export const DeadlineShortcuts: Story = {
  parameters: describe(
    `Deadline shortcuts over a task list, on the [Default](?path=/story/patterns-collectiontoolbar-layouts--default) layout: a named group of buttons in \`left\` and the action in \`right\`.`,
  ),
  render: () => <GroupToolbar />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarIn(canvasElement)
    await expect(
      toolbar.getByRole('group', { name: 'Atalhos de prazo' }),
    ).toBeVisible()
    await expect(toolbar.getByRole('button', { name: 'Hoje' })).toBeVisible()
  },
}

export const SpreadsheetModes: Story = {
  parameters: describe(
    `A spreadsheet that switches between data table, data grid and kanban, on the [Right Side](?path=/story/patterns-collectiontoolbar-layouts--right-side) layout: only the view settings, with the three modes and the density.`,
  ),
  render: () => <SpreadsheetSettingsToolbar />,
  play: async ({ canvasElement }) => {
    await expect(
      toolbarIn(canvasElement).getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
  },
}
