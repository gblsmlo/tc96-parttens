import type {
  Table5Expanded,
  Table5RowAction,
  Table5Sort,
  Table5Task,
  Table5View,
  Table5ViewCounts,
} from '@tc96/ui/blocks/data/table/table-5'
import {
  initialExpanded as dataGridInitialExpanded,
  initialSort as dataGridInitialSort,
  rowActions as dataGridRowActions,
  tasks as dataGridTasks,
  tasksForView as dataGridTasksForView,
  viewCounts as dataGridViewCounts,
} from '../../data-grid/fixtures/data-grid-5.ts'

export const tasks: Table5Task[] = dataGridTasks

export const tasksForView = (
  view: Table5View,
  list: Table5Task[] = tasks,
): Table5Task[] => dataGridTasksForView(view, list)

export const viewCounts: Table5ViewCounts = dataGridViewCounts

export const initialExpanded: Table5Expanded = dataGridInitialExpanded

export const initialSort: Table5Sort | null = dataGridInitialSort

export const rowActions: Table5RowAction[] = dataGridRowActions
