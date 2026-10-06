import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { resetPersistedMock } from '../fixtures/persisted-mock'
import { TasksUsage, viewModes } from '../fixtures/tasks-usage'

const meta = {
  argTypes: {
    defaultView: {
      control: 'inline-radio',
      options: viewModes.map((mode) => mode.value),
    },
    fetchDelay: { control: 'number' },
  },
  component: TasksUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'The tasks of an app launch as a navigable use case over one real collection.',
          'The `ViewSettingsMenu` switches between **List**, **Kanban**, **Calendar**, **Spreadsheet** (DataGrid) and **Table** (DataTable), and gathers grouping, calendar range, sorting, density, columns and filters by assignee and priority.',
          'Every edit goes back to the same collection and is saved in `localStorage`: tasks, saved views, filters and layout survive a reload. "Restaurar dados" brings the seed back.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Tasks',
} satisfies Meta<typeof TasksUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { fetchDelay: 200 },
  beforeEach: () => {
    if (import.meta.env.VITEST) resetPersistedMock()
  },
  parameters: {
    docs: {
      description: {
        story:
          'No scripted interaction. Every mount fakes a 200ms server fetch, so the active view shows its skeleton first. Edit, filter and save views, then reload to see the data come back.',
      },
    },
  },
}

export const Persistence: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'A status change in the Table is written to `localStorage`, and a fresh mount reads it back.',
      },
    },
  },
  args: { defaultView: 'datatable' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const row = canvas.getByText('Notificações push').closest('tr')
    if (!row) throw new Error('linha não montou')

    await userEvent.click(
      within(row).getByRole('combobox', { name: 'Status: Backlog' }),
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )

    await waitFor(() => {
      const stored = localStorage.getItem('tc96-parttens:mock:v1:tasks')
      expect(stored).toContain('"status":"review"')
    })
  },
}

export const SwitchViews: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Walks the five views through the `ViewSettingsMenu` tabs and checks that each one mounts over the same collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const views = [
      ['Kanban', 'kanban-view'],
      ['Calendário', 'calendar-view'],
      ['Planilha', 'data-grid'],
      ['Tabela', 'table-container'],
      ['Lista', 'list-view'],
    ] as const

    for (const [label, slot] of views) {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      await userEvent.click(
        await body.findByRole('menuitemradio', { name: label }),
      )
      await waitFor(() =>
        expect(
          canvasElement.querySelector(`[data-slot="${slot}"]`),
        ).not.toBeNull(),
      )
    }

    await expect(canvas.getByText('Implementar onboarding')).toBeInTheDocument()
  },
}

export const SharedEdits: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Changing the status in the Table rewrites the task in the shared collection.',
      },
    },
  },
  args: { defaultView: 'datatable' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const row = canvas.getByText('Notificações push').closest('tr')
    if (!row) throw new Error('linha não montou')

    await userEvent.click(
      within(row).getByRole('combobox', { name: 'Status: Backlog' }),
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Kanban' }),
    )
    const review = await canvas.findByRole('region', { name: /Em revisão/ })
    await expect(within(review).getByText('Notificações push')).toBeTruthy()
  },
}

export const Properties: Story = {
  beforeEach: resetPersistedMock,
  args: { defaultView: 'datagrid' },
  parameters: {
    docs: {
      description: {
        story:
          'In the Spreadsheet, every value column is a UI property, including the due date.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const grid = await waitFor(() => {
      const element = canvasElement.querySelector('[data-slot="data-grid"]')
      if (!(element instanceof HTMLElement)) throw new Error('grid não montou')
      return within(element)
    })

    for (const label of [
      /^Status:/,
      /^Prioridade:/,
      /^Responsável:/,
      /^Prazo/,
    ]) {
      await expect(grid.getAllByLabelText(label).length).toBeGreaterThan(0)
    }

    await userEvent.click(
      grid.getAllByLabelText(/^Responsável: Diego Rocha/)[0],
    )
    await userEvent.click(
      await body.findByRole('option', { name: /Carla Mendes/ }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Tabela' }),
    )
    const row = (await canvas.findByText('Code freeze da versão 2.0')).closest(
      'tr',
    )
    if (!row) throw new Error('linha não montou')
    await expect(within(row).getByText('Carla Mendes')).toBeTruthy()
  },
}

export const KanbanMoveWritesGroup: Story = {
  beforeEach: resetPersistedMock,
  args: { defaultView: 'kanban' },
  parameters: {
    docs: {
      description: {
        story:
          'Each grouping declares `setGroupId`, the write pair of `getGroupId`. A drop into another column makes the outlet build the updated item and hand it to `onItemChange`; the consumer only stores it. The card stays in the new column and the Table shows the new status.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const overlay = () =>
      canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')

    canvas.getByRole('button', { name: 'Mover card Notificações push' }).focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).toBeEmptyDOMElement())

    const todo = canvas.getByRole('region', { name: /A fazer/ })
    await waitFor(() =>
      expect(within(todo).getByText('Notificações push')).toBeTruthy(),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Tabela' }),
    )
    const row = (await canvas.findByText('Notificações push')).closest('tr')
    if (!row) throw new Error('row did not mount')
    await expect(
      within(row).getByRole('combobox', { name: 'Status: A fazer' }),
    ).toBeTruthy()
  },
}

export const SavePreset: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Filters and layout changed in Exibição are saved into the active view with Salvar preferência, or into a new view with Criar nova view.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    const save = await screen.findByRole('menuitem', {
      name: 'Salvar preferência',
    })
    await expect(save).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Kanban' }),
    )

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await expect(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('[Escape]')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Criar nova view' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Nova visão 1' }),
      ).toBeVisible(),
    )
  },
}

export const DeletePreset: Story = {
  beforeEach: resetPersistedMock,
  parameters: {
    docs: {
      description: {
        story:
          'Excluir removes the active view from the list and falls back to the first one.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Minhas tarefas' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Minhas tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Opções de Minhas tarefas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as tarefas' }),
    )
    const popover = within(await screen.findByRole('dialog'))
    await waitFor(() =>
      expect(popover.getByRole('button', { name: 'Em aberto' })).toBeVisible(),
    )
    await expect(
      popover.queryByRole('button', { name: 'Minhas tarefas' }),
    ).toBeNull()
  },
}
