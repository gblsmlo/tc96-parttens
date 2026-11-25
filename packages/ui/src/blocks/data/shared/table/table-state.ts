export type TableSorting = { desc: boolean; id: string }[]

import type { TableColumnVisibility, TableSort } from './types'

export function sortingFromSort<TKey extends string>(
  sort: TableSort<TKey> | null | undefined,
): TableSorting {
  return sort ? [{ desc: sort.direction === 'desc', id: sort.key }] : []
}

export function sortFromSorting<TKey extends string>(
  sorting: TableSorting,
): TableSort<TKey> | null {
  const [first] = sorting
  return first
    ? { direction: first.desc ? 'desc' : 'asc', key: first.id as TKey }
    : null
}

export function visibilityFromState<TKey extends string>(
  visibility: Record<string, boolean>,
): TableColumnVisibility<TKey> {
  return { ...visibility } as TableColumnVisibility<TKey>
}

export function pageSizeChoices(
  options: readonly number[],
  pageSize: number,
): number[] {
  return [...new Set([...options, pageSize])].sort((a, b) => a - b)
}
