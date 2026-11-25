'use client'

import {
  DataGrid,
  type DataGridProps,
} from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { createDataGrid7Columns } from './data-grid-7-columns'
import { DataGrid7Skeleton } from './data-grid-7-skeleton'
import { DataGrid7Toolbar } from './data-grid-7-toolbar'
import { resolveDataGrid7Labels } from './labels'
import type { DataGrid7Props, DataGrid7Rule } from './types'

type RowDragAnnouncements = NonNullable<
  DataGridProps<DataGrid7Rule>['rowDragAnnouncements']
>

export function DataGrid7({
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
}: Readonly<DataGrid7Props>) {
  const labels = useMemo(() => resolveDataGrid7Labels(labelsProp), [labelsProp])
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
      createDataGrid7Columns({
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

  const { table } = useDataGrid<DataGrid7Rule>({
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

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid7Skeleton label={labels.loading} />,
  })

  const active = rules.filter((rule) => rule.enabled).length
  const matches = rules.reduce((total, rule) => total + rule.matches, 0)

  return (
    <GridFrame
      className={className}
      data-block="data-grid-7"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <DataGrid7Toolbar
            description={labels.summary(active, formatter.number(matches))}
            labels={labels}
            onResetOrder={onResetOrder}
            orderChanged={orderChanged}
          />
        )
      }
    >
      {loadState ?? (
        <DataGrid
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
    </GridFrame>
  )
}
