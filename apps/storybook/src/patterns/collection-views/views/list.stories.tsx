import {
  type CollectionDefinition,
  type CollectionGroupingId,
  ListItem,
  ListItemBody,
  type ListItemDensity,
  ListItemDescription,
  ListItemField,
  ListItemTitle,
  ListItemTitleTrigger,
  ListItemTrailing,
  ListView,
  type ListViewProps,
} from 'tc96/blocks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { expect } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

interface MechanicsItem {
  assigneeId: string
  description: string
  id: string
  statusId: string
  title: string
}

const items: MechanicsItem[] = [
  {
    assigneeId: 'person-a',
    description: 'A dense row with title and description.',
    id: 'item-1',
    statusId: 'todo',
    title: 'First item',
  },
  {
    assigneeId: 'person-b',
    description: 'A second row for grouping behavior.',
    id: 'item-2',
    statusId: 'in-progress',
    title: 'Second item',
  },
]

const collection: CollectionDefinition<MechanicsItem> = {
  getKey: (item) => item.id,
  getLabel: (item) => item.title,
  groupings: [
    {
      getGroupId: (item) => item.statusId,
      id: 'status',
      label: 'Status',
      options: [
        { id: 'todo', label: 'To do' },
        { id: 'in-progress', label: 'In progress' },
      ],
    },
    {
      getGroupId: (item) => item.assigneeId,
      id: 'assignee',
      label: 'Assignee',
      options: [
        { id: 'person-a', label: 'Person A' },
        { id: 'person-b', label: 'Person B' },
      ],
    },
  ],
  items,
}

const renderRow = (density: ListItemDensity) => (item: MechanicsItem) => (
  <ListItem density={density} key={item.id}>
    <ListItemBody>
      <ListItemTitle>
        <ListItemTitleTrigger>{item.title}</ListItemTitleTrigger>
      </ListItemTitle>
      <ListItemDescription>{item.description}</ListItemDescription>
    </ListItemBody>
    <ListItemTrailing>
      <ListItemField>{item.statusId}</ListItemField>
      <ListItemField always>{item.assigneeId}</ListItemField>
    </ListItemTrailing>
  </ListItem>
)

const listArgs = {
  collection,
  grouping: 'status' as const,
  renderItem: renderRow('comfortable'),
}

const MechanicsListView = ListView as (
  props: ListViewProps<MechanicsItem>,
) => ReactElement

function Example({
  collapseEmptyGroups = false,
  density = 'comfortable',
  emptyGroup = false,
  groupBy = 'status',
  loading = false,
}: Readonly<{
  collapseEmptyGroups?: boolean
  density?: ListItemDensity
  emptyGroup?: boolean
  groupBy?: CollectionGroupingId | null
  loading?: boolean
}>) {
  // Só a primeira opção recebe item: é o que deixa um grupo vazio ao lado de um
  // populado, sem introduzir vocabulário de domínio na fixture.
  const visibleItems = emptyGroup ? items.slice(0, 1) : items

  return (
    <div className="min-w-0 p-4">
      <ListView
        {...listArgs}
        collapseEmptyGroups={collapseEmptyGroups}
        collection={{ ...collection, items: loading ? [] : visibleItems }}
        emptyGroupLabel="No items in this group."
        grouping={groupBy}
        loading={loading}
        loadingItemLabel="Loading collection item"
        renderGroupTitle={(group) => group.label}
        renderItem={renderRow(density)}
      />
    </div>
  )
}

const meta = {
  args: listArgs,
  argTypes: { collapseEmptyGroups: booleanArgType, loading: booleanArgType },
  component: MechanicsListView,
  parameters: {
    docs: {
      description: {
        component:
          'Building Block de List. Documenta agrupamento, loading e composição sem fixtures ou regras de Tasks e Pipeline.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Collection Views/Views/List',
} satisfies Meta<typeof MechanicsListView>

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
    ).toHaveLength(2)
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
      canvasElement.querySelector('[aria-label="Collapse To do"]'),
    ).toBeTruthy()
    await expect(
      canvasElement.querySelector('[aria-label="Expand In progress"]'),
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
