'use client'

import { BankIcon, CalendarDotsIcon } from '@phosphor-icons/react'
import { Alert, AlertAction, AlertTitle } from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components'
import { useMemo } from 'react'
import { useControllable } from '../../shared/collection/use-controllable'
import {
  createFinance3Formatter,
  defaultFinance3Locale,
} from './finance-3-format'
import { Finance3Frame } from './finance-3-frame'
import { createFinance3StatementColumns } from './finance-3-statement-columns'
import { Finance3Toolbar, Finance3ToolbarButton } from './finance-3-toolbar'
import type {
  Finance3Labels,
  Finance3StatementLine,
  Finance3StatementProps,
} from './types'
import { useFinance3Table } from './use-finance-3-table'

const noOptions: NonNullable<Finance3StatementProps['accounts']> = []
const lineId = (line: Finance3StatementLine) => line.id
const lineTitle = (line: Finance3StatementLine) => line.description
const lineCanOpen = (line: Finance3StatementLine) => line.entryId !== null

export function Finance3Statement({
  accountFilter: accountFilterProp,
  accounts = noOptions,
  accountsLoading = false,
  className,
  currency,
  error,
  exportError = false,
  exporting = false,
  labels,
  locale = defaultFinance3Locale,
  onAccountFilterChange,
  onExport,
  onOpen,
  onPageChange,
  onPeriodChange,
  onRetry,
  page,
  pageCount,
  pageSize,
  pending,
  period: periodProp,
  periods = noOptions,
  records,
  summary,
  total,
}: Readonly<
  Omit<Finance3StatementProps, 'labels'> & { labels: Finance3Labels }
>) {
  const [accountFilter, setAccountFilter] = useControllable<string | null>(
    accountFilterProp,
    null,
    onAccountFilterChange,
  )
  const [period, setPeriod] = useControllable<string | null>(
    periodProp,
    null,
    onPeriodChange,
  )
  const format = useMemo(
    () => createFinance3Formatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createFinance3StatementColumns({ format, labels, summary }),
    [format, labels, summary],
  )
  const table = useFinance3Table<Finance3StatementLine>({
    columns,
    getId: lineId,
    records,
    selectable: false,
  })
  const statementLabels = labels.statement
  const showAccount =
    Boolean(onAccountFilterChange) && (accounts.length > 0 || accountsLoading)
  const showPeriod = Boolean(onPeriodChange) && periods.length > 0
  const description = summary
    ? statementLabels.summary(
        summary.account,
        statementLabels.periodRange(
          format.day(summary.from),
          format.day(summary.to),
        ),
        format.amount(summary.previousBalance),
      )
    : undefined

  return (
    <Finance3Frame<Finance3StatementLine>
      className={className}
      emptyMessage={statementLabels.empty}
      error={error}
      getId={lineId}
      getRowCanOpen={lineCanOpen}
      getTitle={lineTitle}
      labels={labels}
      notice={
        exportError ? (
          <Alert variant="error">
            <AlertTitle>{statementLabels.exportError}</AlertTitle>
            {onExport ? (
              <AlertAction>
                <Button
                  disabled={exporting}
                  onClick={onExport}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {statementLabels.exportRetry}
                </Button>
              </AlertAction>
            ) : null}
          </Alert>
        ) : undefined
      }
      onOpen={
        onOpen
          ? (line) => {
              if (line.entryId !== null) onOpen(line.entryId)
            }
          : undefined
      }
      onPageChange={onPageChange}
      onRetry={onRetry}
      page={page}
      pageCount={pageCount}
      pageSize={pageSize}
      pending={pending}
      records={records}
      table={table}
      toolbar={(loading) => (
        <Finance3Toolbar
          actions={
            onExport ? (
              <Finance3ToolbarButton disabled={exporting} onClick={onExport}>
                {statementLabels.export}
              </Finance3ToolbarButton>
            ) : null
          }
          description={description}
          labels={labels}
          loading={loading}
          onClearFilters={() => {
            if (showAccount) setAccountFilter(null)
          }}
          settings={
            showAccount || showPeriod ? (
              <ViewSettingsSection label={labels.filters}>
                {showAccount ? (
                  <FilterRadioSubmenu
                    clearLabel={statementLabels.defaultAccount}
                    icon={BankIcon}
                    label={statementLabels.account}
                    loading={accountsLoading}
                    onValueChange={(value) => setAccountFilter(value || null)}
                    options={accounts.map(
                      (account) => [account.id, account.label] as const,
                    )}
                    value={accountFilter ?? ''}
                  />
                ) : null}
                {showPeriod ? (
                  <FilterRadioSubmenu
                    clearLabel={statementLabels.customPeriod}
                    icon={CalendarDotsIcon}
                    label={statementLabels.period}
                    onValueChange={(value) => setPeriod(value || null)}
                    options={periods.map(
                      (item) => [item.id, item.label] as const,
                    )}
                    value={period ?? ''}
                  />
                ) : null}
              </ViewSettingsSection>
            ) : undefined
          }
          variantLabels={statementLabels}
        />
      )}
      total={total}
      variant="statement"
      variantLabels={statementLabels}
    />
  )
}
