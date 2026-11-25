import { describe, expect, test } from 'bun:test'
import type { Row, RowData } from '@tanstack/react-table'
import type { DataGridFeatures } from './data-grid-features'
import {
  flattenExpandedRows,
  isRowIdExpanded,
  resolveAriaExpanded,
} from './row-tree'

type TreeRow = Row<DataGridFeatures, RowData>

const row = (id: string, subRows: TreeRow[] = []) =>
  ({ id, subRows }) as unknown as TreeRow

const ids = (rows: readonly TreeRow[]) => rows.map((item) => item.id)

describe('row tree', () => {
  const tree = [
    row('a', [row('a.0', [row('a.0.0')]), row('a.1')]),
    row('b', [row('b.0')]),
    row('c'),
  ]

  test('reads expanded state by id or as expanded-all', () => {
    expect(isRowIdExpanded('a', { a: true })).toBe(true)
    expect(isRowIdExpanded('a', { a: false })).toBe(false)
    expect(isRowIdExpanded('a', {})).toBe(false)
    expect(isRowIdExpanded('a', undefined)).toBe(false)
    expect(isRowIdExpanded('a', true)).toBe(true)
  })

  test('keeps only top-level rows when nothing is expanded', () => {
    expect(ids(flattenExpandedRows(tree, {}))).toEqual(['a', 'b', 'c'])
  })

  test('inserts the sub-rows of expanded rows after their parent', () => {
    expect(ids(flattenExpandedRows(tree, { a: true, b: true }))).toEqual([
      'a',
      'a.0',
      'a.1',
      'b',
      'b.0',
      'c',
    ])
  })

  test('hides the descendants of a collapsed parent', () => {
    expect(ids(flattenExpandedRows(tree, { a: true, 'a.0': true }))).toEqual([
      'a',
      'a.0',
      'a.0.0',
      'a.1',
      'b',
      'c',
    ])
    expect(ids(flattenExpandedRows(tree, { 'a.0': true }))).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  test('expands every row for the expanded-all state', () => {
    expect(ids(flattenExpandedRows(tree, true))).toEqual([
      'a',
      'a.0',
      'a.0.0',
      'a.1',
      'b',
      'b.0',
      'c',
    ])
  })

  test('exposes aria-expanded only on expandable rows of an expandable grid', () => {
    expect(
      resolveAriaExpanded({
        canExpand: true,
        expandable: true,
        expanded: true,
      }),
    ).toBe(true)
    expect(
      resolveAriaExpanded({
        canExpand: true,
        expandable: true,
        expanded: false,
      }),
    ).toBe(false)
    expect(
      resolveAriaExpanded({
        canExpand: false,
        expandable: true,
        expanded: false,
      }),
    ).toBeUndefined()
    expect(
      resolveAriaExpanded({
        canExpand: true,
        expandable: false,
        expanded: true,
      }),
    ).toBeUndefined()
  })
})
