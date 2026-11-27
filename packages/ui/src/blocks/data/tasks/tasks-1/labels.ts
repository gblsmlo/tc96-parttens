import { defaultTasksLabels, resolveTasksLabels } from '../shared/labels'
import type { Tasks1Labels, Tasks1LabelsOverride } from './types'

export const defaultTasks1Labels: Tasks1Labels = {
  ...defaultTasksLabels,
  pageRange: (first, last, total) =>
    total === 0 ? '0 of 0' : `${first}–${last} of ${total}`,
  pagination: 'Task pagination',
  paginationButtons: {
    first: 'First page',
    last: 'Last page',
    next: 'Next page',
    previous: 'Previous page',
  },
  savePreference: 'Save preference',
  search: 'Search tasks',
  tagPicker: {
    ...defaultTasksLabels.tagPicker,
    count: (count) => (count === 1 ? '1 tag' : `${count} tags`),
  },
  title: 'Tasks',
}

export function resolveTasks1Labels(
  labels: Tasks1LabelsOverride | undefined,
): Tasks1Labels {
  const resolved = resolveTasksLabels(defaultTasks1Labels, labels)
  return {
    ...resolved,
    paginationButtons: {
      ...defaultTasks1Labels.paginationButtons,
      ...labels?.paginationButtons,
    },
  }
}
