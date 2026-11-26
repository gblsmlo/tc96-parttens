import {
  ArrowsDownUpIcon,
  CalendarDotsIcon,
  CardsIcon,
  GridFourIcon,
  RadioButtonIcon,
  RowsIcon,
  SignpostIcon,
  TableIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { MenuItem } from '@tc96/ui/menu'
import {
  type CollectionDataTableViewProps,
  type CollectionDefinition,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  type CollectionFrameHeight,
  CollectionFrameOverlay,
  type CollectionGroup,
  type CollectionKanbanCardMove,
  type CollectionKanbanColumnState,
  type CollectionLayout,
  CollectionLayoutOutlet,
  type CollectionPreferences,
  type CollectionPreferencesChangeDetails,
  CollectionProvider,
  type CollectionRecordChange,
  CollectionSearchField,
  CollectionToolbar,
  FilterCheckboxSubmenu,
  type FilterCheckboxSubmenuProps,
  FilterRadioSubmenu,
  SortRadioSubmenu,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettings,
  type ViewSettingsProps,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

interface Item {
  id: string
  status: 'done' | 'todo'
  title: string
}

const firstItem: Item = { id: 'a', status: 'todo', title: 'Primeiro item' }
const secondItem: Item = { id: 'b', status: 'done', title: 'Segundo item' }

const flatCollection = {
  getKey: (record: Item) => record.id,
  getLabel: (record: Item) => record.title,
  groupings: [],
  records: [firstItem],
}

const statusGrouping = {
  getGroupId: (record: Item) => record.status,
  id: 'status',
  label: 'Status',
  options: [
    { id: 'todo', label: 'A fazer' },
    { id: 'done', label: 'Concluído' },
  ],
  setGroupId: (record: Item, groupId: string | null): Item =>
    groupId === 'todo' || groupId === 'done'
      ? { ...record, status: groupId }
      : record,
}

const groupedCollection = {
  ...flatCollection,
  groupings: [statusGrouping],
}

const boardCollection = {
  ...groupedCollection,
  records: [firstItem, secondItem],
}

const renderTitle = (record: Item) => record.title

interface BehaviorArgs {
  onClearFilters: () => void
  onCommit: (value: string) => void
  onModeChange: (mode: string) => void
  onRecordMove: (move: CollectionKanbanCardMove<Item>) => boolean
  onPageChange: (page: number) => void
  onPreferencesChange: (
    preferences: CollectionPreferences,
    details: CollectionPreferencesChangeDetails,
  ) => void
  onRecordChange: (change: CollectionRecordChange<Item>) => boolean
  onRowOpen: NonNullable<CollectionDataTableViewProps<Item>['onRowOpen']>
  onSavePreference: () => void
  onValueChange: (value: string) => void
  onValuesChange: (value: string[]) => void
}

const meta = {
  args: {
    onClearFilters: fn(),
    onCommit: fn(),
    onModeChange: fn(),
    onRecordMove: fn(() => true),
    onPageChange: fn(),
    onPreferencesChange: fn(),
    onRecordChange: fn(() => true),
    onRowOpen: fn(),
    onSavePreference: fn(),
    onValueChange: fn(),
    onValuesChange: fn(),
  },
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

function Frame({ height }: Readonly<{ height?: CollectionFrameHeight }>) {
  return (
    <div className="flex h-64 flex-col">
      <CollectionFrame height={height}>
        <CollectionFrameHeader>Toolbar</CollectionFrameHeader>
        <CollectionFrameBody aria-label="Tarefas">
          Registros
        </CollectionFrameBody>
        <CollectionFrameFooter>
          Paginação
          <CollectionFrameOverlay>Ações</CollectionFrameOverlay>
        </CollectionFrameFooter>
      </CollectionFrame>
    </div>
  )
}

export const FillScrollsTheBody: Story = {
  render: () => <Frame />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = canvas.getByRole('region', { name: 'Tarefas' })

    await expect(getComputedStyle(body).overflowY).toBe('auto')
    await expect(
      getComputedStyle(canvas.getByText('Paginação')).position,
    ).not.toBe('sticky')
  },
}

export const ContentKeepsTheFooterSticky: Story = {
  render: () => <Frame height="content" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = canvas.getByRole('region', { name: 'Tarefas' })

    await expect(getComputedStyle(body).overflowY).toBe('visible')
    await expect(getComputedStyle(canvas.getByText('Paginação')).position).toBe(
      'sticky',
    )
  },
}

export const OverlayFloatsAboveTheFooter: Story = {
  render: () => <Frame />,
  play: async ({ canvasElement }) => {
    const footer = layoutRoot(canvasElement, 'collection-frame-footer')
    const overlay = layoutRoot(canvasElement, 'collection-frame-overlay')
    const footerBox = footer.getBoundingClientRect()
    const overlayBox = overlay.getBoundingClientRect()

    await expect(Math.round(footerBox.top - overlayBox.bottom)).toBe(12)
    await expect(Math.round(overlayBox.width)).toBe(Math.round(footerBox.width))
    await expect(getComputedStyle(overlay).pointerEvents).toBe('none')
    await expect(
      getComputedStyle(within(canvasElement).getByText('Ações')).pointerEvents,
    ).toBe('auto')
  },
}

function SwitchableOutlet({
  layout,
  listLoading,
  loading,
  switcher = 'buttons',
}: Readonly<{
  layout: CollectionLayout
  listLoading?: boolean
  loading?: boolean
  switcher?: 'buttons' | 'tabs'
}>) {
  const { table } = useDataTable<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: groupedCollection.records,
    getRowId: (record) => record.id,
  })
  const { table: gridTable } = useDataGrid<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: groupedCollection.records,
    getRowId: (record) => record.id,
  })

  return (
    <CollectionProvider
      collection={groupedCollection}
      defaultPreferences={{ groupBy: 'status', layout }}
    >
      {switcher === 'tabs' ? <LayoutTabs /> : <LayoutButtons />}
      <CollectionLayoutOutlet
        calendar={{
          anchor: calendarAnchor,
          getRecordSchedule: () => null,
          mode: 'month',
          renderRecord: renderTitle,
          timeZone: 'UTC',
        }}
        collection={groupedCollection}
        datagrid={{ 'aria-label': 'Itens', table: gridTable }}
        datatable={{ 'aria-label': 'Itens', table }}
        loading={loading}
        {...(listLoading === undefined
          ? {}
          : { list: { loading: listLoading } })}
        renderGalleryRecord={renderTitle}
        renderKanbanRecord={renderTitle}
        renderListRecord={renderTitle}
      />
    </CollectionProvider>
  )
}

