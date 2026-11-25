import { DotsThreeIcon, FileTextIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  type CollectionDefinition,
  DateProperty,
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowContent,
  ListRowDescription,
  ListRowField,
  ListRowFooter,
  ListRowHeader,
  ListRowLeading,
  ListRowOpenTrigger,
  ListRowSelect,
  ListRowTitle,
  ListRowTrailing,
  ListView,
  ListViewHeader,
  ListViewHeaderCell,
  type ListViewSortDirection,
} from '@tc96/ui/patterns'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import {
  renderTaskListRow,
  useTasks,
} from '../collection/fixtures/task-renderers'
import {
  createCollection,
  initialTasks,
  type Task,
} from '../collection/fixtures/tasks'
import { ptBRPropertyLabels } from '../properties/properties-labels.ts'
import type { ListControls, ListSelection } from './list-controls.ts'
import {
  type SampleRecord,
  sampleCollection,
  sampleRecords,
} from './list-data.ts'

const ignore = () => undefined

type RowControls = Pick<
  ListControls,
  | 'action'
  | 'density'
  | 'description'
  | 'field'
  | 'interactive'
  | 'leading'
  | 'trigger'
>

interface RowSelection {
  onSelectedChange?: (selected: boolean) => void
  selected?: boolean
  selection?: ListSelection
}

export function SampleListRow({
  action,
  density,
  description,
  field,
  interactive,
  leading,
  onSelectedChange = ignore,
  record,
  selected = false,
  selection = 'none',
  trigger,
}: Readonly<RowControls & RowSelection & { record: SampleRecord }>) {
  const icon = leading ? (
    <IconFrame shape="rounded">
      <FileTextIcon aria-hidden="true" />
    </IconFrame>
  ) : null
  const selectProps = {
    'aria-label': `Selecionar ${record.title}`,
    checked: selected,
    onCheckedChange: onSelectedChange,
  }

  return (
    <ListRow density={density} interactive={interactive} selected={selected}>
      {selection === 'icon' && icon ? (
        <ListRowLeading>
          <ListRowSelect {...selectProps}>{icon}</ListRowSelect>
        </ListRowLeading>
      ) : selection === 'checkbox' || icon ? (
        <ListRowLeading>
          {selection === 'none' ? null : <ListRowSelect {...selectProps} />}
          {icon}
        </ListRowLeading>
      ) : null}
      <ListRowBody>
        <ListRowTitle>
          {trigger ? (
            <ListRowOpenTrigger onClick={ignore}>
              {record.title}
            </ListRowOpenTrigger>
          ) : (
            record.title
          )}
        </ListRowTitle>
        {description ? (
          <ListRowDescription>Descrição curta do registro.</ListRowDescription>
        ) : null}
      </ListRowBody>
      {field || action ? (
        <ListRowTrailing>
          {field ? (
            <ListRowField always>
              <Text foreground="muted" size="sm">
                20 nov.
              </Text>
            </ListRowField>
          ) : null}
          {action ? (
            <ListRowAction>
              <Button
                aria-label={`Mais ações de ${record.title}`}
                size="icon-sm"
                variant="ghost"
              >
                <DotsThreeIcon aria-hidden="true" />
              </Button>
            </ListRowAction>
          ) : null}
        </ListRowTrailing>
      ) : null}
    </ListRow>
  )
}

export interface ComposedListProps extends ListControls {
  onRecordAdd?: (groupId: string) => void
}

