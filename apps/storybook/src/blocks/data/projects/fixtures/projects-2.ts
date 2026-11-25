import type {
  Projects2Expanded,
  Projects2RowAction,
  Projects2Sort,
  Projects2Task,
  Projects2View,
  Projects2ViewCounts,
} from '@tc96/ui/blocks/data/projects/projects-2'
import {
  initialExpanded as dataGridInitialExpanded,
  initialSort as dataGridInitialSort,
  rowActions as dataGridRowActions,
  tasks as dataGridTasks,
  tasksForView as dataGridTasksForView,
  viewCounts as dataGridViewCounts,
} from '../../projects/fixtures/projects-1.ts'

export const tasks: Projects2Task[] = dataGridTasks

export const tasksForView = (
  view: Projects2View,
  list: Projects2Task[] = tasks,
): Projects2Task[] => dataGridTasksForView(view, list)

export const viewCounts: Projects2ViewCounts = dataGridViewCounts

export const initialExpanded: Projects2Expanded = dataGridInitialExpanded

export const initialSort: Projects2Sort | null = dataGridInitialSort

export const rowActions: Projects2RowAction[] = dataGridRowActions
