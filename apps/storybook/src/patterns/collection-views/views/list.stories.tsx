import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionGroupingId,
  type ListItemDensity,
  ListView,
  type ListViewProps,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'
import { renderTaskListRow, useTasks } from '../fixtures/task-renderers'
import { createCollection, initialTasks, type Task } from '../fixtures/tasks'

const TasksListView = ListView as (props: ListViewProps<Task>) => ReactElement

const listArgs = {
  collection: createCollection(initialTasks),
  grouping: 'status' as const,
  renderItem: renderTaskListRow(() => undefined),
}

function Example({
  collapseEmptyGroups = false,
  density = 'comfortable',
  emptyGroup = false,
  groupBy = 'status',
  loading = false,
  separated = false,
}: Readonly<{
  collapseEmptyGroups?: boolean
  density?: ListItemDensity
  emptyGroup?: boolean
  groupBy?: CollectionGroupingId | null
  loading?: boolean
  separated?: boolean
}>) {
  const { tasks, updateTask } = useTasks()
  const visibleTasks = emptyGroup ? tasks.slice(0, 1) : tasks

  return (
    <div className="min-w-0 p-4">
      <TasksListView
        collapseEmptyGroups={collapseEmptyGroups}
        collection={createCollection(loading ? [] : visibleTasks)}
        emptyGroupLabel="Nenhuma tarefa neste grupo."
        grouping={groupBy}
        loading={loading}
        loadingItemLabel="Carregando tarefa"
        renderGroupTitle={(group) => group.label}
        renderItem={renderTaskListRow(updateTask, density)}
        separated={separated}
      />
    </div>
  )
}

const meta = {
  args: listArgs,
  argTypes: { collapseEmptyGroups: booleanArgType, loading: booleanArgType },
  component: TasksListView,
  parameters: {
    docs: {
      description: {
        component:
          'Building Block de List. Documenta agrupamento, loading e composição sem fixtures ou regras de Tasks e Pipeline.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/List',
} satisfies Meta<typeof TasksListView>

export default meta

type Story = StoryObj<typeof meta>

export const GroupedByStatus: Story = {
  args: listArgs,
  play: async ({ canvasElement }) => {
    const contagem = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-group-count"]',
    )

    if (!contagem)
      throw new Error('A story não renderizou [data-slot="list-group-count"].')

    // Badge de contagem circular: quadrado com raio maior que a metade da aresta.
    const medida = contagem.getBoundingClientRect()

    await expect(medida.width).toBe(medida.height)
    await expect(
      Number.parseFloat(getComputedStyle(contagem).borderRadius),
    ).toBeGreaterThan(medida.height / 2)

    // O corpo da linha é quem absorve o espaço livre entre os controles das pontas.
    const corpo = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-item-body"]',
    )

    await expect(getComputedStyle(corpo as HTMLElement).flexGrow).toBe('1')
  },
  render: () => <Example />,
}
export const GroupedByAssignee: Story = {
  args: listArgs,
  render: () => <Example groupBy="assignee" />,
}

export const Ungrouped: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Sem dimensão (`grouping={null}`), a List lê a coleção na ordem que o consumer passou: nenhum cabeçalho, nenhum colapso, nenhuma contagem por grupo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="list-group"]'),
    ).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-item"]'),
    ).toHaveLength(initialTasks.length)
  },
  render: () => <Example groupBy={null} />,
}
export const Loading: Story = {
  args: listArgs,
  render: () => <Example loading />,
}

export const EmptyGroupsCollapsed: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Com `collapseEmptyGroups`, um grupo sem itens nasce fechado e o populado continua aberto. Abrir ou fechar manualmente passa a valer sobre o automático, e um grupo intocado reabre sozinho quando recebe item.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // O grupo populado segue aberto (oferece "Collapse"); o vazio nasce fechado.
    await expect(
      canvasElement.querySelector('[aria-label="Collapse Em andamento"]'),
    ).toBeTruthy()
    await expect(
      canvasElement.querySelector('[aria-label="Expand A fazer"]'),
    ).toBeTruthy()
  },
  render: () => <Example collapseEmptyGroups emptyGroup />,
}

export const Compact: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Densidade compacta: o ritmo vertical é do pattern, então a lista adensa sem o consumidor sobrepor padding.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector<HTMLElement>(
      '[data-slot="list-item"]',
    )

    if (!row) throw new Error('A story não renderizou [data-slot="list-item"].')

    await expect(row.dataset.density).toBe('compact')
    await expect(
      Number.parseFloat(getComputedStyle(row).paddingTop),
    ).toBeLessThan(6)
  },
  render: () => <Example density="compact" />,
}

export const Separated: Story = {
  args: listArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Com `separated`, um `Separator` discreto aparece entre as linhas, na lista plana e dentro de cada grupo, sem herdar a borda do container.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="separator"]').length,
    ).toBeGreaterThan(0)
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-item-title-trigger"]'),
    ).toHaveLength(initialTasks.length)
  },
  render: () => <Example groupBy={null} separated />,
}
