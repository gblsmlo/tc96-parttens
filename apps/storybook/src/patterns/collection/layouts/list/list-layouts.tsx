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
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
  ListView,
} from '@tc96/ui/patterns'
import { Text } from '@tc96/ui/text'
import { renderTaskListRow, useTasks } from '../../fixtures/task-renderers'
import { createCollection, initialTasks, type Task } from '../../fixtures/tasks'
import type { ListControls } from './list-controls.ts'
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

export function SampleListRow({
  action,
  density,
  description,
  field,
  interactive,
  leading,
  record,
  trigger,
}: Readonly<RowControls & { record: SampleRecord }>) {
  return (
    <ListRow density={density} interactive={interactive}>
      {leading ? (
        <ListRowLeading>
          <IconFrame shape="rounded">
            <FileTextIcon aria-hidden="true" />
          </IconFrame>
        </ListRowLeading>
      ) : null}
      <ListRowBody>
        <ListRowTitle>
          {trigger ? (
            <ListRowTitleTrigger onClick={ignore}>
              {record.title}
            </ListRowTitleTrigger>
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
  onAddRecord?: (groupId: string) => void
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
  onAddRecord = ignore,
  separated,
  trigger,
}: Readonly<ComposedListProps>) => (
  <ListView<SampleRecord>
    collapseEmptyGroups={collapseEmptyGroups}
    collection={sampleCollection(empty ? [] : sampleRecords)}
    emptyGroupLabel={emptyGroupLabel}
    emptyMessage={emptyMessage}
    getGroupActions={() => (addAction ? { onAddRecord } : undefined)}
    grouping={grouped ? 'status' : null}
    loading={loading}
    loadingRecordAnatomy={{
      action,
      lines: description ? 2 : 1,
      media: leading ? 'icon' : 'none',
      pills: field ? 1 : 0,
    }}
    loadingRecordLabel="Carregando registro"
    renderRecord={(record) => (
      <SampleListRow
        action={action}
        density={density}
        description={description}
        field={field}
        interactive={interactive}
        leading={leading}
        record={record}
        trigger={trigger}
      />
    )}
    separated={separated}
  />
)

export const SingleLineList = () => (
  <ListView<SampleRecord>
    collection={sampleCollection(sampleRecords)}
    grouping="status"
    renderRecord={(record) => (
      <ListRow density="compact">
        <ListRowHeader>
          <ListRowTitle>
            <ListRowTitleTrigger onClick={ignore}>
              {record.title}
            </ListRowTitleTrigger>
          </ListRowTitle>
          <ListRowContent>Descrição curta do registro.</ListRowContent>
        </ListRowHeader>
        <ListRowFooter>20 nov.</ListRowFooter>
      </ListRow>
    )}
  />
)

interface TasksListProps {
  collapseEmptyGroups?: boolean
  grouping: string | null
  loading?: boolean
  onAddRecord?: (groupId: string) => void
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  onOpen?: (task: Task) => void
  startingTasks?: readonly Task[]
}

export function TasksList({
  collapseEmptyGroups = false,
  grouping,
  loading = false,
  onAddRecord,
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
      {...(onAddRecord ? { getGroupActions: () => ({ onAddRecord }) } : {})}
      grouping={grouping}
      loading={loading}
      loadingRecordAnatomy={{ media: 'icon', pills: 4 }}
      loadingRecordLabel="Carregando tarefa"
      {...(onCollapsedGroupIdsChange ? { onCollapsedGroupIdsChange } : {})}
      renderGroupTitle={(group) => group.label}
      renderRecord={renderTaskListRow(updateTask, 'comfortable', onOpen)}
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
      loadingRecordAnatomy={{ action: true, lines: 2, media: 'icon', pills: 1 }}
      loadingRecordLabel="Carregando documento"
      renderRecord={() => (
        <ListRow>
          <ListRowLeading>
            <IconFrame shape="rounded">
              <FileTextIcon aria-hidden="true" />
            </IconFrame>
          </ListRowLeading>
          <ListRowBody>
            <ListRowTitle>
              <ListRowTitleTrigger disabled={disabled} onClick={onOpen}>
                Contrato de prestação de serviços
              </ListRowTitleTrigger>
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
