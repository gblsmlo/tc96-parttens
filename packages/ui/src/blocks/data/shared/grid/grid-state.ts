export type GridSorting = { desc: boolean; id: string }[]

import type { GridColumnVisibility, GridSort } from './types'

export function sortingFromSort<TKey extends string>(
  sort: GridSort<TKey> | null | undefined,
): GridSorting {
  return sort ? [{ desc: sort.direction === 'desc', id: sort.key }] : []
}

export function sortFromSorting<TKey extends string>(
  sorting: GridSorting,
): GridSort<TKey> | null {
  const [first] = sorting
  return first
    ? { direction: first.desc ? 'desc' : 'asc', key: first.id as TKey }
    : null
}

export function visibilityFromState<TKey extends string>(
  visibility: Record<string, boolean>,
): GridColumnVisibility<TKey> {
  return { ...visibility } as GridColumnVisibility<TKey>
}

export function pageSizeChoices(
  options: readonly number[],
  pageSize: number,
): number[] {
  return [...new Set([...options, pageSize])].sort((a, b) => a - b)
}
