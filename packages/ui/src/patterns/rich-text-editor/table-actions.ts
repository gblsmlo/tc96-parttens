import {
  deleteColumn,
  deleteRow,
  deleteTable,
  getTableAbove,
  insertTableColumn,
  insertTableRow,
  setTableColSize,
} from '@platejs/table'
import type { Path, SlateEditor, TElement } from 'platejs'

export const MIN_TABLE_COLUMN_WIDTH = 48

export function isInTable(editor: SlateEditor): boolean {
  return getTableAbove(editor) !== undefined
}

export function addTableRow(
  editor: SlateEditor,
  position: 'after' | 'before' = 'after',
): void {
  insertTableRow(editor, { before: position === 'before' })
}

export function addTableColumn(
  editor: SlateEditor,
  position: 'after' | 'before' = 'after',
): void {
  insertTableColumn(editor, { before: position === 'before' })
}

export function removeTableRow(editor: SlateEditor): void {
  deleteRow(editor)
}

export function removeTableColumn(editor: SlateEditor): void {
  deleteColumn(editor)
}

export function removeTable(editor: SlateEditor): void {
  deleteTable(editor)
}

export function hasTableHeaderRow(editor: SlateEditor): boolean {
  const table = getTableAbove(editor)
  const firstRow = table && (table[0].children[0] as TElement | undefined)
  return (
    firstRow?.children.every((cell) => (cell as TElement).type === 'th') ??
    false
  )
}

export function toggleTableHeaderRow(editor: SlateEditor): void {
  const table = getTableAbove(editor)
  if (!table) return
  const [node, path] = table
  const firstRow = node.children[0] as TElement | undefined
  if (!firstRow) return
  const next = hasTableHeaderRow(editor) ? 'td' : 'th'
  editor.tf.withoutNormalizing(() => {
    firstRow.children.forEach((_, index) => {
      editor.tf.setNodes({ type: next }, { at: [...path, 0, index] })
    })
  })
}

export function setTableColumnWidth(
  editor: SlateEditor,
  at: Path,
  colIndex: number,
  width: number,
): void {
  setTableColSize(
    editor,
    { colIndex, width: Math.max(MIN_TABLE_COLUMN_WIDTH, Math.round(width)) },
    { at },
  )
}
