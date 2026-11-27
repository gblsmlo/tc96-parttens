import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks5Labels, Tasks5LabelsOverride } from './types'

export const defaultTasks5Labels: Tasks5Labels = {
  ...defaultTasksLabels,
  savePreference: 'Save preference',
}

export const resolveTasks5Labels = (
  labels: Tasks5LabelsOverride | undefined,
): Tasks5Labels => resolveTasksLabels(defaultTasks5Labels, labels)
