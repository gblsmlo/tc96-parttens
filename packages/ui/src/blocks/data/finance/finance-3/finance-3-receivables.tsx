'use client'

import { InfoIcon } from '@phosphor-icons/react'
import { Alert, AlertTitle } from '@tc96/ui/alert'
import { useMemo } from 'react'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import {
  createFinance3Formatter,
  defaultFinance3Locale,
} from './finance-3-format'
import { Finance3Frame } from './finance-3-frame'
import {
  createFinance3ReceivablesColumns,
  type Finance3ReceivablesContext,
} from './finance-3-receivables-columns'
import { createFinance3ReceivablesSelectionActions } from './finance-3-selection-actions'
import { Finance3Toolbar, Finance3ToolbarButton } from './finance-3-toolbar'
import { Finance3ViewSwitcher } from './finance-3-view-switcher'
import type {
  Finance3Labels,
  Finance3Receivable,
  Finance3ReceivablesProps,
  Finance3View,
} from './types'
import { useFinance3Table } from './use-finance-3-table'

const receivableId = (item: Finance3Receivable) => item.id
const receivableTitle = (item: Finance3Receivable) => item.payer

export function Finance3Receivables({
  className,
  counts,
  currency,
  error,
  labels,
  locale = defaultFinance3Locale,
  onContact,
  onCreate,
  onIssueCharge,
  onMarkCollected,
  onPageChange,
  onReissueCharge,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSelectedIdsChange,
  onViewChange,
  page,
  pageCount,
  pageSize,
  pending,
  records,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds,
  total,
  truncated = false,
  view: viewProp,
  views,
}: Readonly<
  Omit<Finance3ReceivablesProps, 'labels'> & { labels: Finance3Labels }
>) {
  const [view, setView] = useControllable<Finance3View>(
    viewProp,
    'collection',
    onViewChange,
  )
  const contact = useStableHandler(onContact)
  const issueCharge = useStableHandler(onIssueCharge)
  const markCollected = useStableHandler(onMarkCollected)
  const reissueCharge = useStableHandler(onReissueCharge)
  const format = useMemo(
    () => createFinance3Formatter({ currency, locale }),
    [currency, locale],
  )
  const context = useMemo<Finance3ReceivablesContext>(
    () => ({
      format,
      labels,
      onContact: contact,
      onIssueCharge: issueCharge,
      onMarkCollected: markCollected,
      onReissueCharge: reissueCharge,
    }),
    [contact, format, issueCharge, labels, markCollected, reissueCharge],
  )
  const selectable = Boolean(
    selectedIds || onSelectedIdsChange || onMarkCollected,
  )
  const columns = useMemo(
    () => createFinance3ReceivablesColumns(context, selectable),
    [context, selectable],
  )
  const table = useFinance3Table<Finance3Receivable>({
    columns,
    getId: receivableId,
    onSelectedIdsChange,
    records,
    selectable,
    selectedIds,
  })
  const receivableLabels = labels.receivables

  return (
    <Finance3Frame<Finance3Receivable>
      className={className}
      emptyMessage={receivableLabels.empty}
      error={error}
      getId={receivableId}
      getTitle={receivableTitle}
      labels={labels}
      notice={
        truncated ? (
          <Alert variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertTitle>{receivableLabels.truncated}</AlertTitle>
          </Alert>
        ) : undefined
      }
      onPageChange={onPageChange}
      onRetry={onRetry}
      page={page}
      pageCount={pageCount}
      pageSize={pageSize}
      pending={pending}
      records={records}
      selection={
        selectable
          ? {
              actions: (selectedRows, clearSelection) =>
                createFinance3ReceivablesSelectionActions({
                  labels,
                  onDone: clearSelection,
                  onMarkCollected,
                  selectedRows,
                }),
              label: receivableLabels.selectionActions,
            }
          : undefined
      }
      table={table}
      toolbar={(loading) => (
        <Finance3Toolbar
          actions={
            onCreate ? (
              <Finance3ToolbarButton onClick={onCreate} variant="default">
                {labels.create}
              </Finance3ToolbarButton>
            ) : null
          }
          labels={labels}
          left={
            <Finance3ViewSwitcher
              counts={counts}
              labels={labels}
              locale={locale}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={setView}
              savedViewId={savedViewId}
              savedViewModified={savedViewModified}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={view}
              views={views}
            />
          }
          loading={loading}
          variantLabels={receivableLabels}
        />
      )}
      total={total}
      variant="receivables"
      variantLabels={receivableLabels}
    />
  )
}