const calendarAnchor = new Date('2026-10-14T12:00:00.000Z')

const switchableLayouts = [
  { label: 'Tabela', layout: 'datatable' },
  { label: 'Lista', layout: 'list' },
  { label: 'Planilha', layout: 'datagrid' },
  { label: 'Galeria', layout: 'gallery' },
  { label: 'Kanban', layout: 'kanban' },
  { label: 'Calendário', layout: 'calendar' },
] as const satisfies readonly { label: string; layout: CollectionLayout }[]

function LayoutButtons() {
  const { preferences, setPreferences } = useCollectionPreferences()

  return (
    <div className="flex gap-2 p-2">
      {switchableLayouts.map(({ label, layout }) => (
        <Button
          aria-pressed={preferences.layout === layout}
          key={layout}
          onClick={() =>
            setPreferences((current) => ({ ...current, layout }), 'layout')
          }
          size="sm"
          variant="outline"
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

const layoutModes: readonly ViewSettingsMode<CollectionLayout>[] = [
  { icon: TableIcon, label: 'Tabela', value: 'datatable' },
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: TableIcon, label: 'Planilha', value: 'datagrid' },
  { icon: CardsIcon, label: 'Galeria', value: 'gallery' },
  { icon: GridFourIcon, label: 'Kanban', value: 'kanban' },
  { icon: CalendarDotsIcon, label: 'Calendário', value: 'calendar' },
]

function LayoutTabs() {
  const { preferences, setPreferences } = useCollectionPreferences()

  return (
    <CollectionToolbar
      right={
        <ViewSettings
          mode={preferences.layout}
          modes={layoutModes}
          onClearFilters={() => undefined}
          onModeChange={(layout) =>
            setPreferences((current) => ({ ...current, layout }), 'layout')
          }
        >
          <ViewSettingsSection label="Seção">
            <MenuItem>Item</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  )
}

const layoutSlots: readonly (readonly [string, string])[] = [
  ['Tabela', 'data-table'],
  ['Lista', 'list-view'],
  ['Planilha', 'data-grid'],
  ['Galeria', 'gallery-view'],
  ['Kanban', 'kanban-view'],
  ['Calendário', 'calendar-view'],
  ['Tabela', 'data-table'],
]

export const ModeTabsSwitchTheLayout: Story = {
  render: () => <SwitchableOutlet layout="datatable" switcher="tabs" />,
  play: async ({ canvasElement }) => {
    const slot = (name: string) =>
      canvasElement.querySelector(`[data-slot="${name}"]`)

    for (const [index, [nextLabel, nextSlot]] of layoutSlots.entries()) {
      if (index === 0) continue
      const [currentLabel, currentSlot] = layoutSlots[index - 1] ?? []
      if (!(currentLabel && currentSlot)) throw new Error('no previous layout')

      await userEvent.click(
        within(canvasElement).getByRole('button', { name: 'Exibição' }),
      )
      await expect(
        await screen.findByRole('menuitemradio', { name: currentLabel }),
      ).toHaveAttribute('aria-checked', 'true')
      await userEvent.click(
        screen.getByRole('menuitemradio', { name: nextLabel }),
      )
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
      await waitFor(() => expect(slot(nextSlot)).not.toBeNull())
      await expect(slot(currentSlot)).toBeNull()
    }
  },
}

const layoutRoot = (canvasElement: HTMLElement, slot: string) => {
  const root = canvasElement.querySelector(`[data-slot="${slot}"]`)
  if (!root) throw new Error(`Missing [data-slot="${slot}"]`)
  return root
}

function PreferencesReadout() {
  const { preferences } = useCollectionPreferences()

  return (
    <p className="p-2 text-sm">
      {`${preferences.layout} · ${preferences.groupBy ?? 'none'}`}
    </p>
  )
}

export const UncontrolledStartsOnKanban: Story = {
  render: () => (
    <CollectionProvider collection={groupedCollection}>
      <PreferencesReadout />
    </CollectionProvider>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('kanban · status'),
    ).toBeVisible()
  },
}

export const ForwardsTheReasonOfAChange: Story = {
  render: ({ onPreferencesChange }) => (
    <CollectionProvider
      collection={groupedCollection}
      defaultPreferences={{ layout: 'datatable' }}
      onPreferencesChange={onPreferencesChange}
    >
      <LayoutButtons />
      <PreferencesReadout />
    </CollectionProvider>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Lista' }))
    await expect(args.onPreferencesChange).toHaveBeenCalledOnce()
    await expect(args.onPreferencesChange).toHaveBeenLastCalledWith(
      { groupBy: 'status', layout: 'list' },
      { reason: 'layout' },
    )
    await expect(canvas.getByText('list · status')).toBeVisible()
  },
}

export const ControlledOnlyReports: Story = {
  render: ({ onPreferencesChange }) => (
    <CollectionProvider
      collection={groupedCollection}
      onPreferencesChange={onPreferencesChange}
      preferences={{ groupBy: null, layout: 'datatable' }}
    >
      <LayoutButtons />
      <PreferencesReadout />
    </CollectionProvider>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Kanban' }))
    await expect(args.onPreferencesChange).toHaveBeenCalledOnce()
    await expect(args.onPreferencesChange).toHaveBeenLastCalledWith(
      { groupBy: null, layout: 'kanban' },
      { reason: 'layout' },
    )
    await expect(canvas.getByText('datatable · none')).toBeVisible()
  },
}

export const MountsTheActiveLayout: Story = {
  render: () => <SwitchableOutlet layout="datatable" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      within(canvas.getByRole('table', { name: 'Itens' })).getByText(
        'Primeiro item',
      ),
    ).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Galeria' }))
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(
      within(
        layoutRoot(canvasElement, 'gallery-view') as HTMLElement,
      ).getByText('Primeiro item'),
    ).toBeVisible()
  },
}

function Outlet({
  onRowOpen,
  withListRenderer = true,
}: Readonly<{
  onRowOpen?: BehaviorArgs['onRowOpen']
  withListRenderer?: boolean
}>) {
  const { table } = useDataTable<Item>({
    columns: [{ accessorKey: 'title', header: 'Item' }],
    data: flatCollection.records,
    getRowId: (record) => record.id,
  })

  return (
    <CollectionProvider
      collection={flatCollection}
      defaultPreferences={{ groupBy: null, layout: 'datatable' }}
    >
      <CollectionLayoutOutlet
        collection={flatCollection}
        datatable={{ 'aria-label': 'Itens', onRowOpen, table }}
        {...(withListRenderer ? { renderListRecord: renderTitle } : {})}
      />
    </CollectionProvider>
  )
}

export const NeedsOnlyTheActiveLayoutProps: Story = {
  render: () => <Outlet withListRenderer={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Itens' }),
    ).toBeInTheDocument()
  },
}

export const ForwardsTheRowClick: Story = {
  render: ({ onRowOpen }) => <Outlet onRowOpen={onRowOpen} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Abrir registro' }),
    )

    await expect(args.onRowOpen).toHaveBeenCalledOnce()
    await expect(args.onRowOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'a', original: firstItem }),
    )
  },
}

