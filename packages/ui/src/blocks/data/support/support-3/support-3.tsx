'use client'

import {
  DataGrid,
  type DataGridProps,
} from '@tc96/ui/patterns/data-grid/components/data-grid'
import { useDataGrid } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../../shared/grid/format'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { resolveSupport3Labels } from './labels'
import { createSupport3Columns } from './support-3-columns'
import { Support3Skeleton } from './support-3-skeleton'
import { Support3Toolbar } from './support-3-toolbar'
import type { Support3Props, Support3Rule } from './types'

type RowDragAnnouncements = NonNullable<
  DataGridProps<Support3Rule>['rowDragAnnouncements']
>

export function Support3({
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
}: Readonly<Support3Props>) {
  const labels = useMemo(() => resolveSupport3Labels(labelsProp), [labelsProp])
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
      createSupport3Columns({
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

  const { table } = useDataGrid<Support3Rule>({
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
    skeleton: <Support3Skeleton label={labels.loading} />,
  })

  const active = rules.filter((rule) => rule.enabled).length
  const matches = rules.reduce((total, rule) => total + rule.matches, 0)

  return (
    <GridFrame
      className={className}
      data-block="support-3"
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
          <Support3Toolbar
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
