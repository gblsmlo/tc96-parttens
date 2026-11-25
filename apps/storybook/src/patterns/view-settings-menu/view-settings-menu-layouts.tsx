import {
  CalendarDotsIcon,
  RowsIcon,
  SortAscendingIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  type ViewSettingsField,
  ViewSettingsFieldSection,
  ViewSettingsMenu,
  type ViewSettingsMode,
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsShowAllFields,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { ViewSettingsControls } from './view-settings-menu-controls.ts'
import {
  agendaModes,
  assigneeOptions,
  type CollectionField,
  type DateRange,
  dateRangeOptions,
  type FieldType,
  type FilterKey,
  fieldTypes,
  filterDefinitions,
  noFilters,
  priorityOptions,
  startDateIcon,
  statusOptions,
  type TaskAssignee,
  type TaskPriority,
  type TaskStatus,
  taskFields,
  viewModes,
} from './view-settings-menu-data.tsx'

type Density = 'comfortable' | 'compact'

type ViewSort = 'due' | 'updated'

export interface ComposedViewSettingsProps extends ViewSettingsControls {
  filters?: boolean
  modes?: readonly ViewSettingsMode[]
}

export function ComposedViewSettings({
  clear,
  clearLabel,
  filters: showFilters = true,
  label,
  modes = [],
  savePreference,
  savePreferenceLabel,
}: Readonly<ComposedViewSettingsProps>) {
  const initialMode = modes[0]?.value
  const [mode, setMode] = useState(initialMode)
  const [density, setDensity] = useState<Density>('comfortable')
  const [sort, setSort] = useState<ViewSort>('due')
  const [filters, setFilters] = useState(noFilters)

  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + values.length,
    0,
  )
  const modified =
    activeFilterCount > 0 ||
    mode !== initialMode ||
    sort !== 'due' ||
    density !== 'comfortable'

  const clearFilter = (key: FilterKey) => {
    setFilters((current) => ({ ...current, [key]: [] }))
  }

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }))
  }

  return (
    <ViewSettingsMenu
      activeFilterCount={activeFilterCount}
      clearLabel={clearLabel}
      label={label}
      mode={mode}
      modes={modes}
      onClearFilters={clear ? () => setFilters(noFilters) : undefined}
      onModeChange={setMode}
      onSavePreference={savePreference ? () => undefined : undefined}
      savePreferenceDisabled={!modified}
      savePreferenceLabel={savePreferenceLabel}
    >
      <ViewSettingsSection label="Exibição">
        <MenuSub>
          <MenuSubTrigger>
            <RowsIcon aria-hidden="true" />
            Densidade
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup onValueChange={setDensity} value={density}>
              <MenuRadioItem value="comfortable">Confortável</MenuRadioItem>
              <MenuRadioItem value="compact">Compacta</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
        <MenuSub>
          <MenuSubTrigger>
            <CalendarDotsIcon aria-hidden="true" />
            Ordenar por
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup onValueChange={setSort} value={sort}>
              <MenuRadioItem value="due">Prazo</MenuRadioItem>
              <MenuRadioItem value="updated">Atualização</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
      </ViewSettingsSection>
      {showFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label="Filtros">
            {filterDefinitions.map(
              ({ allLabel, icon: Icon, id, label, options }) => (
                <MenuSub key={id}>
                  <MenuSubTrigger>
                    <Icon aria-hidden="true" />
                    {label}
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuGroup>
                      <MenuGroupLabel>{label}</MenuGroupLabel>
                      <MenuCheckboxItem
                        checked={filters[id].length === 0}
                        closeOnClick={false}
                        onCheckedChange={() => clearFilter(id)}
                      >
                        {allLabel}
                      </MenuCheckboxItem>
                      <MenuSeparator />
                      {options.map((option) => (
                        <MenuCheckboxItem
                          checked={filters[id].includes(option)}
                          closeOnClick={false}
                          key={option}
                          onCheckedChange={() => toggleFilter(id, option)}
                        >
                          {option}
                        </MenuCheckboxItem>
                      ))}
                    </MenuGroup>
                  </MenuSubPopup>
                </MenuSub>
              ),
            )}
          </ViewSettingsSection>
        </>
      ) : null}
    </ViewSettingsMenu>
  )
}