export const LoadingReachesEveryLayout: Story = {
  render: () => <SwitchableOutlet layout="datatable" loading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('table', { name: 'Itens' })).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Lista' }))
    await expect(layoutRoot(canvasElement, 'list-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Kanban' }))
    await expect(layoutRoot(canvasElement, 'kanban-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Galeria' }))
    await expect(layoutRoot(canvasElement, 'gallery-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByText('Primeiro item')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Planilha' }))
    await expect(
      layoutRoot(canvasElement, 'data-grid').querySelector(
        '[aria-busy="true"]',
      ),
    ).not.toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Calendário' }))
    await expect(layoutRoot(canvasElement, 'calendar-view')).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}

export const LayoutLoadingWins: Story = {
  render: () => <SwitchableOutlet layout="list" listLoading={false} loading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(layoutRoot(canvasElement, 'list-view')).not.toHaveAttribute(
      'aria-busy',
    )
    await expect(canvas.getByText('Primeiro item')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Tabela' }))
    await expect(canvas.getByRole('table', { name: 'Itens' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  },
}

function Board({
  onRecordMove,
  onRecordChange,
}: Readonly<Partial<Pick<BehaviorArgs, 'onRecordMove' | 'onRecordChange'>>>) {
  return (
    <div className="flex h-96 flex-col">
      <CollectionProvider
        collection={boardCollection}
        defaultPreferences={{ groupBy: 'status', layout: 'kanban' }}
      >
        <CollectionLayoutOutlet
          collection={boardCollection}
          kanban={onRecordMove ? { onRecordMove } : undefined}
          onRecordChange={onRecordChange}
          renderKanbanRecord={renderTitle}
        />
      </CollectionProvider>
    </div>
  )
}

const swatches = [
  { label: 'Cinza', value: 'var(--color-slate-400)' },
  { label: 'Vermelho', value: 'var(--color-red-500)' },
]

function BoardWithColumnSettings() {
  const [states, setStates] = useState<
    Record<string, CollectionKanbanColumnState>
  >({})
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<readonly string[]>(
    [],
  )
  const update = (columnId: string, next: CollectionKanbanColumnState) =>
    setStates((current) => ({
      ...current,
      [columnId]: { ...current[columnId], ...next },
    }))

  return (
    <div className="flex h-96 flex-col">
      <CollectionProvider
        collection={boardCollection}
        defaultPreferences={{ groupBy: 'status', layout: 'kanban' }}
      >
        <CollectionLayoutOutlet
          collection={boardCollection}
          kanban={{
            collapsedGroupIds,
            getColumnState: (group) => states[group.id],
            getGroupActions: () => ({
              colorOptions: swatches,
              onColorChange: (columnId, color) => update(columnId, { color }),
            }),
            onCollapsedGroupIdsChange: setCollapsedGroupIds,
          }}
          renderKanbanRecord={renderTitle}
        />
      </CollectionProvider>
    </div>
  )
}

export const KanbanTakesTheGroupColorAndCollapsed: Story = {
  render: () => <BoardWithColumnSettings />,
  play: async ({ canvasElement }) => {
    const region = () =>
      within(canvasElement).getByRole('region', { name: /^A fazer/ })

    await userEvent.click(
      within(region()).getByRole('button', { name: /^Configurar seção/ }),
    )
    const marker = region().querySelector('header span[aria-hidden="true"]')
    await expect(
      marker ? getComputedStyle(marker).backgroundColor : 'missing',
    ).not.toBe('rgba(0, 0, 0, 0)')

    const settings = within(await screen.findByRole('dialog'))
    await expect(settings.getByRole('radio', { name: 'Cinza' })).toBeChecked()
    await expect(
      settings.getByRole('radio', { name: 'Vermelho' }),
    ).not.toBeChecked()
    await userEvent.click(settings.getByRole('radio', { name: 'Vermelho' }))
    await expect(
      settings.getByRole('radio', { name: 'Vermelho' }),
    ).toBeChecked()

    await userEvent.click(
      settings.getByRole('switch', { name: 'Recolher coluna' }),
    )
    await waitFor(() =>
      expect(region().closest('[data-slot="kanban-column"]')).toHaveAttribute(
        'data-collapsed',
        'true',
      ),
    )

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

const column = (canvasElement: HTMLElement, name: string) =>
  within(
    within(canvasElement).getByRole('region', {
      name: new RegExp(`^${name}`),
    }),
  )

export const KanbanMoveCallsOnRecordChange: Story = {
  render: ({ onRecordChange }) => <Board onRecordChange={onRecordChange} />,
  play: async ({ args, canvasElement }) => {
    within(canvasElement)
      .getByRole('button', { name: 'Mover card Primeiro item' })
      .focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await expect(args.onRecordChange).toHaveBeenCalledOnce()
    await expect(args.onRecordChange).toHaveBeenLastCalledWith({
      grouping: 'status',
      previousRecord: firstItem,
      reason: 'grouping',
      record: { ...firstItem, status: 'done' },
    })
  },
}

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

const center = (element: Element) => {
  const { height, left, top, width } = element.getBoundingClientRect()
  return { clientX: left + width / 2, clientY: top + height / 2 }
}

async function dragWithPointer(from: Element, to: Element) {
  const pointer = {
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelable: true,
    composed: true,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  }
  const start = center(from)
  const end = center(to)
  const steps = 12

  from.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, ...start }))
  for (let step = 1; step <= steps; step += 1) {
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        ...pointer,
        clientX: start.clientX + ((end.clientX - start.clientX) * step) / steps,
        clientY: start.clientY + ((end.clientY - start.clientY) * step) / steps,
      }),
    )
    await nextFrame()
    await nextFrame()
  }
  document.dispatchEvent(
    new PointerEvent('pointerup', { ...pointer, buttons: 0, ...end }),
  )
}

