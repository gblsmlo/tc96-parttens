import type { DataCollectionDefinition } from '../../shared/collection/data-collection'
import type { DataCollectionMode } from '../../shared/collection/types'
import type { TasksMode, TasksTask } from './types'

export type TasksGrouping =
  DataCollectionDefinition<TasksTask>['groupings'][number]

export const tasksCollectionMode = {
  datatable: 'table',
  kanban: 'kanban',
  list: 'list',
} as const satisfies Record<TasksMode, DataCollectionMode>

export function orderTasksByGrouping(
  tasks: TasksTask[],
  grouping: TasksGrouping | undefined,
): TasksTask[] {
  if (!grouping) return tasks
  const rank = new Map(
    grouping.options.map((option, index) => [option.id, index]),
  )
  const rankOf = (task: TasksTask) =>
    rank.get(grouping.getGroupId(task) ?? '') ?? grouping.options.length
  return [...tasks].sort((a, b) => rankOf(a) - rankOf(b))
}