export const InlineModeTabsLayout = (
  controls: Readonly<ViewSettingsControls>,
) => <ComposedViewSettings {...controls} modes={viewModes} />

export const StackedModeTabsLayout = (
  controls: Readonly<ViewSettingsControls>,
) => <ComposedViewSettings {...controls} modes={agendaModes} />

type FieldGrouping = 'none' | 'type' | 'visibility'

type FieldOrder = 'manual' | 'name-asc' | 'name-desc'

interface FieldGroup {
  fields: readonly ViewSettingsField[]
  id: string
  label: string
}

const groupingOptions: readonly ViewSettingsOption<FieldGrouping>[] = [
  { label: 'Nenhum', value: 'none' },
  { label: 'Tipo', value: 'type' },
  { label: 'Visibilidade', value: 'visibility' },
]

const orderOptions: readonly ViewSettingsOption<FieldOrder>[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Nome A-Z', value: 'name-asc' },
  { label: 'Nome Z-A', value: 'name-desc' },
]

const fieldType = (type: FieldType) =>
  fieldTypes.find(({ value }) => value === type) ?? fieldTypes[0]

const sortFields = (
  fields: readonly CollectionField[],
  order: FieldOrder,
): readonly CollectionField[] => {
  if (order === 'manual') return fields
  const direction = order === 'name-asc' ? 1 : -1
  return [...fields].sort(
    (a, b) => direction * a.label.localeCompare(b.label, 'pt-BR'),
  )
}

const toMenuField = (
  field: CollectionField,
  grouping: FieldGrouping,
): ViewSettingsField => {
  const { icon, label } = fieldType(field.type)
  return {
    icon,
    id: field.id,
    label: field.label,
    typeLabel: grouping === 'type' ? undefined : label,
    visible: field.visible,
  }
}

const groupFields = (
  fields: readonly CollectionField[],
  grouping: FieldGrouping,
  order: FieldOrder,
): readonly FieldGroup[] => {
  const sorted = sortFields(fields, order)
  const group = (
    id: string,
    label: string,
    include: (field: CollectionField) => boolean,
  ): FieldGroup => ({
    fields: sorted.filter(include).map((field) => toMenuField(field, grouping)),
    id,
    label,
  })
  if (grouping === 'none') return [group('all', 'Campos', () => true)]
  if (grouping === 'visibility') {
    return [
      group('visible', 'Visíveis', ({ visible }) => visible),
      group('hidden', 'Ocultos', ({ visible }) => !visible),
    ]
  }
  return fieldTypes.map(({ label, value }) =>
    group(value, label, ({ type }) => type === value),
  )
}

export function FieldSettingsLayout(controls: Readonly<ViewSettingsControls>) {
  const [mode, setMode] = useState(viewModes[0]?.value)
  const [grouping, setGrouping] = useState<FieldGrouping>('visibility')
  const [order, setOrder] = useState<FieldOrder>('manual')
  const [fields, setFields] = useState(taskFields)

  const groups = groupFields(fields, grouping, order)
  const hiddenCount = fields.filter(({ visible }) => !visible).length
  const modified =
    grouping !== 'visibility' ||
    order !== 'manual' ||
    fields.some((field, index) => field.visible !== taskFields[index]?.visible)

  const setVisible = (id: string, visible: boolean) => {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, visible } : field)),
    )
  }

  const showAll = () => {
    setFields((current) =>
      current.map((field) => ({ ...field, visible: true })),
    )
  }

  return (
    <ViewSettingsMenu
      label={controls.label}
      mode={mode}
      modes={viewModes}
      onModeChange={setMode}
      onSavePreference={controls.savePreference ? () => undefined : undefined}
      savePreferenceDisabled={!modified}
      savePreferenceLabel={controls.savePreferenceLabel}
    >
      <ViewSettingsSection label="Organizar campos">
        <ViewSettingsSubmenu
          icon={SquaresFourIcon}
          label="Agrupar por"
          onValueChange={setGrouping}
          options={groupingOptions}
          value={grouping}
        />
        <ViewSettingsSubmenu
          icon={SortAscendingIcon}
          label="Ordenar por"
          onValueChange={setOrder}
          options={orderOptions}
          value={order}
        />
      </ViewSettingsSection>
      {groups.map(({ fields: groupItems, id, label }) => (
        <ViewSettingsFieldSection
          fields={groupItems}
          key={id}
          label={label}
          onVisibleChange={setVisible}
        />
      ))}
      <ViewSettingsShowAllFields
        hiddenCount={hiddenCount}
        onShowAll={showAll}
      />
    </ViewSettingsMenu>
  )
}

