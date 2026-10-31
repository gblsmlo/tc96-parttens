'use client'

import type { CellContext, RowData } from '@tanstack/react-table'
import { Badge } from '@tc96/ui/badge'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectPrimitive,
  SelectValue,
} from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { CELL_ALIGN } from '../lib/constants'
import type { DataGridFeatures } from '../lib/data-grid-features'
import { formatDate, toStringValue } from '../lib/format-value'
import type { DataGridColumnMeta, DataGridSelectOption } from '../types'

const optionToLabel = (option: DataGridSelectOption) => option.label
const optionToValue = (option: DataGridSelectOption) => option.value

export function DataGridCell<TData extends RowData>({
  context,
}: {
  context: CellContext<DataGridFeatures, TData, unknown>
}) {
  const { column, getValue, row, table } = context
  const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
  const variant = meta.variant ?? 'text'
  const align = CELL_ALIGN[meta.align ?? 'start']
  const value = getValue()

  switch (variant) {
    case 'checkbox': {
      const checked = Boolean(value)
      return (
        <span className={cn('flex items-center text-muted-foreground', align)}>
          {checked ? (
            <CheckIcon aria-hidden="true" className="size-4" />
          ) : (
            <MinusIcon aria-hidden="true" className="size-4 opacity-40" />
          )}
          <span className="sr-only">{checked ? 'Marcado' : 'Desmarcado'}</span>
        </span>
      )
    }

    case 'select': {
      const options = meta.options ?? []
      const selectedOption = options.find(
        (option) => option.value === toStringValue(value),
      )
      const onValueChange = table.options.meta?.onDataGridCellValueChange

      if (meta.editable && onValueChange && options.length > 0) {
        const accessibleValue =
          selectedOption?.label ?? meta.placeholder ?? 'Sem valor'
        return (
          <Select
            itemToStringLabel={optionToLabel}
            itemToStringValue={optionToValue}
            items={options}
            onValueChange={(option) => {
              if (!option) return
              onValueChange({
                columnId: column.id,
                rowId: row.id,
                value: option.value,
              })
            }}
            value={selectedOption ?? null}
          >
            <SelectPrimitive.Trigger
              aria-label={`${meta.label ?? column.id}: ${accessibleValue}`}
              data-grid-select-trigger
              render={
                <Badge
                  className="max-w-full"
                  render={<button type="button" />}
                  variant={meta.badgeVariant ?? 'secondary'}
                />
              }
            >
              <SelectValue
                className="min-w-0"
                placeholder={meta.placeholder ?? 'Selecionar'}
              />
            </SelectPrimitive.Trigger>
            <SelectPopup alignItemWithTrigger={false}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        )
      }

      return (
        <span className={cn('block truncate px-1', align)}>
          {selectedOption?.label ?? toStringValue(value)}
        </span>
      )
    }

    case 'date': {
      return (
        <span className={cn('block truncate px-1', align)}>
          {formatDate(value)}
        </span>
      )
    }

    case 'badge': {
      if (value === null || value === undefined || value === '') {
        return (
          <span className="px-1 text-muted-foreground/72">
            {meta.placeholder ?? ''}
          </span>
        )
      }
      const label =
        meta.options?.find((option) => option.value === toStringValue(value))
          ?.label ?? toStringValue(value)
      return (
        <span className={cn('flex', align)}>
          <Badge variant={meta.badgeVariant ?? 'secondary'}>{label}</Badge>
        </span>
      )
    }

    case 'number': {
      return (
        <span className={cn('block truncate px-1 tabular-nums', align)}>
          {toStringValue(value)}
        </span>
      )
    }

    default: {
      return (
        <span className={cn('block truncate px-1', align)}>
          {toStringValue(value)}
        </span>
      )
    }
  }
}