export const KanbanOnMoveCardWins: Story = {
  render: ({ onRecordMove, onRecordChange }) => (
    <Board onRecordMove={onRecordMove} onRecordChange={onRecordChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await dragWithPointer(
      column(canvasElement, 'A fazer').getByText('Primeiro item'),
      column(canvasElement, 'Concluído').getByText('Segundo item'),
    )
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await waitFor(() => expect(args.onRecordMove).toHaveBeenCalledOnce())
    await expect(args.onRecordMove).toHaveBeenLastCalledWith(
      expect.objectContaining({
        card: firstItem,
        sourceGroup: expect.objectContaining({ value: 'todo' }),
        targetGroup: expect.objectContaining({ value: 'done' }),
      }),
    )
    await expect(args.onRecordChange).not.toHaveBeenCalled()
  },
}

const preparedSource: CollectionDefinition<Item> = {
  getKey: (record) => record.id,
  getLabel: (record) => record.title,
  groupings: [],
  records: [{ id: 'ignored', status: 'todo', title: 'Ignored source item' }],
}

const preparedGroups: CollectionGroup<Item>[] = [
  {
    count: 0,
    grouping: 'external',
    id: 'empty-id',
    label: 'Empty prepared group',
    records: [],
    value: null,
  },
  {
    count: 900,
    grouping: 'external',
    id: 'stable-id',
    label: 'Prepared group',
    records: [{ id: 'prepared', status: 'todo', title: 'Prepared item' }],
    value: 'external',
  },
  {
    count: 1,
    grouping: 'external',
    id: 'another-id',
    label: 'Another prepared group',
    records: [{ id: 'another', status: 'done', title: 'Another item' }],
    value: 'another',
  },
]

const renderItem = (record: Item) => <span>{record.title}</span>

function PreparedOutlet({
  groupBy = null,
  groups = preparedGroups,
  layout,
}: Readonly<{
  groupBy?: string | null
  groups?: readonly CollectionGroup<Item>[]
  layout: CollectionLayout
}>) {
  return (
    <CollectionProvider
      collection={preparedSource}
      preferences={{ groupBy, layout }}
    >
      <CollectionLayoutOutlet
        collection={preparedSource}
        groups={groups}
        renderKanbanRecord={renderItem}
        renderListRecord={renderItem}
      />
    </CollectionProvider>
  )
}

export const OutletListUsesPreparedGroups: Story = {
  render: () => <PreparedOutlet groupBy="undeclared" layout="list" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labels = [
      'Empty prepared group',
      'Prepared group',
      'Another prepared group',
    ]
    const headings = labels.map((label) => canvas.getByText(label))

    for (const [index, heading] of headings.entries()) {
      const next = headings[index + 1]
      if (next)
        await expect(
          heading.compareDocumentPosition(next) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
    }
    await expect(canvas.getByText('Prepared item')).toBeInTheDocument()
    await expect(canvas.getByText('900')).toBeInTheDocument()
    await expect(canvas.queryByText('Ignored source item')).toBeNull()
  },
}

export const OutletEmptyGroupsNeverFallBack: Story = {
  render: () => <PreparedOutlet groups={[]} layout="list" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText('Ignored source item'),
    ).toBeNull()
  },
}

