import { describe, expect, test } from 'bun:test'
import {
  addCellToSelection,
  EMPTY_SELECTION,
  isCellSelected,
  pruneSelection,
  selectSingleCell,
} from './selection'

describe('cell selection', () => {
  test('adds cells without touching the source selection', () => {
    const single = selectSingleCell('a', 'title')
    const extended = addCellToSelection(single, 'a', 'owner')

    expect(isCellSelected(single, 'a', 'owner')).toBe(false)
    expect(isCellSelected(extended, 'a', 'title')).toBe(true)
    expect(isCellSelected(extended, 'a', 'owner')).toBe(true)
  })

  test('prunes unavailable rows and columns, keeping untouched sets by identity', () => {
    const selection = addCellToSelection(
      addCellToSelection(selectSingleCell('a', 'title'), 'b', 'title'),
      'b',
      'owner',
    )
    const pruned = pruneSelection(
      selection,
      (rowId) => rowId === 'b',
      (columnId) => columnId === 'title',
    )

    expect(isCellSelected(pruned, 'a', 'title')).toBe(false)
    expect(isCellSelected(pruned, 'b', 'title')).toBe(true)
    expect(isCellSelected(pruned, 'b', 'owner')).toBe(false)
  })

  test('returns the same selection when nothing is pruned', () => {
    const selection = selectSingleCell('a', 'title')

    expect(
      pruneSelection(
        selection,
        () => true,
        () => true,
      ),
    ).toBe(selection)
    expect(
      pruneSelection(
        EMPTY_SELECTION,
        () => false,
        () => false,
      ),
    ).toBe(EMPTY_SELECTION)
  })
})
