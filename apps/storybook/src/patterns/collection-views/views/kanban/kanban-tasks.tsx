import {
  type KanbanColumnData,
  KanbanView,
  projectCollection,
} from '@tc96/parttens'
import { useMemo } from 'react'
import {
  moveTaskStatus,
  renderTaskKanbanCard,
  useTasks,
} from '../../fixtures/task-renderers'
import {
  createCollection,
  type Task,
  type TaskStatus,
} from '../../fixtures/tasks'

const STATUS_COLOR: Record<TaskStatus, string> = {
  backlog: '#6b7280',
  done: '#22c55e',
  'in-progress': '#3b82f6',
  review: '#f59e0b',
  todo: '#94a3b8',
}

export const projectTaskColumns = (
  tasks: readonly Task[],
): KanbanColumnData<Task>[] =>
  projectCollection(createCollection(tasks), 'status').map((group) => ({
    cards: [...group.items],
    color: STATUS_COLOR[group.value as TaskStatus],
    count: group.count,
    id: group.value ?? group.id,
    title: group.label,
  }))

export function TaskBoard() {
  const { replaceTask, tasks, updateTask } = useTasks()
  const columns = useMemo(() => projectTaskColumns(tasks), [tasks])

  return (
    <div className="h-144 min-w-0 p-4">
      <KanbanView
        columns={columns}
        emptyColumnLabel="Nenhuma tarefa nesta coluna."
        getCardLabel={(task) => task.title}
        getKey={(task) => task.id}
        onMoveCard={moveTaskStatus(replaceTask)}
        renderCard={renderTaskKanbanCard('status', updateTask)}
      />
    </div>
  )
}