export const ComposedList = ({
  action,
  addAction,
  collapseEmptyGroups,
  density,
  description,
  empty,
  emptyGroupLabel,
  emptyMessage,
  field,
  grouped,
  interactive,
  leading,
  loading,
  onRecordAdd = ignore,
  selection,
  separated,
  trigger,
}: Readonly<ComposedListProps>) => {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const toggle = (id: string, next: boolean) =>
    setSelectedIds((current) => {
      const updated = new Set(current)
      if (next) updated.add(id)
      else updated.delete(id)
      return updated
    })

  return (
    <ListView<SampleRecord>
      collapseEmptyGroups={collapseEmptyGroups}
      collection={sampleCollection(empty ? [] : sampleRecords)}
      emptyGroupLabel={emptyGroupLabel}
      emptyMessage={emptyMessage}
      getGroupActions={() => (addAction ? { onRecordAdd } : undefined)}
      grouping={grouped ? 'status' : null}
      loading={loading}
      loadingAnatomy={{
        action,
        lines: description ? 2 : 1,
        media: leading ? 'icon' : 'none',
        pills: field ? 1 : 0,
      }}
      loadingLabel="Carregando registro"
      renderRecord={(record) => (
        <SampleListRow
          action={action}
          density={density}
          description={description}
          field={field}
          interactive={interactive}
          leading={leading}
          onSelectedChange={(next) => toggle(record.id, next)}
          record={record}
          selected={selectedIds.has(record.id)}
          selection={selection}
          trigger={trigger}
        />
      )}
      separated={separated}
    />
  )
}

export const SingleLineList = () => (
  <ListView<SampleRecord>
    collection={sampleCollection(sampleRecords)}
    grouping="status"
    renderRecord={(record) => (
      <ListRow density="compact">
        <ListRowHeader>
          <ListRowTitle>
            <ListRowOpenTrigger onClick={ignore}>
              {record.title}
            </ListRowOpenTrigger>
          </ListRowTitle>
          <ListRowContent>Descrição curta do registro.</ListRowContent>
        </ListRowHeader>
        <ListRowFooter>20 nov.</ListRowFooter>
      </ListRow>
    )}
  />
)

export const HeaderList = () => (
  <ListView<SampleRecord>
    collection={sampleCollection(sampleRecords)}
    grouping="status"
    header={
      <ListViewHeader>
        <ListViewHeaderCell always className="flex-1">
          Registro
        </ListViewHeaderCell>
        <ListViewHeaderCell always className="w-24">
          Criado em
        </ListViewHeaderCell>
        <ListViewHeaderCell className="w-32">Responsável</ListViewHeaderCell>
      </ListViewHeader>
    }
    renderRecord={(record) => (
      <ListRow>
        <ListRowBody>
          <ListRowTitle>
            <ListRowOpenTrigger onClick={ignore}>
              {record.title}
            </ListRowOpenTrigger>
          </ListRowTitle>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField always className="w-24">
            <Text foreground="muted" size="sm">
              20 nov.
            </Text>
          </ListRowField>
          <ListRowField className="w-32">
            <Text foreground="muted" size="sm">
              Mariana Souza
            </Text>
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )}
  />
)

interface TasksListProps {
  collapseEmptyGroups?: boolean
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  grouping: string | null
  loading?: boolean
  onRecordAdd?: (groupId: string) => void
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  onOpen?: (task: Task) => void
  startingTasks?: readonly Task[]
}

export function TasksList({
  collapseEmptyGroups = false,
  getGroupToggleLabel,
  grouping,
  loading = false,
  onRecordAdd,
  onCollapsedGroupIdsChange,
  onOpen = ignore,
  startingTasks = initialTasks,
}: Readonly<TasksListProps>) {
  const { tasks, updateTask } = useTasks(startingTasks)

  return (
    <ListView<Task>
      collapseEmptyGroups={collapseEmptyGroups}
      collection={createCollection(loading ? [] : tasks)}
      emptyGroupLabel="Nenhuma tarefa neste grupo."
      emptyMessage="Nenhuma tarefa para exibir."
      {...(onRecordAdd ? { getGroupActions: () => ({ onRecordAdd }) } : {})}
      {...(getGroupToggleLabel ? { getGroupToggleLabel } : {})}
      grouping={grouping}
      loading={loading}
      loadingAnatomy={{ media: 'icon', pills: 4 }}
      loadingLabel="Carregando tarefa"
      {...(onCollapsedGroupIdsChange ? { onCollapsedGroupIdsChange } : {})}
      renderGroupTitle={(group) => group.label}
      renderRecord={renderTaskListRow(updateTask, 'short', onOpen)}
    />
  )
}

