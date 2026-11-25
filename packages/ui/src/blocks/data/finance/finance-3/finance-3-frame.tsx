'use client'

import type { RowData } from '@tanstack/react-table'
import {
  ActionBar,
  type ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import { type ReactNode, useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import type { DataCollectionLoadProps } from '../../shared/collection/types'
import { useControllable } from '../../shared/collection/use-controllable'
import { Finance3Skeleton } from './finance-3-skeleton'
import type {
  Finance3Labels,
  Finance3PagingProps,
  Finance3Variant,
  Finance3VariantLabels,
} from './types'

export interface Finance3Selection<TRecord> {
  actions: (
    selectedRows: readonly TRecord[],
    clearSelection: () => void,
  ) => ActionBarGroup<TRecord>[]
  label: string
}

export interface Finance3FrameProps<TRecord extends RowData>
  extends DataCollectionLoadProps,
    Finance3PagingProps {
  className?: string
  emptyMessage: string
  getId: (record: TRecord) => string
  getRowCanOpen?: (record: TRecord) => boolean
  getTitle: (record: TRecord) => string
  labels: Finance3Labels
  notice?: ReactNode
  onOpen?: (record: TRecord) => void
  records: TRecord[]
  selection?: Finance3Selection<TRecord>
  table: DataTableTable<TRecord>
  toolbar: (loading: boolean) => ReactNode
  variant: Finance3Variant
  variantLabels: Finance3VariantLabels
}

export function Finance3Frame<TRecord extends RowData>({
  className,
  emptyMessage,
  error,
  getId,
  getRowCanOpen,
  getTitle,
  labels,
  notice,
  onOpen,
  onPageChange,
  onRetry,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  records,
  selection,
  table,
  toolbar,
  total,
  variant,
  variantLabels,
}: Readonly<Finance3FrameProps<TRecord>>) {
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)
  const loadState = dataCollectionLoadState({
    error,
    labels: {
      errorDescription: labels.errorDescription,
      errorTitle: variantLabels.errorTitle,
      loading: variantLabels.loading,
      retry: labels.retry,
    },
    onRetry,
    pending,
    skeleton: (
      <Finance3Skeleton label={variantLabels.loading} variant={variant} />
    ),
  })
  const collection = useMemo<DataCollectionDefinition<TRecord>>(
    () => ({ getKey: getId, getLabel: getTitle, groupings: [], records }),
    [getId, getTitle, records],
  )
  const hasRecords = total === undefined ? records.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="finance-3"
      data-variant={variant}
      notice={loadState ? undefined : notice}
      title={variantLabels.title}
      toolbar={toolbar(Boolean(loadState))}
    >
      {loadState ?? (
        <DataCollection<TRecord>
          collection={collection}
          emptyMessage={emptyMessage}
          footer={
            pageCount !== undefined && hasRecords ? (
              <CollectionPagination
                buttonLabels={labels.paginationButtons}
                formatRange={labels.pageRange}
                label={variantLabels.pagination}
                onPageChange={setPage}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
              />
            ) : undefined
          }
          getRowCanOpen={getRowCanOpen}
          getRowOpenLabel={(record) =>
            variantLabels.openRecord(getTitle(record))
          }
          label={variantLabels.title}
          mode="table"
          onOpen={onOpen}
          selectionActions={
            selection
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={selection.actions(selectedRows, clearSelection)}
                    clearSelectionLabel={labels.clearSelection}
                    formatSelection={labels.selectedCount}
                    label={selection.label}
                    onClearSelection={clearSelection}
                    selectedCount={selectedCount}
                    selectedRows={selectedRows}
                  />
                )
              : undefined
          }
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
