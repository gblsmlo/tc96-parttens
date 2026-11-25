import type { Legal7LawsuitFilter, Legal7Mode, Legal7Sort } from './types'

export const legal7Modes: readonly Legal7Mode[] = ['table', 'list']

export const legal7Sorts: readonly Legal7Sort[] = ['oldest', 'newest']

export const legal7LawsuitFilters: readonly Legal7LawsuitFilter[] = [
  'linked',
  'unlinked',
]
