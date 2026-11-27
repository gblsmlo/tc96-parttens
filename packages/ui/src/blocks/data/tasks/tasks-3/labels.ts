import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks3Labels, Tasks3LabelsOverride } from './types'

export const defaultTasks3Labels: Tasks3Labels = {
  ...defaultTasksLabels,
  description: 'Track the due dates, priorities and assignees of each task.',
}

export const resolveTasks3Labels = (
  labels: Tasks3LabelsOverride | undefined,
): Tasks3Labels => resolveTasksLabels(defaultTasks3Labels, labels)
