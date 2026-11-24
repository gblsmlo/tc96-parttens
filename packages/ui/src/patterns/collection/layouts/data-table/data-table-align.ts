import type { DataTableAlign } from './data-table-types'

const ALIGN_CLASS: Record<DataTableAlign, string> = {
  center: 'text-center [&>.flex]:justify-center',
  end: 'text-end [&>.flex]:justify-end',
  start: 'text-start',
}

export function columnAlignClass(column: {
  columnDef: { meta?: unknown }
}): string | undefined {
  const align = (
    column.columnDef.meta as { align?: DataTableAlign } | undefined
  )?.align
  return align ? ALIGN_CLASS[align] : undefined
}
