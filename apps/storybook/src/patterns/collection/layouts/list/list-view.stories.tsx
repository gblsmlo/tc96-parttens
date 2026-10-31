import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListView } from '@tc96/parttens'
import { useCallback, useMemo, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

interface Item {
  id: string
  statusId: string
  title: string
}

const groupings = [
  {
    getGroupId: (item: Item) => item.statusId,
    id: 'status',
    label: 'Status',
    options: [
      { id: 'todo', label: 'Todo' },
      { id: 'done', label: 'Done' },
    ],
  },
]

const todoOnlyGroupings = [
  { ...groupings[0], options: [{ id: 'todo', label: 'Todo' }] },
]

const collectionOf = (records: readonly Item[]) => ({
  getKey: (item: Item) => item.id,
  getLabel: (item: Item) => item.title,
  groupings,
  records: [...records],
})

const itemA: Item = { id: 'a', statusId: 'todo', title: 'A' }
const itemB: Item = { id: 'b', statusId: 'todo', title: 'B' }
const itemC: Item = { id: 'c', statusId: 'done', title: 'C' }
const itemD: Item = { id: 'd', statusId: 'done', title: 'D' }
const baseItems = [itemA, itemB, itemC, itemD]
const baseCollection = collectionOf(baseItems)

const renderSpy = fn((item: Item) => <p>{item.title}</p>)
const onCollapsedGroupIdsChange = fn()

const renderStable = (item: Item) => {
  renderSpy(item)
  return <p>{item.title}</p>
}

const renderedIds = () =>
  [...new Set(renderSpy.mock.calls.map(([item]) => item.id))].sort()

const renderTitle = (item: Item) => <span>{item.title}</span>

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/List/View',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function RerenderHarness({
  grouping,
}: Readonly<{ grouping: 'status' | null }>) {
  const [items, setItems] = useState(baseItems)
  const [prefix, setPrefix] = useState('')
  const [ticks, setTicks] = useState(0)
  const collection = useMemo(() => collectionOf(items), [items])
  const renderRecord = useCallback(
    (item: Item) => {
      renderSpy(item)
      return <p>{`${prefix}${item.title}`}</p>
    },
    [prefix],
  )

  return (
    <div className="min-w-0 p-4">
      <p className="text-muted-foreground text-sm">
        Atualizações do pai: {ticks}
      </p>
      <div className="flex gap-2 py-2">
        <button onClick={() => setTicks((count) => count + 1)} type="button">
          Atualizar pai
        </button>
        <button onClick={() => setPrefix('next ')} type="button">
          Trocar renderização
        </button>
        <button
          onClick={() =>
            setItems((current) =>
              current.map((item) =>
                item.id === 'c' ? { ...item, title: 'C renamed' } : item,
              ),
            )
          }
          type="button"
        >
          Renomear C
        </button>
      </div>
      <ListView<Item>
        collection={collection}
        grouping={grouping}
        renderRecord={renderRecord}
      />
    </div>
  )
}

function ReopenHarness() {
  const [hasDoneItem, setHasDoneItem] = useState(false)
  const collection = collectionOf(
    hasDoneItem
      ? [{ id: 'item-1', statusId: 'done', title: 'First item' }]
      : [],
  )

  return (
    <div className="min-w-0 p-4">
      <button onClick={() => setHasDoneItem(true)} type="button">
        Adicionar item
      </button>
      <ListView<Item>
        collapseEmptyGroups
        collection={collection}
        grouping="status"
        renderRecord={renderTitle}
      />
    </div>
  )
}

function ControlledCollapseHarness() {
  const [collapsedGroupIds, setCollapsedGroupIds] = useState(['status:todo'])

  return (
    <div className="min-w-0 p-4">
      <button onClick={() => setCollapsedGroupIds([])} type="button">
        Expandir todos
      </button>
      <ListView<Item>
        collapsedGroupIds={collapsedGroupIds}
        collection={baseCollection}
        grouping="status"
        onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
        renderRecord={renderStable}
      />
    </div>
  )
}

async function expectItemsSkipOnParentRerender(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await canvas.findByText('A')
  renderSpy.mockClear()
  await userEvent.click(canvas.getByRole('button', { name: 'Atualizar pai' }))
  await canvas.findByText('Atualizações do pai: 1')
  await expect(renderSpy).not.toHaveBeenCalled()
}

async function expectItemsRerenderOnRenderChange(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await canvas.findByText('A')
  renderSpy.mockClear()
  await userEvent.click(
    canvas.getByRole('button', { name: 'Trocar renderização' }),
  )
  await canvas.findByText('next A')
  await expect(renderedIds()).toEqual(['a', 'b', 'c', 'd'])
  await expect(canvas.getByText('next D')).toBeVisible()
}

async function expectOnlyReplacedItemRerenders(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await canvas.findByText('C')
  renderSpy.mockClear()
  await userEvent.click(canvas.getByRole('button', { name: 'Renomear C' }))
  await canvas.findByText('C renamed')
  await expect(renderedIds()).toEqual(['c'])
  await expect(canvas.getByText('A')).toBeVisible()
}

async function expectItemOrderKept(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await canvas.findByText('A')
  await expect(
    canvas.getAllByText(/^[ABCD]$/).map((node) => node.textContent),
  ).toEqual(['A', 'B', 'C', 'D'])
}

