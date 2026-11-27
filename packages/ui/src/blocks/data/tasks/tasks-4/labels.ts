import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks4Labels, Tasks4LabelsOverride } from './types'

export const defaultTasks4Labels: Tasks4Labels = {
  ...defaultTasksLabels,
  savePreference: 'Save preference',
}

export const resolveTasks4Labels = (
  labels: Tasks4LabelsOverride | undefined,
): Tasks4Labels => resolveTasksLabels(defaultTasks4Labels, labels)