interface DocumentRecord {
  id: string
}

const documentCollection: CollectionDefinition<DocumentRecord> = {
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [],
  records: [{ id: 'contract' }],
}

export function DocumentRow({
  disabled = false,
  loading = false,
  onMenu = ignore,
  onOpen = ignore,
}: Readonly<{
  disabled?: boolean
  loading?: boolean
  onMenu?: () => void
  onOpen?: () => void
}>) {
  return (
    <ListView<DocumentRecord>
      collection={documentCollection}
      grouping={null}
      loading={loading}
      loadingAnatomy={{ action: true, lines: 2, media: 'icon', pills: 1 }}
      loadingLabel="Carregando documento"
      renderRecord={() => (
        <ListRow>
          <ListRowLeading>
            <IconFrame shape="rounded">
              <FileTextIcon aria-hidden="true" />
            </IconFrame>
          </ListRowLeading>
          <ListRowBody>
            <ListRowTitle>
              <ListRowOpenTrigger disabled={disabled} onClick={onOpen}>
                Contrato de prestação de serviços
              </ListRowOpenTrigger>
            </ListRowTitle>
            <ListRowDescription>Mariana Souza</ListRowDescription>
          </ListRowBody>
          <ListRowTrailing>
            <ListRowField always>
              <DateProperty
                ariaLabel="Criado em"
                displayLabel="há 4 dias"
                locale="pt-BR"
                readOnly
                timeZone="America/Sao_Paulo"
                tooltip
                value="2026-11-10T13:00:00.000Z"
                variant="plain"
                labels={ptBRPropertyLabels.date}
              />
            </ListRowField>
            <ListRowAction>
              <Button
                aria-label="Mais ações"
                onClick={onMenu}
                size="icon-sm"
                variant="ghost"
              >
                <DotsThreeIcon aria-hidden="true" />
              </Button>
            </ListRowAction>
          </ListRowTrailing>
        </ListRow>
      )}
    />
  )
}

export const SortableHeaderList = ({
  onSort,
}: Readonly<{
  onSort: (column: string, direction: ListViewSortDirection) => void
}>) => {
  const [sort, setSort] = useState<{
    column: string
    direction: ListViewSortDirection
  }>({ column: 'created', direction: 'desc' })
  const sortBy = (column: string) => {
    const direction =
      sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc'
    setSort({ column, direction })
    onSort(column, direction)
  }
  const cell = (column: string, label: string) => {
    const direction = sort.column === column ? sort.direction : null
    return {
      onSort: () => sortBy(column),
      sortDirection: direction,
      sortLabel:
        direction === 'asc'
          ? `Ordenar por ${label}, crescente`
          : direction === 'desc'
            ? `Ordenar por ${label}, decrescente`
            : `Ordenar por ${label}`,
    }
  }

  return (
    <ListView<SampleRecord>
      collection={sampleCollection(sampleRecords)}
      grouping={null}
      header={
        <ListViewHeader>
          <ListViewHeaderCell
            always
            className="flex-1"
            {...cell('title', 'Registro')}
          >
            Registro
          </ListViewHeaderCell>
          <ListViewHeaderCell
            always
            className="w-24"
            {...cell('created', 'Criado em')}
          >
            Criado em
          </ListViewHeaderCell>
        </ListViewHeader>
      }
      renderRecord={(record) => (
        <ListRow>
          <ListRowBody>
            <ListRowTitle>{record.title}</ListRowTitle>
          </ListRowBody>
          <ListRowField always className="w-24">
            <Text foreground="muted" size="sm">
              20 nov.
            </Text>
          </ListRowField>
        </ListRow>
      )}
    />
  )
}
