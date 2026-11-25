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
import { createTableFormatter } from '../../shared/table/format'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { resolveSupport4Labels } from './labels'
import { createSupport4Columns } from './support-4-columns'
import { Support4Skeleton } from './support-4-skeleton'
import { Support4Toolbar } from './support-4-toolbar'
import type { Support4Props, Support4Rule } from './types'

type RowDragAnnouncements = NonNullable<
  DataTableProps<Support4Rule>['rowDragAnnouncements']
>

export function Support4({
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
}: Readonly<Support4Props>) {
  const labels = useMemo(() => resolveSupport4Labels(labelsProp), [labelsProp])
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
      createSupport4Columns({
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

  const { table } = useDataTable<Support4Rule>({
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
    skeleton: <Support4Skeleton label={labels.loading} />,
  })

  const active = rules.filter((rule) => rule.enabled).length
  const matches = rules.reduce((total, rule) => total + rule.matches, 0)

  return (
    <TableFrame
      className={className}
      data-block="support-4"
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
          <Support4Toolbar
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