export const OutletKanbanUsesPreparedGroups: Story = {
  render: () => <PreparedOutlet layout="kanban" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText('Prepared item').length).toBeGreaterThan(0)
    await expect(canvas.queryByText('Ignored source item')).toBeNull()
  },
}

export const OutletPassesTheListEmptyMessage: Story = {
  render: () => {
    const emptyCollection = { ...preparedSource, records: [] as Item[] }

    return (
      <CollectionProvider
        collection={emptyCollection}
        preferences={{ groupBy: null, layout: 'list' }}
      >
        <CollectionLayoutOutlet
          collection={emptyCollection}
          list={{ emptyMessage: 'Nothing here yet.' }}
          renderListRecord={renderItem}
        />
      </CollectionProvider>
    )
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nothing here yet.'),
    ).toBeInTheDocument()
  },
}

const searchbox = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('searchbox', { name: 'Buscar contatos' })

export const SearchCommitsOnSubmit: Story = {
  render: ({ onCommit }) => (
    <CollectionToolbar
      left={
        <CollectionSearchField
          label="Buscar contatos"
          onCommit={onCommit}
          placeholder="Buscar contatos"
        />
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.type(searchbox(canvasElement), '  ana  ')
    await expect(args.onCommit).not.toHaveBeenCalled()

    await userEvent.keyboard('{Enter}')
    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('ana')
  },
}

export const SearchCommitsWhenEmptied: Story = {
  render: ({ onCommit }) => (
    <CollectionToolbar
      left={
        <CollectionSearchField
          label="Buscar contatos"
          onCommit={onCommit}
          placeholder="Buscar contatos"
          value="ana"
        />
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.clear(searchbox(canvasElement))
    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('')
  },
}

function ExternalSearchValue() {
  const [value, setValue] = useState('ana')

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setValue('bruno')}>
        Voltar para a busca salva
      </Button>
      <CollectionToolbar
        left={
          <CollectionSearchField
            label="Buscar contatos"
            onCommit={setValue}
            value={value}
          />
        }
      />
    </div>
  )
}

