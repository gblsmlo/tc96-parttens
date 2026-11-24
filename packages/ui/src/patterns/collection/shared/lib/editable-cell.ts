export interface EditableCellRow {
  readonly id: string
  readonly index: number
  readonly original: unknown
}

export interface EditableCellValueChange {
  columnId: string
  rowId: string
  value: string
}

export interface EditableCellMeta {
  label?: string
  placeholder?: string
  getCellError?: (row: EditableCellRow, columnId: string) => string | undefined
  validate?: (value: string, row: EditableCellRow) => string | undefined
  formatValue?: (value: string) => string
  emptyLabel?: string
  getCellLabel?: (columnLabel: string, displayValue: string) => string
}

export const DEFAULT_EMPTY_CELL_LABEL = 'Sem valor'

export function resolveEditableCellLabel(
  columnLabel: string,
  displayValue: string,
  meta: Pick<EditableCellMeta, 'getCellLabel'>,
): string {
  return meta.getCellLabel
    ? meta.getCellLabel(columnLabel, displayValue)
    : `${columnLabel}: ${displayValue}`
}