export const LoadingGroupSkeletons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="list-view"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando item da coleção' }),
    ).toHaveLength(2)
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-group"]'),
    ).toHaveLength(2)
    await expect(canvas.queryByText('No items in this group.')).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([])}
        grouping="status"
        loading
        loadingRecordLabel="Carregando item da coleção"
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const GroupMetadata: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Status: Todo' }),
    ).toBeVisible()
    await expect(canvas.getByText('1')).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={{
          ...collectionOf([
            { id: 'item-1', statusId: 'todo', title: 'First item' },
          ]),
          groupings: todoOnlyGroupings,
        }}
        grouping="status"
        renderGroupTitle={(group) => <span>Status: {group.label}</span>}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatOrder: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-group"]'),
    ).toHaveLength(0)
    await expect(
      canvas.getAllByText(/item$/).map((node) => node.textContent),
    ).toEqual(['First item', 'Second item'])
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([
          { id: 'item-1', statusId: 'done', title: 'First item' },
          { id: 'item-2', statusId: 'todo', title: 'Second item' },
        ])}
        grouping={null}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatEmptyMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum contato para exibir.')).toBeVisible()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-item"]'),
    ).toHaveLength(0)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([])}
        emptyMessage="Nenhum contato para exibir."
        grouping={null}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatDefaultEmptyMessage: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('No items to show.'),
    ).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([])}
        grouping={null}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatHidesEmptyMessageWhileLoading: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText('No items to show.'),
    ).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([])}
        grouping={null}
        loading
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatHidesEmptyMessageWithItems: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('First item')).toBeVisible()
    await expect(canvas.queryByText('No items to show.')).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([
          { id: 'item-1', statusId: 'done', title: 'First item' },
        ])}
        grouping={null}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatLoadingSkeletonCount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="list-view"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando item da coleção' }),
    ).toHaveLength(3)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={collectionOf([])}
        grouping={null}
        loading
        loadingRecordCount={3}
        loadingRecordLabel="Carregando item da coleção"
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const CollapseEmptyGroupsStartsClosed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Collapse Todo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Expand Done' }),
    ).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collapseEmptyGroups
        collection={collectionOf([itemA])}
        grouping="status"
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const CollapseEmptyGroupsKeepsLoadingOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Collapse Todo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Collapse Done' }),
    ).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collapseEmptyGroups
        collection={collectionOf([])}
        grouping="status"
        loading
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const CollapseEmptyGroupsManualChoice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Done' }))
    await expect(
      canvas.getByRole('button', { name: 'Collapse Done' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Todo' }))
    await expect(
      canvas.getByRole('button', { name: 'Expand Todo' }),
    ).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collapseEmptyGroups
        collection={collectionOf([itemA])}
        grouping="status"
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const CollapseEmptyGroupsReopensWhenItemsArrive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Expand Done' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar item' }),
    )
    await canvas.findByRole('button', { name: 'Collapse Done' })
    await expect(canvas.getByText('First item')).toBeVisible()
  },
  render: () => <ReopenHarness />,
}

export const CollapseEmptyGroupsReportsIds: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onCollapsedGroupIdsChange.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Todo' }))
    await expect(onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:todo',
      'status:done',
    ])
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collapseEmptyGroups
        collection={collectionOf([itemA])}
        grouping="status"
        onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
        renderRecord={renderTitle}
      />
    </div>
  ),
}

export const FlatSkipsStableItems: Story = {
  play: async ({ canvasElement }) => {
    await expectItemsSkipOnParentRerender(canvasElement)
  },
  render: () => <RerenderHarness grouping={null} />,
}

export const GroupedSkipsStableItems: Story = {
  play: async ({ canvasElement }) => {
    await expectItemsSkipOnParentRerender(canvasElement)
  },
  render: () => <RerenderHarness grouping="status" />,
}

export const FlatRerendersOnRenderChange: Story = {
  play: async ({ canvasElement }) => {
    await expectItemsRerenderOnRenderChange(canvasElement)
  },
  render: () => <RerenderHarness grouping={null} />,
}

export const GroupedRerendersOnRenderChange: Story = {
  play: async ({ canvasElement }) => {
    await expectItemsRerenderOnRenderChange(canvasElement)
  },
  render: () => <RerenderHarness grouping="status" />,
}

export const FlatRerendersReplacedItemOnly: Story = {
  play: async ({ canvasElement }) => {
    await expectOnlyReplacedItemRerenders(canvasElement)
  },
  render: () => <RerenderHarness grouping={null} />,
}

export const GroupedRerendersReplacedItemOnly: Story = {
  play: async ({ canvasElement }) => {
    await expectOnlyReplacedItemRerenders(canvasElement)
  },
  render: () => <RerenderHarness grouping="status" />,
}

export const FlatKeepsItemOrder: Story = {
  play: async ({ canvasElement }) => {
    await expectItemOrderKept(canvasElement)
  },
  render: () => <RerenderHarness grouping={null} />,
}

export const GroupedKeepsItemOrder: Story = {
  play: async ({ canvasElement }) => {
    await expectItemOrderKept(canvasElement)
  },
  render: () => <RerenderHarness grouping="status" />,
}

export const GroupedCollapseRendersOnExpand: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('A')
    renderSpy.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Todo' }))
    await waitFor(() => expect(canvas.queryByText('A')).toBeNull())
    await expect(renderSpy).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Todo' }))
    await canvas.findByText('A')
    await expect(renderedIds()).toEqual(['a', 'b'])
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListView<Item>
        collection={baseCollection}
        grouping="status"
        renderRecord={renderStable}
      />
    </div>
  ),
}

export const GroupedControlledCollapse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('A')).toBeNull()
    await expect(canvas.getByText('C')).toBeVisible()
    onCollapsedGroupIdsChange.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Done' }))
    await expect(onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:todo',
      'status:done',
    ])
    await expect(canvas.getByText('C')).toBeVisible()
    renderSpy.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expandir todos' }),
    )
    await canvas.findByText('A')
    await expect(renderedIds()).toEqual(['a', 'b'])
  },
  render: () => <ControlledCollapseHarness />,
}