export const SearchDraftFollowsTheValue: Story = {
  render: () => <ExternalSearchValue />,
  play: async ({ canvasElement }) => {
    const field = searchbox(canvasElement)

    await expect(field).toHaveValue('ana')
    await userEvent.type(field, 'x', {
      initialSelectionEnd: 3,
      initialSelectionStart: 3,
    })
    await expect(field).toHaveValue('anax')

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Voltar para a busca salva',
      }),
    )
    await expect(field).toHaveValue('bruno')
  },
}

const filterOptions = [
  ['person', 'Pessoa'],
  ['organization', 'Organização'],
] as const

function FilterSubmenu({
  loading,
  onValueChange,
  value,
}: Readonly<{
  loading?: boolean
  onValueChange: (value: string) => void
  value?: string
}>) {
  return (
    <CollectionToolbar
      right={
        <ViewSettings onClearFilters={() => undefined}>
          <ViewSettingsSection label="Filtros">
            <FilterRadioSubmenu
              icon={RadioButtonIcon}
              label="Tipo"
              loading={loading}
              onValueChange={onValueChange}
              options={filterOptions}
              value={value}
            />
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  )
}

const openTypeSubmenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
}

export const FilterSubmenuMarksAndReturnsTheChoice: Story = {
  render: ({ onValueChange }) => (
    <FilterSubmenu onValueChange={onValueChange} value="person" />
  ),
  play: async ({ args, canvasElement }) => {
    await openTypeSubmenu(canvasElement)

    await expect(
      await screen.findByRole('menuitemradio', { name: 'Pessoa' }),
    ).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(
      screen.getByRole('menuitemradio', { name: 'Organização' }),
    )
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('organization')
    await closeMenus()
  },
}

export const FilterSubmenuMarksAllWithoutValue: Story = {
  render: ({ onValueChange }) => (
    <FilterSubmenu onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openTypeSubmenu(canvasElement)

    await expect(
      await screen.findByRole('menuitemradio', { name: 'Todos' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemradio', { name: 'Pessoa' }),
    ).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await closeMenus()
  },
}

export const FilterSubmenuAllReturnsEmptyString: Story = {
  render: ({ onValueChange }) => (
    <FilterSubmenu onValueChange={onValueChange} value="person" />
  ),
  play: async ({ args, canvasElement }) => {
    await openTypeSubmenu(canvasElement)

    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Todos' }),
    )
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('')
    await closeMenus()
  },
}

export const FilterSubmenuLoading: Story = {
  render: ({ onValueChange }) => (
    <FilterSubmenu loading onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openTypeSubmenu(canvasElement)

    const allOption = await screen.findByRole('menuitemradio', {
      name: 'Todos',
    })
    const submenu = allOption.closest('[role="menu"]') as HTMLElement
    await expect(submenu).toHaveAttribute('aria-busy', 'true')
    await expect(
      submenu.querySelectorAll('[data-slot="skeleton"]'),
    ).toHaveLength(3)
    await expect(within(submenu).getAllByRole('menuitemradio')).toEqual([
      allOption,
    ])

    await userEvent.click(allOption)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('')
    await closeMenus()
  },
}

const phaseOptions: FilterCheckboxSubmenuProps['options'] = [
  ['triage', 'Triagem'],
  {
    label: 'Conhecimento',
    options: [
      ['petition', 'Petição inicial'],
      ['hearing', 'Audiência'],
    ],
  },
  { label: 'Recursal', options: [['appeal', 'Apelação']] },
]

function PhaseFilterSubmenu({
  clearLabel,
  defaultValue = [],
  loading,
  onValueChange,
}: Readonly<{
  clearLabel?: string
  defaultValue?: readonly string[]
  loading?: boolean
  onValueChange: (value: string[]) => void
}>) {
  const [value, setValue] = useState(defaultValue)
  return (
    <CollectionToolbar
      right={
        <ViewSettings onClearFilters={() => undefined}>
          <ViewSettingsSection label="Filtros">
            <FilterCheckboxSubmenu
              clearLabel={clearLabel}
              icon={SignpostIcon}
              label="Fase"
              loading={loading}
              onValueChange={(next) => {
                onValueChange(next)
                setValue(next)
              }}
              options={phaseOptions}
              value={value}
            />
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  )
}

const openPhaseSubmenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  await userEvent.click(await screen.findByRole('menuitem', { name: 'Fase' }))
}

const phaseSubmenuOf = (item: HTMLElement) =>
  item.closest('[role="menu"]') as HTMLElement

export const CheckboxFilterTogglesWithoutClosing: Story = {
  render: ({ onValuesChange }) => (
    <PhaseFilterSubmenu onValueChange={onValuesChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openPhaseSubmenu(canvasElement)

    const triage = await screen.findByRole('menuitemcheckbox', {
      name: 'Triagem',
    })
    await userEvent.click(triage)
    await expect(args.onValuesChange).toHaveBeenLastCalledWith(['triage'])
    await expect(triage).toBeVisible()
    await expect(triage).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Apelação' }),
    )
    await expect(args.onValuesChange).toHaveBeenLastCalledWith([
      'triage',
      'appeal',
    ])

    await userEvent.click(triage)
    await expect(args.onValuesChange).toHaveBeenLastCalledWith(['appeal'])
    await expect(triage).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValuesChange).toHaveBeenCalledTimes(3)
    await closeMenus()
  },
}