type DisplayOption = 'completed' | 'empty-groups' | 'subtasks' | 'week-numbers'

const displayOptions: readonly { label: string; value: DisplayOption }[] = [
  { label: 'Mostrar concluídas', value: 'completed' },
  { label: 'Mostrar subtarefas', value: 'subtasks' },
  { label: 'Mostrar grupos vazios', value: 'empty-groups' },
  { label: 'Mostrar número da semana', value: 'week-numbers' },
]

export function SwitchOptionsLayout(controls: Readonly<ViewSettingsControls>) {
  const [mode, setMode] = useState(viewModes[0]?.value)
  const [enabled, setEnabled] = useState<readonly DisplayOption[]>(['subtasks'])

  const toggle = (value: DisplayOption, checked: boolean) => {
    setEnabled((current) =>
      checked ? [...current, value] : current.filter((item) => item !== value),
    )
  }

  return (
    <ViewSettingsMenu
      label={controls.label}
      mode={mode}
      modes={viewModes}
      onModeChange={setMode}
      onSavePreference={controls.savePreference ? () => undefined : undefined}
      savePreferenceDisabled={enabled.length === 1 && enabled[0] === 'subtasks'}
      savePreferenceLabel={controls.savePreferenceLabel}
    >
      <ViewSettingsSection label="Exibir">
        {displayOptions.map(({ label, value }) => (
          <MenuCheckboxItem
            checked={enabled.includes(value)}
            closeOnClick={false}
            key={value}
            onCheckedChange={(checked) => toggle(value, checked)}
            variant="switch"
          >
            {label}
          </MenuCheckboxItem>
        ))}
      </ViewSettingsSection>
    </ViewSettingsMenu>
  )
}

export function PropertySubmenusLayout(
  controls: Readonly<ViewSettingsControls>,
) {
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('none')
  const [assignee, setAssignee] = useState<TaskAssignee>('unassigned')
  const [startDate, setStartDate] = useState<DateRange>()
  const [dueDate, setDueDate] = useState<DateRange>()

  const modified =
    status !== 'todo' ||
    priority !== 'none' ||
    assignee !== 'unassigned' ||
    startDate !== undefined ||
    dueDate !== undefined

  return (
    <ViewSettingsMenu
      label={controls.label}
      onSavePreference={controls.savePreference ? () => undefined : undefined}
      savePreferenceDisabled={!modified}
      savePreferenceLabel={controls.savePreferenceLabel}
    >
      <ViewSettingsSection label="Propriedades">
        <ViewSettingsSubmenu
          label="Status"
          onValueChange={setStatus}
          options={statusOptions}
          value={status}
        />
        <ViewSettingsSubmenu
          label="Prioridade"
          onValueChange={setPriority}
          options={priorityOptions}
          value={priority}
        />
        <ViewSettingsSubmenu
          label="Responsável"
          onValueChange={setAssignee}
          options={assigneeOptions}
          value={assignee}
        />
        <ViewSettingsSubmenu
          icon={startDateIcon}
          label="Início"
          onValueChange={setStartDate}
          options={dateRangeOptions}
          value={startDate}
        />
        <ViewSettingsSubmenu
          icon={CalendarDotsIcon}
          label="Prazo"
          onValueChange={setDueDate}
          options={dateRangeOptions}
          value={dueDate}
        />
      </ViewSettingsSection>
    </ViewSettingsMenu>
  )
}
