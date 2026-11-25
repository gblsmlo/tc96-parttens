'use client'

import {
  DataTable,
  type DataTableProps,
} from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import { TableToolbar } from '../shared/table-toolbar'
import { resolveTable7Labels } from './labels'
import { createTable7Columns } from './table-7-columns'
import { Table7Skeleton } from './table-7-skeleton'
import { Table7Toolbar } from './table-7-toolbar'
import type { Table7Props, Table7Rule } from './types'

type RowDragAnnouncements = NonNullable<
  DataTableProps<Table7Rule>['rowDragAnnouncements']
>

export function Table7({
  className,
  currency,
  error,
  labels: labelsProp,
  locale,
  onEnabledChange,
  onResetOrder,
  onRetry,
  onRowAction,
  onRuleMove,
  orderChanged = false,
  pending,
  rowActions,
  rules,
}: Readonly<Table7Props>) {
  const labels = useMemo(() => resolveTable7Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const handlersRef = useRef({ onEnabledChange, onRowAction })
  useLayoutEffect(() => {
    handlersRef.current = { onEnabledChange, onRowAction }
  })
  const handleRowAction = useCallback(
    (actionId: string, ruleId: string) =>
      handlersRef.current.onRowAction?.(actionId, ruleId),
    [],
  )
  const handleEnabledChange = useCallback(
    (ruleId: string, enabled: boolean) =>
      handlersRef.current.onEnabledChange?.(ruleId, enabled),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const hasEnabledChange = Boolean(onEnabledChange)

  const columns = useMemo(
    () =>
      createTable7Columns({
        formatter,
        labels,
        onEnabledChange: hasEnabledChange ? handleEnabledChange : undefined,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [
      formatter,
      handleEnabledChange,
      handleRowAction,
      hasEnabledChange,
      hasRowMenu,
      labels,
      rowActions,
    ],
  )

  const { table } = useDataTable<Table7Rule>({
    columns,
    data: rules,
    density: 'tall',
    enableSorting: false,
    getRowId: (rule) => rule.id,
  })

  const namesRef = useRef(new Map<string, string>())
  useLayoutEffect(() => {
    namesRef.current = new Map(rules.map((rule) => [rule.id, rule.name]))
  }, [rules])
  const announcements = useMemo<RowDragAnnouncements>(() => {
    const name = (id: string) => namesRef.current.get(id) ?? id
    return {
      end: ({ canceled, rowCount, rowId, toIndex }) =>
        canceled
          ? labels.dragCancel(name(rowId))
          : labels.dragDrop(name(rowId), toIndex + 1, rowCount),
      instructions: labels.dragInstructions,
      over: ({ overIndex, rowCount, rowId }) =>
        labels.dragOver(name(rowId), overIndex + 1, rowCount),
      start: ({ index, rowCount, rowId }) =>
        labels.dragStart(name(rowId), index + 1, rowCount),
    }
  }, [labels])

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table7Skeleton label={labels.loading} />,
  })

  const active = rules.filter((rule) => rule.enabled).length
  const matches = rules.reduce((total, rule) => total + rule.matches, 0)

  return (
    <TableFrame
      className={className}
      data-block="table-7"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <Table7Toolbar
            description={labels.summary(active, formatter.number(matches))}
            labels={labels}
            onResetOrder={onResetOrder}
            orderChanged={orderChanged}
          />
        )
      }
    >
      {loadState ?? (
        <DataTable
          aria-label={labels.title}
          emptyMessage={labels.empty}
          onRowMove={
            onRuleMove
              ? ({ fromIndex, overRowId, rowId, toIndex }) =>
                  onRuleMove({
                    fromIndex,
                    overRuleId: overRowId,
                    ruleId: rowId,
                    toIndex,
                  })
              : undefined
          }
          rowDragAnnouncements={announcements}
          table={table}
        />
      )}
    </TableFrame>
  )
}