export const CheckboxFilterAnnouncesTheGroups: Story = {
  render: ({ onValuesChange }) => (
    <PhaseFilterSubmenu onValueChange={onValuesChange} />
  ),
  play: async ({ canvasElement }) => {
    await openPhaseSubmenu(canvasElement)

    const knowledge = await screen.findByRole('group', {
      name: 'Conhecimento',
    })
    await expect(
      within(knowledge)
        .getAllByRole('menuitemcheckbox')
        .map((item) => item.textContent),
    ).toEqual(['Petição inicial', 'Audiência'])
    await expect(
      within(screen.getByRole('group', { name: 'Recursal' })).getByRole(
        'menuitemcheckbox',
        { name: 'Apelação' },
      ),
    ).toBeVisible()
    await expect(
      screen
        .getByRole('menuitemcheckbox', { name: 'Triagem' })
        .closest('[role="group"]'),
    ).toBeNull()
    await closeMenus()
  },
}

export const CheckboxFilterClearResets: Story = {
  render: ({ onValuesChange }) => (
    <PhaseFilterSubmenu
      clearLabel="Todas as fases"
      defaultValue={['triage', 'appeal']}
      onValueChange={onValuesChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await openPhaseSubmenu(canvasElement)

    const clear = await screen.findByRole('menuitemcheckbox', {
      name: 'Todas as fases',
    })
    await expect(clear).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(clear)
    await expect(args.onValuesChange).toHaveBeenCalledOnce()
    await expect(args.onValuesChange).toHaveBeenLastCalledWith([])
    await expect(clear).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Triagem' }),
    ).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(clear)
    await expect(args.onValuesChange).toHaveBeenCalledOnce()
    await expect(clear).toHaveAttribute('aria-checked', 'true')
    await closeMenus()
  },
}

export const CheckboxFilterHasNoClearWithoutLabel: Story = {
  render: ({ onValuesChange }) => (
    <PhaseFilterSubmenu onValueChange={onValuesChange} />
  ),
  play: async ({ canvasElement }) => {
    await openPhaseSubmenu(canvasElement)

    const triage = await screen.findByRole('menuitemcheckbox', {
      name: 'Triagem',
    })
    await expect(
      within(phaseSubmenuOf(triage))
        .getAllByRole('menuitemcheckbox')
        .map((item) => item.textContent),
    ).toEqual(['Triagem', 'Petição inicial', 'Audiência', 'Apelação'])
    await closeMenus()
  },
}

export const CheckboxFilterLoading: Story = {
  render: ({ onValuesChange }) => (
    <PhaseFilterSubmenu
      clearLabel="Todas as fases"
      loading
      onValueChange={onValuesChange}
    />
  ),
  play: async ({ canvasElement }) => {
    await openPhaseSubmenu(canvasElement)

    const clear = await screen.findByRole('menuitemcheckbox', {
      name: 'Todas as fases',
    })
    const submenu = phaseSubmenuOf(clear)
    await expect(submenu).toHaveAttribute('aria-busy', 'true')
    await expect(
      submenu.querySelectorAll('[data-slot="skeleton"]'),
    ).toHaveLength(3)
    await expect(within(submenu).getAllByRole('menuitemcheckbox')).toEqual([
      clear,
    ])
    await expect(within(submenu).queryByRole('group')).toBeNull()
    await closeMenus()
  },
}

const sortOptions = [
  ['fatal', 'Data fatal'],
  ['internal', 'Data interna'],
] as const

type DeadlineSort = (typeof sortOptions)[number][0]

