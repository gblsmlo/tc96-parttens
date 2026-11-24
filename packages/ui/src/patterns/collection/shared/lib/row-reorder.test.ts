import { describe, expect, test } from 'bun:test'
import { isRowReorderActive, resolveRowMove } from './row-reorder'

const open = {
  enabled: true,
  grouped: false,
  loading: false,
  sorted: false,
  virtualized: false,
}

describe('isRowReorderActive', () => {
  test('is active only with a move handler and nothing that reorders the rows', () => {
    expect(isRowReorderActive(open)).toBe(true)
    expect(isRowReorderActive({ ...open, enabled: false })).toBe(false)
  })

  test.each(['grouped', 'loading', 'sorted', 'virtualized'] as const)(
    'is off while %s',
    (reason) => {
      expect(isRowReorderActive({ ...open, [reason]: true })).toBe(false)
    },
  )
})

describe('resolveRowMove', () => {
  const rowIds = ['a', 'b', 'c', 'd']
  const collectionIndexes = [0, 1, 2, 3]

  test('reports the source row, where it was and where it landed', () => {
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'a',
        targetIndex: 2,
      }),
    ).toEqual({ fromIndex: 0, overRowId: 'c', rowId: 'a', toIndex: 2 })
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'd',
        targetIndex: 0,
      }),
    ).toEqual({ fromIndex: 3, overRowId: 'a', rowId: 'd', toIndex: 0 })
  })

  test('maps the rendered positions to collection indexes of a later page', () => {
    expect(
      resolveRowMove({
        collectionIndexes: [10, 11, 12, 13],
        rowIds,
        sourceId: 'b',
        targetIndex: 3,
      }),
    ).toEqual({ fromIndex: 11, overRowId: 'd', rowId: 'b', toIndex: 13 })
  })

  test('ignores a drop in place, on an unknown row or past the end', () => {
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'b',
        targetIndex: 1,
      }),
    ).toBeUndefined()
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'x',
        targetIndex: 1,
      }),
    ).toBeUndefined()
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'a',
        targetIndex: 9,
      }),
    ).toBeUndefined()
    expect(
      resolveRowMove({
        collectionIndexes,
        rowIds,
        sourceId: 'a',
        targetIndex: -1,
      }),
    ).toBeUndefined()
  })
})
