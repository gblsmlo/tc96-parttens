import type { TasksLabels, TasksLabelsOverride, TasksSortColumn } from './types'

const sortColumnNames = {
  due: 'due date',
  kind: 'project',
  priority: 'priority',
  title: 'task',
  updated: 'update',
} as const satisfies Record<TasksSortColumn, string>

export const defaultTasksLabels: TasksLabels = {
  activeFilters: (count) =>
    count === 1 ? 'Filter, 1 active' : `Filter, ${count} active`,
  changeStatus: (status) => `Status: ${status}. Change status`,
  clearDate: 'Clear date',
  clearFilters: 'Clear filters',
  clearSelection: 'Clear selection',
  columns: {
    assignees: 'Assignees',
    creator: 'Created by',
    due: 'Due',
    kind: 'Project',
    priority: 'Priority',
    status: 'Status',
    tags: 'Tags',
    title: 'Task',
    updated: 'Updated',
  },
  complete: 'Complete',
  create: 'New task',
  delete: 'Delete',
  empty: 'No tasks yet.',
  emptyColumn: 'No tasks in this column.',
  errorDescription: 'Check your connection and try again.',
  errorTitle: 'Could not load the tasks',
  filter: 'Filter',
  filterBy: {
    assignee: 'Assignee',
    kind: 'Project',
    priority: 'Priority',
    status: 'Status',
  },
  filterProperties: 'Properties',
  group: 'Group',
  groupBy: 'Group by',
  groupings: {
    kind: 'Project',
    none: 'None',
    priority: 'Priority',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expand ${group}` : `Collapse ${group}`,
  layout: 'Layout',
  layoutBy: 'Show as',
  loading: 'Loading tasks',
  modes: {
    datatable: 'Table',
    kanban: 'Board',
    list: 'List',
  },
  moreOptions: 'More options',
  moreTags: (count) => `+${count}`,
  noCreator: 'No author',
  noDue: 'No due date',
  noKind: 'No project',
  noPriority: 'No priority',
  noResult: 'No tasks match these filters.',
  openTask: (title) => `Open task: ${title}`,
  peoplePicker: {
    add: 'Add assignee',
    count: (count) => (count === 1 ? '1 assignee' : `${count} assignees`),
    empty: 'No people found.',
    loading: 'Loading people…',
    remove: 'Remove',
  },
  priorities: {
    high: 'High',
    low: 'Low',
    medium: 'Medium',
    urgent: 'Urgent',
  },
  retry: 'Try again',
  savedViews: {
    create: 'Save view',
    delete: 'Delete',
    duplicate: 'Duplicate',
    modified: (label) => `${label} (modified)`,
    options: (label) => `Options for ${label}`,
    rename: 'Rename',
    savedViews: 'My views',
    search: 'Search views',
    searchPlaceholder: 'Search views...',
    update: (label) => `Update “${label}”`,
  },
  selectAll: 'Select all tasks',
  selectedCount: (count) =>
    count === 1 ? '1 task selected' : `${count} tasks selected`,
  selectionActions: 'Selected task actions',
  selectTask: (title) => `Select ${title}`,
  sort: 'Sort',
  sortBy: 'Sort by',
  sortColumn: (column, direction) =>
    direction === 'asc'
      ? `Sort by ${sortColumnNames[column]}, ascending`
      : direction === 'desc'
        ? `Sort by ${sortColumnNames[column]}, descending`
        : `Sort by ${sortColumnNames[column]}`,
  sorts: {
    due: 'Due date',
    kind: 'Project',
    priority: 'Priority',
    title: 'Title',
    updated: 'Updated',
  },
  status: 'Status',
  statuses: {
    done: 'Done',
    'in-progress': 'In progress',
    todo: 'To do',
  },
  tagPicker: {
    add: 'Add tag',
    count: (count) => (count > 1 ? `+${count - 1}` : '+'),
    empty: 'No tags found.',
    loading: 'Loading tags…',
    remove: 'Remove tag',
  },
  title: 'All tasks',
  toolbar: 'Task controls',
  unassigned: 'Unassigned',
  viewList: 'Views',
  visibleColumns: 'Visible columns',
}

export function resolveTasksLabels<TLabels extends TasksLabels>(
  base: TLabels,
  labels: TasksLabelsOverride<TLabels> | undefined,
): TLabels {
  return {
    ...base,
    ...labels,
    columns: { ...base.columns, ...labels?.columns },
    filterBy: { ...base.filterBy, ...labels?.filterBy },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    peoplePicker: { ...base.peoplePicker, ...labels?.peoplePicker },
    priorities: { ...base.priorities, ...labels?.priorities },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
    tagPicker: { ...base.tagPicker, ...labels?.tagPicker },
  }
}