function DeadlineSortSubmenu({
  onValueChange,
}: Readonly<{ onValueChange: (value: string) => void }>) {
  const [sort, setSort] = useState<DeadlineSort>('fatal')
  return (
    <CollectionToolbar
      right={
        <ViewSettings>
          <ViewSettingsSection label="Ordenar">
            <SortRadioSubmenu
              icon={ArrowsDownUpIcon}
              label="Ordenar por"
              onValueChange={(next) => {
                onValueChange(next)
                setSort(next)
              }}
              options={sortOptions}
              value={sort}
            />
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  )
}

const checkedSorts = (submenu: HTMLElement) =>
  within(submenu)
    .getAllByRole('menuitemradio')
    .filter((item) => item.getAttribute('aria-checked') === 'true')
    .map((item) => item.textContent)

export const SortSubmenuAlwaysHasAChoice: Story = {
  render: ({ onValueChange }) => (
    <DeadlineSortSubmenu onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Ordenar por' }),
    )

    const internal = await screen.findByRole('menuitemradio', {
      name: 'Data interna',
    })
    const submenu = internal.closest('[role="menu"]') as HTMLElement
    await expect(within(submenu).getAllByRole('menuitemradio')).toHaveLength(2)
    await expect(checkedSorts(submenu)).toEqual(['Data fatal'])

    await userEvent.click(internal)
    await expect(args.onValueChange).toHaveBeenLastCalledWith('internal')
    await waitFor(() => expect(checkedSorts(submenu)).toEqual(['Data interna']))

    await userEvent.click(internal)
    await expect(checkedSorts(submenu)).toEqual(['Data interna'])
    await expect(args.onValueChange).not.toHaveBeenCalledWith('')
    await closeMenus()
  },
}

const modesOf = (count: number): ViewSettingsMode[] =>
  Array.from({ length: count }, (_, index) => ({
    icon: GridFourIcon,
    label: `Modo ${index + 1}`,
    value: `mode-${index + 1}`,
  }))

const popupWidths = [
  ['Sem modos', 0, 20],
  ['Dois modos', 2, 20],
  ['Três modos', 3, 20],
  ['Quatro modos', 4, 24],
] as const

export const ModeTabCallsOnModeChange: Story = {
  render: ({ onModeChange }) => (
    <CollectionToolbar
      right={
        <ViewSettings
          mode="mode-1"
          modes={modesOf(2)}
          onClearFilters={() => undefined}
          onModeChange={onModeChange}
        >
          <ViewSettingsSection label="Seção">
            <MenuItem>Item</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Modo 1' }),
    ).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Modo 2' }))
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(args.onModeChange).toHaveBeenCalledOnce()
    await expect(args.onModeChange).toHaveBeenLastCalledWith('mode-2')
  },
}

export const PopupWidthFollowsTheModes: Story = {
  render: () => (
    <CollectionToolbar
      right={popupWidths.map(([label, count]) => (
        <ViewSettings
          key={label}
          label={label}
          mode="mode-1"
          modes={modesOf(count)}
          onClearFilters={() => undefined}
        >
          <ViewSettingsSection label="Seção">
            <MenuItem>Item</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
      ))}
    />
  ),
  play: async ({ canvasElement }) => {
    const rootPx = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    )

    for (const [label, , rem] of popupWidths) {
      await userEvent.click(
        within(canvasElement).getByRole('button', { name: label }),
      )
      const menu = await screen.findByRole('menu')
      await expect(menu.offsetWidth).toBe(rem * rootPx)
      await closeMenus()
    }
  },
}

function SettingsMenu(
  props: Readonly<
    Pick<
      ViewSettingsProps,
      | 'activeFilterCount'
      | 'onClearFilters'
      | 'onSavePreference'
      | 'savePreferenceDisabled'
    >
  >,
) {
  return (
    <CollectionToolbar
      right={
        <ViewSettings {...props}>
          <ViewSettingsSection label="Seção">
            <MenuItem>Item</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
      }
    />
  )
}

const openSettings = async (canvasElement: HTMLElement, name = 'Exibição') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  await screen.findByRole('menu')
}

export const ClearIsDisabledWithoutFilters: Story = {
  render: () => <SettingsMenu onClearFilters={() => undefined} />,
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
    await expect(
      screen.getByRole('menuitem', { name: 'Limpar filtros' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await closeMenus()
  },
}

export const ClearCallsOnClearFilters: Story = {
  render: ({ onClearFilters }) => (
    <SettingsMenu activeFilterCount={2} onClearFilters={onClearFilters} />
  ),
  play: async ({ args, canvasElement }) => {
    await openSettings(canvasElement, 'Exibição (2)')
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onClearFilters).toHaveBeenCalledOnce()
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenus()
  },
}

export const SaveIsAbsentWithoutHandler: Story = {
  render: () => <SettingsMenu onClearFilters={() => undefined} />,
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
    await expect(
      screen.getByRole('menuitem', { name: 'Limpar filtros' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('menuitem', { name: 'Salvar preferência' }),
    ).toBeNull()
    await closeMenus()
  },
}

export const SaveIsDisabledByItsProp: Story = {
  render: () => (
    <SettingsMenu
      onClearFilters={() => undefined}
      onSavePreference={() => undefined}
      savePreferenceDisabled
    />
  ),
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
    await expect(
      screen.getByRole('menuitem', { name: 'Salvar preferência' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await closeMenus()
  },
}

export const SaveCallsOnSavePreference: Story = {
  render: ({ onSavePreference }) => (
    <SettingsMenu
      onClearFilters={() => undefined}
      onSavePreference={onSavePreference}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await openSettings(canvasElement)
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
  },
}
