import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks6Labels, Tasks6LabelsOverride } from './types'

export const defaultTasks6Labels: Tasks6Labels = {
  ...defaultTasksLabels,
  savePreference: 'Save preference',
}

export const resolveTasks6Labels = (
  labels: Tasks6LabelsOverride | undefined,
): Tasks6Labels => resolveTasksLabels(defaultTasks6Labels, labels)
