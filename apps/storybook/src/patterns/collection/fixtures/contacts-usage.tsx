import {
  Action,
  ActionBar,
  type ActionBarGroup,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  CollectionFrameOverlay,
  type CollectionLayout,
  CollectionLayoutOutlet,
  type CollectionPreferences,
  CollectionProvider,
  CollectionToolbar,
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
  ListIcon,
  Rows3Icon,
  Table2Icon,
  TableIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { CreateContactDialog } from '../../records/dialog/create-contact-dialog'
import {
  createContactGridColumns,
  createContactTableColumns,
  renderContactListRow,
  type UpdateContact,
} from './contact-fields'
import {
  type Contact,
  type ContactStage,
  type ContactTag,
  contactGroupings,
  createContactCollection,
  initialContacts as seedContacts,
  stageOptions,
  tagOptions,
} from './contacts'
import { ViewSwitcherPicker } from './view-switcher-picker'

export type ContactLayout = Extract<
  CollectionLayout,
  'datagrid' | 'datatable' | 'list'
>

export const contactLayouts: readonly ViewSettingsMode<ContactLayout>[] = [
  { icon: TableIcon, label: 'Tabela', value: 'datatable' },
  { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
]

const isContactLayout = (value: CollectionLayout): value is ContactLayout =>
  contactLayouts.some((mode) => mode.value === value)

type PresetScope = 'all' | 'customers'

interface Preset {
  id: string
  label: string
  scope: PresetScope
  stages: readonly ContactStage[]
  tags: readonly ContactTag[]
  layout: CollectionLayout
}

type PresetSettings = Pick<Preset, 'stages' | 'tags' | 'layout'>

const basePresets: readonly Pick<Preset, 'id' | 'label' | 'scope'>[] = [
  { id: 'all', label: 'Todos os contatos', scope: 'all' },
  { id: 'customers', label: 'Clientes', scope: 'customers' },
]

const createPresets = (layout: CollectionLayout): readonly Preset[] =>
  basePresets.map((preset) => ({ ...preset, stages: [], tags: [], layout }))

const hasSameSettings = (a: PresetSettings, b: PresetSettings) =>
  a.layout === b.layout &&
  a.stages.join() === b.stages.join() &&
  a.tags.join() === b.tags.join()

const matchesScope = (contact: Contact, scope: PresetScope) => {
  if (scope === 'customers') return contact.stage === 'customer'
  return true
}

const nextContactId = (contacts: readonly Contact[]) =>
  `CT-${Math.max(300, ...contacts.map(({ id }) => Number(id.slice(3)))) + 1}`

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

function ContactsWorkspace({
  contacts,
  loading,
  onContactsChange,
}: Readonly<{
  contacts: readonly Contact[]
  loading: boolean
  onContactsChange: (update: (current: Contact[]) => Contact[]) => void
}>): ReactElement {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [presets, setPresets] = useState(() =>
    createPresets(preferences.layout),
  )
  const [presetId, setPresetId] = useState('all')
  const [stageFilter, setStageFilter] = useState<readonly ContactStage[]>([])
  const [tagFilter, setTagFilter] = useState<readonly ContactTag[]>([])
  const [creating, setCreating] = useState(false)

  const activePreset = presets.find(({ id }) => id === presetId) ?? presets[0]

  const updateContact = useCallback<UpdateContact>(
    (id, change) =>
      onContactsChange((current) =>
        current.map((contact) =>
          contact.id === id ? { ...contact, ...change } : contact,
        ),
      ),
    [onContactsChange],
  )

  const visibleContacts = useMemo(
    () =>
      contacts.filter(
        (contact) =>
          matchesScope(contact, activePreset.scope) &&
          (stageFilter.length === 0 || stageFilter.includes(contact.stage)) &&
          (tagFilter.length === 0 ||
            tagFilter.some((tag) => contact.tags.includes(tag))),
      ),
    [activePreset.scope, contacts, stageFilter, tagFilter],
  )

  const collection = useMemo(
    () => createContactCollection(visibleContacts),
    [visibleContacts],
  )

  const grouping = contactGroupings.find(({ id }) => id === preferences.groupBy)
  const tableRows = useMemo(() => {
    if (!grouping) return [...visibleContacts]
    const order = grouping.options.map((option) => option.id)
    const position = (contact: Contact) =>
      order.indexOf(grouping.getGroupId(contact) ?? '')
    return [...visibleContacts].sort((a, b) => position(a) - position(b))
  }, [grouping, visibleContacts])

  const gridColumns = useMemo(
    () => createContactGridColumns(updateContact),
    [updateContact],
  )
  const { table: dataGridTable } = useDataGrid<Contact>({
    columns: gridColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (contact) => contact.id,
    pageSize: 8,
  })

  const tableColumns = useMemo(
    () => createContactTableColumns(updateContact),
    [updateContact],
  )
  const { table: dataTable } = useDataTable<Contact>({
    columns: tableColumns,
    data: tableRows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (contact) => contact.id,
    pageSize: 8,
  })

  const groupRowLabel = (contact: Contact) => {
    if (!grouping) return null
    const groupId = grouping.getGroupId(contact)
    return (
      grouping.options.find((option) => option.id === groupId)?.label ?? null
    )
  }

  const activeFilterCount = stageFilter.length + tagFilter.length
  const clearFilters = () => {
    setStageFilter([])
    setTagFilter([])
  }
  const layout = preferences.layout
  const currentSettings: PresetSettings = {
    stages: stageFilter,
    tags: tagFilter,
    layout,
  }
  const presetModified = !hasSameSettings(currentSettings, activePreset)

  const selectPreset = (next: Preset) => {
    setPresetId(next.id)
    setStageFilter(next.stages)
    setTagFilter(next.tags)
    setPreferences((current) => ({ ...current, layout: next.layout }), 'layout')
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

  const selectionActions = (
    selectedIds: readonly string[],
    clearSelection: () => void,
  ): ActionBarGroup<Contact>[] => [
    {
      items: [
        {
          icon: <Trash2Icon />,
          label: 'Excluir',
          onSelect: () => {
            onContactsChange((current) =>
              current.filter((contact) => !selectedIds.includes(contact.id)),
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
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4">
      <header>
        <h1 className="font-semibold text-2xl">Contatos</h1>
        <p className="text-muted-foreground text-sm">
          As pessoas com quem o time de vendas fala, em uma única coleção.
        </p>
      </header>

      <CollectionFrame>
        <CollectionFrameHeader>
          <CollectionToolbar
            aria-label="Controles da coleção de contatos"
            endSlot={
              <>
                <ViewSettingsMenu
                  activeFilterCount={activeFilterCount}
                  mode={isContactLayout(layout) ? layout : 'datatable'}
                  modes={contactLayouts}
                  onClearFilters={clearFilters}
                  onSavePreference={savePreset}
                  savePreferenceDisabled={!presetModified}
                  onModeChange={(nextView) =>
                    setPreferences(
                      (current) => ({ ...current, layout: nextView }),
                      'layout',
                    )
                  }
                >
                  <ViewSettingsSection label="Exibição">
                    {layout === 'datatable' ? null : (
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
                            {contactGroupings.map((dimension) => (
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
                    {layout === 'datagrid' ? (
                      <>
                        <DataGridSortSubmenu table={dataGridTable} />
                        <DataGridDensitySubmenu table={dataGridTable} />
                        <DataGridColumnsSubmenu table={dataGridTable} />
                      </>
                    ) : null}
                    {layout === 'datatable' ? (
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
                                {String(column.columnDef.header)}
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
                        Etapa
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Etapa</MenuGroupLabel>
                          {stageOptions.map((option) => (
                            <MenuCheckboxOption
                              checked={stageFilter.includes(option.value)}
                              closeOnClick={false}
                              key={option.value}
                              onCheckedChange={() =>
                                setStageFilter((current) =>
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
                        <TagIcon aria-hidden="true" />
                        Tags
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Tags</MenuGroupLabel>
                          {tagOptions.map((option) => (
                            <MenuCheckboxOption
                              checked={tagFilter.includes(option.value)}
                              closeOnClick={false}
                              key={option.value}
                              onCheckedChange={() =>
                                setTagFilter((current) =>
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
                <Action
                  label="Novo contato"
                  onClick={() => setCreating(true)}
                />
              </>
            }
            startSlot={
              <ViewSwitcherPicker
                footer="Criado pela equipe · 7 out 2026"
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
        </CollectionFrameHeader>

        <CollectionFrameBody aria-label="Visualização da coleção">
          <CollectionLayoutOutlet
            collection={collection}
            datagrid={{
              'aria-label': 'Contatos',
              emptyMessage: 'Nenhum contato com esses filtros.',
              getRowGroup: grouping ? groupRowLabel : undefined,
              isLoading: loading,
              selectionActions: ({
                clearSelection,
                selectedCount,
                selectedRows,
              }) => (
                <ActionBar
                  actions={selectionActions(
                    selectedRows.map((contact) => contact.id),
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
              'aria-label': 'Contatos',
              bordered: true,
              emptyMessage: 'Nenhum contato com esses filtros.',
              isLoading: loading,
              table: dataTable,
            }}
            list={{
              collapseEmptyGroups: true,
              emptyGroupLabel: 'Nenhum contato neste grupo.',
              emptyMessage: 'Nenhum contato com esses filtros.',
              loading,
              loadingRecordCount: 3,
              loadingRecordLabel: 'Carregando contato',
              renderGroupTitle: (group) => group.label,
            }}
            renderListRecord={renderContactListRow(updateContact)}
          />
        </CollectionFrameBody>
        {layout === 'datatable' ? (
          <CollectionFrameFooter>
            <DataGridPagination table={dataTable} />
            {dataTableSelection.length > 0 ? (
              <CollectionFrameOverlay>
                <ActionBar
                  actions={selectionActions(
                    dataTableSelection.map((contact) => contact.id),
                    () => dataTable.resetRowSelection(),
                  )}
                  onClearSelection={() => dataTable.resetRowSelection()}
                  selectedCount={dataTableSelection.length}
                  selectedRows={dataTableSelection}
                />
              </CollectionFrameOverlay>
            ) : null}
          </CollectionFrameFooter>
        ) : null}
      </CollectionFrame>
      <CreateContactDialog
        companies={contacts.map((contact) => contact.company)}
        onCreate={(contact) =>
          onContactsChange((current) => [
            ...current,
            {
              ...contact,
              id: nextContactId(current),
              lastContactAt: new Date().toISOString(),
            },
          ])
        }
        onOpenChange={setCreating}
        open={creating}
        roles={contacts.map((contact) => contact.role)}
      />
    </div>
  )
}

export interface ContactsUsageProps {
  defaultLayout?: ContactLayout
  initialContacts?: readonly Contact[]
  loading?: boolean
}

export function ContactsUsage({
  defaultLayout = 'datatable',
  initialContacts = seedContacts,
  loading = false,
}: Readonly<ContactsUsageProps>): ReactElement {
  const [contacts, setContacts] = useState<Contact[]>(() => [
    ...initialContacts,
  ])
  const [preferences, setPreferences] = useState<CollectionPreferences>({
    groupBy: 'stage',
    layout: defaultLayout,
  })
  const collection = useMemo(
    () => createContactCollection(contacts),
    [contacts],
  )

  return (
    <CollectionProvider
      collection={collection}
      onPreferencesChange={setPreferences}
      preferences={preferences}
    >
      <ContactsWorkspace
        contacts={contacts}
        loading={loading}
        onContactsChange={setContacts}
      />
    </CollectionProvider>
  )
}
