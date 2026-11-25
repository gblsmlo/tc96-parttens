import type {
  Legal5Archived,
  Legal5GroupBy,
  Legal5Mode,
  Legal5Pole,
  Legal5Situation,
  Legal5Sort,
  Legal5View,
} from './types'

export const legal5Modes: readonly Legal5Mode[] = ['table', 'list']

export const legal5Views: readonly Legal5View[] = ['all', 'matter', 'lawsuit']

export const legal5Groupings: readonly Legal5GroupBy[] = ['phase', 'owner']

export const legal5Sorts: readonly Legal5Sort[] = ['title', 'phase', 'owner']

export const legal5Poles: readonly Legal5Pole[] = [
  'plaintiff',
  'defendant',
  'third_party',
]

export const legal5SituationChoices: readonly Legal5Situation[] = [
  'closed',
  'all',
]

export const legal5ArchivedChoices: readonly Legal5Archived[] = [
  'include',
  'only',
]
