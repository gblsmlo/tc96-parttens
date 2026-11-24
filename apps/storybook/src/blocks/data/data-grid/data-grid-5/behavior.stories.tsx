import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid5 } from '@tc96/ui/blocks/data/data-grid/data-grid-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { tasks } from '../fixtures/data-grid-5.ts'
import {
  type DataGrid5Controls,
  dataGrid5ControlArgs,
} from './data-grid-5-controls.ts'
import { ComposedDataGrid5 } from './data-grid-5-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...dataGrid5ControlArgs,
    onCreate: fn(),
    onExpandedChange: fn(),
    onRowAction: fn(),
    onShowSubtasksChange: fn(),
    onSortChange: fn(),
    onViewChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid5/Behavior',
} satisfies Meta<
  DataGrid5Controls & {
    onCreate: () => void
    onExpandedChange: () => void
    onRowAction: () => void
    onShowSubtasksChange: () => void
    onSortChange: () => void
    onViewChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="data-grid-row"]'),
  )

const firstTask = 'Concluir o handshake do registro para instalações privadas'

const openSettings = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Configurações' }),
  )
  return screen.findByRole('menu')
}

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Entrega de tarefas')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarSitsAboveTheTabs: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Controles das tarefas',
    })
    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('searchbox', { name: 'Buscar tarefas' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Configurações' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible()
    await expect(
      within(canvas.getByRole('tabpanel')).queryByRole('toolbar', {
        name: 'Controles das tarefas',
      }),
    ).toBeNull()
    await expect(
      toolbar.compareDocumentPosition(canvas.getByRole('tablist')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const HeaderShowsTitleSummaryAndCreate: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('16 tarefas / Subtarefas ativas'),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Nova tarefa' }))
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const TabsShowCountsAndReportTheView: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Todas 16' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tab', { name: 'Ativas 10' })).toBeVisible()
    await userEvent.click(canvas.getByRole('tab', { name: 'Backlog 4' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('backlog')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(4))
    await expect(canvas.getByRole('tabpanel')).toContainElement(
      canvas.getByRole('treegrid'),
    )
  },
}

export const AnExpandedParentShowsItsSubtasks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('treegrid', { name: 'Entrega de tarefas' })
    const rows = rowsOf(canvasElement)
    await expect(rows).toHaveLength(9)
    await expect(rows[0]).toHaveAttribute('aria-expanded', 'true')
    await expect(rows[1]).toHaveAttribute('aria-level', '2')
    await expect(grid.querySelectorAll('[aria-level="2"]')).toHaveLength(4)
  },
}

export const TheToggleCollapsesAndReports: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: `Recolher subtarefas de ${firstTask}`,
      }),
    )
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith({})
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(5))
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Expandir subtarefas de Ligar os selos de saúde do projeto à central de lançamento',
      }),
    )
    await expect(
      await canvas.findByText('Definir as faixas de saúde por projeto'),
    ).toBeVisible()
  },
}

export const LeafTasksHaveNoToggle: Story = {
  play: async ({ canvasElement }) => {
    const leaf = rowsOf(canvasElement).find((row) =>
      row.textContent?.includes(
        'Revisar a invalidação de sessão ao mudar papéis do workspace',
      ),
    ) as HTMLElement
    await expect(
      leaf.querySelector('[data-slot="data-grid-expand-toggle"]'),
    ).toBeNull()
    await expect(leaf).not.toHaveAttribute('aria-expanded')
  },
}

export const DoneTasksAreCheckedAndStruckThrough: Story = {
  play: async ({ canvasElement }) => {
    const done = rowsOf(canvasElement)[1] as HTMLElement
    await expect(done).toHaveTextContent('Concluída')
    await expect(
      done.querySelector('[data-slot="data-grid-5-task-title"]'),
    ).toHaveClass('line-through')
    await expect(done.querySelector('[data-done="true"]')).not.toBeNull()
    const open = rowsOf(canvasElement)[0] as HTMLElement
    await expect(
      open.querySelector('[data-slot="data-grid-5-task-title"]'),
    ).not.toHaveClass('line-through')
  },
}

export const EachRowShowsStatusAssigneePriorityAndProject: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(first).toHaveTextContent('Em andamento')
    await expect(first).toHaveTextContent('Marina Peres')
    await expect(first).toHaveTextContent('Urgente')
    await expect(first).toHaveTextContent('API de registro')
  },
}

export const PaginationCountsParentsAndResizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 16')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Linhas por página' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '10' }))
    await waitFor(() => expect(canvas.getByText('1–10 de 16')).toBeVisible())
    await expect(rowsOf(canvasElement)).toHaveLength(14)
  },
}

export const TheSwitchHidesSubtasksAndReports: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = await openSettings(canvasElement)
    const item = within(menu).getByRole('menuitemcheckbox', {
      name: 'Mostrar subtarefas',
    })
    await expect(item).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(item)
    await expect(args.onShowSubtasksChange).toHaveBeenCalledWith(false)
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(canvas.getByText('16 tarefas / Subtarefas ocultas')).toBeVisible(),
    )
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(5)
  },
}

export const SearchFiltersTheTasks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar tarefas' }),
      'faturas',
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Migrar as faturas antigas para o novo layout',
    )
  },
}

export const PriorityFilterNarrowsTheRows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = await openSettings(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Prioridade' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Baixa' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.getByText('1–4 de 4')).toBeVisible())
    for (const row of rowsOf(canvasElement)) {
      await expect(row).toHaveTextContent('Baixa')
    }
    await expect(
      canvas.getByRole('button', { name: 'Configurações (1)' }),
    ).toBeVisible()
  },
}

export const SortByReportsTheSort: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Ordenar por' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Prioridade: crescente' }),
    )
    await expect(args.onSortChange).toHaveBeenLastCalledWith({
      direction: 'asc',
      key: 'priority',
    })
    await waitFor(() =>
      expect(rowsOf(canvasElement)[0]).toHaveTextContent('Baixa'),
    )
  },
}

export const TheRowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Revisar a invalidação de sessão ao mudar papéis do workspace',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Arquivar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('archive', 'task-2')
  },
}

export const ControlsNeedTheirCallbacks: Story = {
  args: {
    create: false,
    rowActions: false,
    subtasksSwitch: false,
    views: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Nova tarefa' }),
    ).toBeNull()
    await expect(canvas.queryByRole('tablist')).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
    const menu = await openSettings(canvasElement)
    await expect(within(menu).queryByRole('menuitemcheckbox')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <DataGrid5
      labels={{
        columns: { task: 'Atividade' },
        settings: 'Ajustes',
        summary: (total) => `${total} atividades`,
        title: 'Fila do time',
      }}
      tasks={tasks}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Fila do time' }),
    ).toBeVisible()
    await expect(canvas.getByText('16 atividades')).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Atividade/ }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Ajustes' })).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <DataGrid5 pending tasks={tasks} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando tarefas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Configurações' }),
    ).toBeNull()
    await expect(canvas.queryByRole('treegrid')).toBeNull()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <DataGrid5 error onRetry={retry} tasks={tasks} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as tarefas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Entrega de tarefas' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('treegrid')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <DataGrid5 error tasks={tasks} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <DataGrid5 error pending tasks={tasks} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando tarefas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as tarefas'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <DataGrid5 error tasks={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as tarefas'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma tarefa para exibir.')).toBeNull()
  },
}
