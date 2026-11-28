import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowLeading,
  ListRowOpenTrigger,
  ListRowSelect,
  ListRowTitle,
  ListRowTrailing,
  ListView,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { DescriptionSegments } from '../collection/fixtures/description-segments'
import {
  AssigneeField,
  DueField,
  PriorityField,
  StatusField,
  type UpdateTask,
} from '../collection/fixtures/task-fields'
import { useTasks } from '../collection/fixtures/task-renderers'
import {
  createCollection,
  initialTasks,
  statusOptions,
  type Task,
} from '../collection/fixtures/tasks'
import type { ListControls } from './list-controls.ts'

const ignore = () => undefined

type RowControls = Pick<
  ListControls,
  | 'action'
  | 'density'
  | 'description'
  | 'field'
  | 'interactive'
  | 'leading'
  | 'selection'
  | 'trigger'
>

function TaskListRow({
  action,
  density,
  description,
  field,
  interactive,
  leading,
  onChange,
  onSelectedChange,
  selected,
  selection,
  task,
  trigger,
}: Readonly<
  RowControls & {
    onChange: UpdateTask
    onSelectedChange: (selected: boolean) => void
    selected: boolean
    task: Task
  }
>) {
  const StatusIcon = statusOptions.find(
    (option) => option.value === task.status,
  )?.icon
  const icon =
    leading && StatusIcon ? (
      <IconFrame shape="rounded">
        <StatusIcon aria-hidden="true" />
      </IconFrame>
    ) : null
  const selectProps = {
    'aria-label': `Selecionar ${task.title}`,
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
              {task.title}
            </ListRowOpenTrigger>
          ) : (
            task.title
          )}
        </ListRowTitle>
        {description ? (
          <ListRowDescription>
            <DescriptionSegments segments={[task.id, task.description]} />
          </ListRowDescription>
        ) : null}
      </ListRowBody>
      {field || action ? (
        <ListRowTrailing>
          {field ? (
            <ListRowField always className="gap-2">
              <StatusField onChange={onChange} task={task} variant="plain" />
              <PriorityField onChange={onChange} task={task} variant="plain" />
              <DueField onChange={onChange} task={task} variant="plain" />
              <AssigneeField
                display="avatar"
                onChange={onChange}
                task={task}
                variant="plain"
              />
            </ListRowField>
          ) : null}
          {action ? (
            <ListRowAction>
              <Button
                aria-label={`Mais ações de ${task.title}`}
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

export interface PlaygroundListProps extends ListControls {
  onRecordAdd?: (groupId: string) => void
}

export const PlaygroundList = ({
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
}: Readonly<PlaygroundListProps>) => {
  const { tasks, updateTask } = useTasks(initialTasks)
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
    <ListView<Task>
      collapseEmptyGroups={collapseEmptyGroups}
      collection={createCollection(empty ? [] : tasks)}
      emptyGroupLabel={emptyGroupLabel}
      emptyMessage={emptyMessage}
      getGroupActions={() => (addAction ? { onRecordAdd } : undefined)}
      grouping={grouped ? 'status' : null}
      loading={loading}
      loadingAnatomy={{
        action,
        lines: description ? 2 : 1,
        media: leading ? 'icon' : 'none',
        pills: field ? 3 : 0,
      }}
      loadingLabel="Carregando tarefa"
      renderRecord={(task) => (
        <TaskListRow
          action={action}
          density={density}
          description={description}
          field={field}
          interactive={interactive}
          leading={leading}
          onChange={updateTask}
          onSelectedChange={(next) => toggle(task.id, next)}
          selected={selectedIds.has(task.id)}
          selection={selection}
          task={task}
          trigger={trigger}
        />
      )}
      separated={separated}
    />
  )
}
