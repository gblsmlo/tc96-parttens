import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks2Labels, Tasks2LabelsOverride } from './types'

export const defaultTasks2Labels: Tasks2Labels = {
  ...defaultTasksLabels,
  create: 'New',
  search: 'Search tasks',
}

export const resolveTasks2Labels = (
  labels: Tasks2LabelsOverride | undefined,
): Tasks2Labels => resolveTasksLabels(defaultTasks2Labels, labels)
