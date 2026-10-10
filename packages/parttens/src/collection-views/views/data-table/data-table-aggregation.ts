import type { ReactNode } from 'react'

export type DataTableAggregation = 'count' | 'sum'

export type DataTableAggregations = Readonly<
  Record<string, DataTableAggregation | null>
>

export interface DataTableAggregationLabels {
  count: string
  none: string
  sum: string
  trigger: string
}

export interface DataTableColumnMeta<TData> {
  aggregations?: readonly DataTableAggregation[]
  align?: 'end' | 'start'
  formatAggregation?: (
    value: number,
    aggregation: DataTableAggregation,
  ) => ReactNode
  getAggregationValue?: (row: TData) => number | null | undefined
}

export const defaultAggregationLabels: DataTableAggregationLabels = {
  count: 'Contagem',
  none: 'Nenhum',
  sum: 'Soma',
  trigger: 'Calcular',
}

export function aggregate<TRow>(
  rows: readonly TRow[],
  aggregation: DataTableAggregation,
  readValue: (row: TRow) => unknown,
): number {
  if (aggregation === 'count') return rows.length
  return rows.reduce((total, row) => {
    const value = readValue(row)
    return typeof value === 'number' && Number.isFinite(value)
      ? total + value
      : total
  }, 0)
}
