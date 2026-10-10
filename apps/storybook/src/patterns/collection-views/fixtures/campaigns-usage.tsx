import {
  ActionBar,
  type ActionBarGroup,
  type CollectionPreferences,
  CollectionProvider,
  CollectionToolbar,
  type CollectionViewMode,
  CollectionViewOutlet,
  DataGridColumnsSubmenu,
  DataGridDensitySubmenu,
  DataGridPagination,
  DataGridSortSubmenu,
  MenuCheckboxOption,
  MenuRadioOption,
  useCollectionPreferences,
  useDataGrid,
  useDataTable,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  CircleDotIcon,
  CirclePauseIcon,
  CirclePlayIcon,
  ListIcon,
  Rows3Icon,
  Table2Icon,
  TableIcon,
  TargetIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { SelectedViewPicker } from '../../shared/selected-view-picker'
import {
  campaignTableAggregations,
  campaignTableColumnLabels,
  createCampaignGridColumns,
  createCampaignTableColumns,
  renderCampaignListRow,
  type UpdateCampaign,
} from './campaign-fields'
import {
  type Campaign,
  type CampaignObjective,
  type CampaignStatus,
  campaignGroupings,
  createCampaignCollection,
  isLearning,
  objectiveOptions,
  initialCampaigns as seedCampaigns,
  statusOptions,
} from './campaigns'

export type CampaignViewMode = Extract<
  CollectionViewMode,
  'datagrid' | 'datatable' | 'list'
>

export const campaignViewModes: readonly ViewSettingsMode<CampaignViewMode>[] =
  [
    { icon: TableIcon, label: 'Tabela', value: 'datatable' },
    { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
    { icon: Rows3Icon, label: 'Lista', value: 'list' },
  ]

const isCampaignViewMode = (
  value: CollectionViewMode,
): value is CampaignViewMode =>
  campaignViewModes.some((mode) => mode.value === value)

type PresetScope = 'all' | 'active' | 'learning'

interface Preset {
  id: string
  label: string
  objectives: readonly CampaignObjective[]
  scope: PresetScope
  statuses: readonly CampaignStatus[]
  view: CollectionViewMode
}

type PresetSettings = Pick<Preset, 'objectives' | 'statuses' | 'view'>

const basePresets: readonly Pick<Preset, 'id' | 'label' | 'scope'>[] = [
  { id: 'all', label: 'Todas as campanhas', scope: 'all' },
  { id: 'active', label: 'Em veiculação', scope: 'active' },
  { id: 'learning', label: 'Em aprendizado', scope: 'learning' },
]

const createPresets = (view: CollectionViewMode): readonly Preset[] =>
  basePresets.map((preset) => ({
    ...preset,
    objectives: [],
    statuses: [],
    view,
  }))

const hasSameSettings = (a: PresetSettings, b: PresetSettings) =>
  a.view === b.view &&
  a.statuses.join() === b.statuses.join() &&
  a.objectives.join() === b.objectives.join()

const matchesScope = (campaign: Campaign, scope: PresetScope) => {
  if (scope === 'active') return campaign.status === 'active'
  if (scope === 'learning') return isLearning(campaign)
  return true
}

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

function CampaignsWorkspace({
  campaigns,
  loading,
  onCampaignsChange,
}: Readonly<{
  campaigns: readonly Campaign[]
  loading: boolean
  onCampaignsChange: (update: (current: Campaign[]) => Campaign[]) => void
}>): ReactElement {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [presets, setPresets] = useState(() => createPresets(preferences.view))
  const [presetId, setPresetId] = useState('all')
  const [statusFilter, setStatusFilter] = useState<readonly CampaignStatus[]>(
    [],
  )
  const [objectiveFilter, setObjectiveFilter] = useState<
    readonly CampaignObjective[]
  >([])

  const activePreset = presets.find(({ id }) => id === presetId) ?? presets[0]

  const updateCampaign = useCallback<UpdateCampaign>(
    (id, change) =>
      onCampaignsChange((current) =>
        current.map((campaign) =>
          campaign.id === id ? { ...campaign, ...change } : campaign,
        ),
      ),
    [onCampaignsChange],
  )

  const visibleCampaigns = useMemo(
    () =>
      campaigns.filter(
        (campaign) =>
          matchesScope(campaign, activePreset.scope) &&
          (statusFilter.length === 0 ||
            statusFilter.includes(campaign.status)) &&
          (objectiveFilter.length === 0 ||
            objectiveFilter.includes(campaign.objective)),
      ),
    [activePreset.scope, campaigns, objectiveFilter, statusFilter],
  )

  const collection = useMemo(
    () => createCampaignCollection(visibleCampaigns),
    [visibleCampaigns],
  )

  const grouping = campaignGroupings.find(
    ({ id }) => id === preferences.groupBy,
  )
  const tableRows = useMemo(() => {
    if (!grouping) return [...visibleCampaigns]
    const order = grouping.options.map((option) => option.id)
    const position = (campaign: Campaign) =>
      order.indexOf(grouping.getGroupId(campaign) ?? '')
    return [...visibleCampaigns].sort((a, b) => position(a) - position(b))
  }, [grouping, visibleCampaigns])

  const gridColumns = useMemo(
    () => createCampaignGridColumns(updateCampaign),
    [updateCampaign],
  )
  const { table: dataGridTable } = useDataGrid<Campaign>({
    columns: gridColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 8,
  })

  const tableColumns = useMemo(
    () => createCampaignTableColumns(updateCampaign),
    [updateCampaign],
  )
  const { table: dataTable } = useDataTable<Campaign>({
    columns: tableColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 8,
  })

  const groupRowLabel = (campaign: Campaign) => {
    if (!grouping) return null
    const groupId = grouping.getGroupId(campaign)
    return (
      grouping.options.find((option) => option.id === groupId)?.label ?? null
    )
  }

  const activeFilterCount = statusFilter.length + objectiveFilter.length
  const clearFilters = () => {
    setStatusFilter([])
    setObjectiveFilter([])
  }
  const view = preferences.view
  const currentSettings: PresetSettings = {
    objectives: objectiveFilter,
    statuses: statusFilter,
    view,
  }
  const presetModified = !hasSameSettings(currentSettings, activePreset)

  const selectPreset = (next: Preset) => {
    setPresetId(next.id)
    setStatusFilter(next.statuses)
    setObjectiveFilter(next.objectives)
    setPreferences((current) => ({ ...current, view: next.view }), 'view')
  }
  const savePreset = () =>
    setPresets((current) =>
      current.map((preset) =>
        preset.id === activePreset.id
          ? { ...preset, ...currentSettings }
          : preset,
      ),
    )
  const createPreset = () => {
    const newViews = presets.filter(({ label }) =>
      label.startsWith('Nova visão'),
    )
    const next: Preset = {
      ...currentSettings,
      id: `saved-${crypto.randomUUID()}`,
      label: `Nova visão ${newViews.length + 1}`,
      scope: activePreset.scope,
    }
    setPresets((current) => [...current, next])
    setPresetId(next.id)
  }
  const duplicatePreset = (id: string) => {
    const source = presets.find((preset) => preset.id === id)
    if (!source) return
    const copy: Preset = {
      ...source,
      id: `saved-${crypto.randomUUID()}`,
      label: `${source.label} (cópia)`,
    }
    setPresets((current) => [...current, copy])
    selectPreset(copy)
  }
  const deletePreset = (id: string) => {
    const remaining = presets.filter((preset) => preset.id !== id)
    setPresets(remaining)
    if (id === activePreset.id) selectPreset(remaining[0])
  }

  const setStatuses = (
    selectedIds: readonly string[],
    from: CampaignStatus,
    to: CampaignStatus,
  ) =>
    onCampaignsChange((current) =>
      current.map((campaign) =>
        selectedIds.includes(campaign.id) && campaign.status === from
          ? { ...campaign, status: to }
          : campaign,
      ),
    )

  const selectionActions = (
    selectedIds: readonly string[],
    clearSelection: () => void,
  ): ActionBarGroup<Campaign>[] => [
    {
      items: [
        {
          icon: <CirclePauseIcon />,
          label: 'Pausar',
          onSelect: () => {
            setStatuses(selectedIds, 'active', 'paused')
            clearSelection()
          },
        },
        {
          icon: <CirclePlayIcon />,
          label: 'Ativar',
          onSelect: () => {
            setStatuses(selectedIds, 'paused', 'active')
            clearSelection()
          },
        },
      ],
    },
    {
      items: [
        {
          icon: <Trash2Icon />,
          label: 'Excluir',
          onSelect: () => {
            onCampaignsChange((current) =>
              current.filter((campaign) => !selectedIds.includes(campaign.id)),
            )
            clearSelection()
          },
          variant: 'destructive',
        },
      ],
    },
  ]

  const dataTableSelection = dataTable
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="font-semibold text-2xl">Campanhas</h1>
          <p className="text-muted-foreground text-sm">
            Campanhas do Meta Ads no Facebook, Instagram, Messenger e Audience
            Network, com entrega, investimento e resultados.
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CollectionToolbar
          aria-label="Controles da coleção de campanhas"
          endSlot={
            <ViewSettingsMenu
              activeFilterCount={activeFilterCount}
              mode={isCampaignViewMode(view) ? view : 'datatable'}
              modes={campaignViewModes}
              onClearFilters={clearFilters}
              onSavePreference={savePreset}
              savePreferenceDisabled={!presetModified}
              onModeChange={(nextView) =>
                setPreferences(
                  (current) => ({ ...current, view: nextView }),
                  'view',
                )
              }
            >
              <ViewSettingsSection label="Exibição">
                {view === 'datatable' ? null : (
                  <MenuSub>
                    <MenuSubTrigger>
                      <ListIcon aria-hidden="true" />
                      Agrupar por
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuRadioGroup
                        onValueChange={(groupBy: string) =>
                          setPreferences(
                            (current) => ({
                              ...current,
                              groupBy: groupBy || null,
                            }),
                            'grouping',
                          )
                        }
                        value={preferences.groupBy ?? ''}
                      >
                        <MenuRadioOption value="">
                          Sem agrupamento
                        </MenuRadioOption>
                        {campaignGroupings.map((dimension) => (
                          <MenuRadioOption
                            key={dimension.id}
                            value={dimension.id}
                          >
                            {dimension.label}
                          </MenuRadioOption>
                        ))}
                      </MenuRadioGroup>
                    </MenuSubPopup>
                  </MenuSub>
                )}
                {view === 'datagrid' ? (
                  <>
                    <DataGridSortSubmenu table={dataGridTable} />
                    <DataGridDensitySubmenu table={dataGridTable} />
                    <DataGridColumnsSubmenu table={dataGridTable} />
                  </>
                ) : null}
                {view === 'datatable' ? (
                  <MenuSub>
                    <MenuSubTrigger>
                      <Table2Icon aria-hidden="true" />
                      Colunas
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      {dataTable
                        .getAllLeafColumns()
                        .filter((column) => column.id !== 'select')
                        .map((column) => (
                          <MenuCheckboxOption
                            checked={column.getIsVisible()}
                            closeOnClick={false}
                            key={column.id}
                            onCheckedChange={(checked) =>
                              column.toggleVisibility(Boolean(checked))
                            }
                          >
                            {campaignTableColumnLabels[column.id] ?? column.id}
                          </MenuCheckboxOption>
                        ))}
                    </MenuSubPopup>
                  </MenuSub>
                ) : null}
              </ViewSettingsSection>
              <MenuSeparator />
              <ViewSettingsSection label="Filtros">
                <MenuSub>
                  <MenuSubTrigger>
                    <CircleDotIcon aria-hidden="true" />
                    Status
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuGroup>
                      <MenuGroupLabel>Status</MenuGroupLabel>
                      {statusOptions.map((option) => (
                        <MenuCheckboxOption
                          checked={statusFilter.includes(option.value)}
                          closeOnClick={false}
                          key={option.value}
                          onCheckedChange={() =>
                            setStatusFilter((current) =>
                              toggle(current, option.value),
                            )
                          }
                        >
                          {option.label}
                        </MenuCheckboxOption>
                      ))}
                    </MenuGroup>
                  </MenuSubPopup>
                </MenuSub>
                <MenuSub>
                  <MenuSubTrigger>
                    <TargetIcon aria-hidden="true" />
                    Objetivo
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuGroup>
                      <MenuGroupLabel>Objetivo</MenuGroupLabel>
                      {objectiveOptions.map((option) => (
                        <MenuCheckboxOption
                          checked={objectiveFilter.includes(option.value)}
                          closeOnClick={false}
                          key={option.value}
                          onCheckedChange={() =>
                            setObjectiveFilter((current) =>
                              toggle(current, option.value),
                            )
                          }
                        >
                          {option.label}
                        </MenuCheckboxOption>
                      ))}
                    </MenuGroup>
                  </MenuSubPopup>
                </MenuSub>
              </ViewSettingsSection>
            </ViewSettingsMenu>
          }
          startSlot={
            <SelectedViewPicker
              footer="Criado pela equipe · 8 out 2026"
              onCreate={createPreset}
              onDelete={presets.length > 1 ? deletePreset : undefined}
              onDuplicate={duplicatePreset}
              onSelect={(id) => {
                const next = presets.find((preset) => preset.id === id)
                if (next) selectPreset(next)
              }}
              selectedId={activePreset.id}
              views={presets}
            />
          }
          variant="plain"
        />

        <section
          aria-label="Visualização da coleção"
          className="flex min-h-0 flex-1 flex-col gap-2"
        >
          <CollectionViewOutlet
            collection={collection}
            datagrid={{
              'aria-label': 'Campanhas',
              emptyMessage: 'Nenhuma campanha com esses filtros.',
              getRowGroup: grouping ? groupRowLabel : undefined,
              isLoading: loading,
              selectionActions: ({
                clearSelection,
                selectedCount,
                selectedRows,
              }) => (
                <ActionBar
                  actions={selectionActions(
                    selectedRows.map((campaign) => campaign.id),
                    clearSelection,
                  )}
                  onClearSelection={clearSelection}
                  selectedCount={selectedCount}
                  selectedRows={selectedRows}
                />
              ),
              table: dataGridTable,
            }}
            datatable={{
              'aria-label': 'Campanhas',
              bordered: true,
              defaultAggregations: campaignTableAggregations,
              emptyMessage: 'Nenhuma campanha com esses filtros.',
              isLoading: loading,
              table: dataTable,
            }}
            list={{
              collapseEmptyGroups: true,
              emptyGroupLabel: 'Nenhuma campanha neste grupo.',
              loading,
              loadingItemCount: 3,
              loadingItemLabel: 'Carregando campanha',
              renderGroupTitle: (group) => group.label,
            }}
            renderKanbanItem={() => null}
            renderListItem={renderCampaignListRow(updateCampaign)}
          />
          {view === 'datatable' ? (
            <>
              <DataGridPagination table={dataTable} />
              {dataTableSelection.length > 0 ? (
                <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center px-3">
                  <div className="pointer-events-auto max-w-full">
                    <ActionBar
                      actions={selectionActions(
                        dataTableSelection.map((campaign) => campaign.id),
                        () => dataTable.resetRowSelection(),
                      )}
                      onClearSelection={() => dataTable.resetRowSelection()}
                      selectedCount={dataTableSelection.length}
                      selectedRows={dataTableSelection}
                    />
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export interface CampaignsUsageProps {
  defaultView?: CampaignViewMode
  initialCampaigns?: readonly Campaign[]
  loading?: boolean
}

export function CampaignsUsage({
  defaultView = 'datatable',
  initialCampaigns = seedCampaigns,
  loading = false,
}: Readonly<CampaignsUsageProps>): ReactElement {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => [
    ...initialCampaigns,
  ])
  const [preferences, setPreferences] = useState<CollectionPreferences>({
    groupBy: 'status',
    view: defaultView,
  })
  const collection = useMemo(
    () => createCampaignCollection(campaigns),
    [campaigns],
  )

  return (
    <CollectionProvider
      collection={collection}
      onPreferencesChange={setPreferences}
      preferences={preferences}
    >
      <CampaignsWorkspace
        campaigns={campaigns}
        loading={loading}
        onCampaignsChange={setCampaigns}
      />
    </CollectionProvider>
  )
}
