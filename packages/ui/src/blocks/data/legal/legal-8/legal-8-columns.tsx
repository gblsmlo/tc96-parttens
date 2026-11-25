import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import {
  DataDate,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import {
  legal8FailureStateAppearance,
  legal8FailureStates,
  legal8RunStateAppearance,
  legal8RunStates,
} from './legal-8-options'
import type {
  Legal8Failure,
  Legal8FailureState,
  Legal8Labels,
  Legal8Run,
  Legal8RunState,
} from './types'

export interface Legal8ColumnContext {
  labels: Legal8Labels
  locale?: string
  onOpenFailure?: (failureId: string) => void
  timeZone?: string
}

const countText = (value: number | null) =>
  value === null ? null : String(value)

function Legal8SimulatedMark({ label }: Readonly<{ label: string }>) {
  return (
    <Badge data-slot="legal-8-simulated" variant="outline">
      {label}
    </Badge>
  )
}

export function createLegal8RunColumns(
  context: Legal8ColumnContext,
): DataTableColumnDef<Legal8Run>[] {
  const { labels, locale, onOpenFailure, timeZone } = context
  const stateOptions = dataSelectOptions(
    legal8RunStates,
    labels.runStates,
    legal8RunStateAppearance,
  )
  const column = (id: keyof typeof labels.runColumns) => ({
    header: labels.runColumns[id],
    id,
    meta: { label: labels.runColumns[id] },
  })
  const text = (id: keyof typeof labels.runColumns, value: string | null) => (
    <TextProperty
      ariaLabel={labels.runColumns[id]}
      value={value}
      variant="plain"
      labels={{ fallback: labels.noValue }}
    />
  )
  const instant = (
    id: keyof typeof labels.runColumns,
    value: string | null,
  ) => (
    <DataDate
      ariaLabel={labels.runColumns[id]}
      fallback={labels.noValue}
      locale={locale}
      timeZone={timeZone}
      value={value}
      variant="plain"
      withTime
    />
  )

  return [
    {
      ...column('kind'),
      accessorFn: (run) => run.kind,
      cell: ({ row }) => text('kind', labels.runKinds[row.original.kind]),
      size: 190,
    },
    {
      ...column('startedAt'),
      accessorFn: (run) => run.startedAt,
      cell: ({ row }) => instant('startedAt', row.original.startedAt),
      size: 170,
    },
    {
      ...column('finishedAt'),
      accessorFn: (run) => run.finishedAt,
      cell: ({ row }) => instant('finishedAt', row.original.finishedAt),
      size: 170,
    },
    {
      ...column('state'),
      accessorFn: (run) => run.state,
      cell: ({ row }) => {
        const { failureId, state } = row.original
        return (
          <span className="flex items-center gap-2">
            <DataSelect<Legal8RunState>
              ariaLabel={labels.runColumns.state}
              options={stateOptions}
              value={state}
            />
            {failureId && onOpenFailure ? (
              <Button
                onClick={() => onOpenFailure(failureId)}
                size="sm"
                type="button"
                variant="link"
              >
                {labels.openFailure}
              </Button>
            ) : null}
          </span>
        )
      },
      size: 300,
    },
    {
      ...column('publications'),
      accessorFn: (run) => run.publications,
      cell: ({ row }) =>
        text('publications', countText(row.original.publications)),
      size: 120,
    },
    {
      ...column('movements'),
      accessorFn: (run) => run.movements,
      cell: ({ row }) => text('movements', countText(row.original.movements)),
      size: 120,
    },
    {
      ...column('error'),
      accessorFn: (run) => run.error,
      cell: ({ row }) => {
        const { error, simulated } = row.original
        return (
          <span className="flex min-w-0 items-center gap-2">
            {simulated && error ? (
              <Legal8SimulatedMark label={labels.simulated} />
            ) : null}
            <span
              className="block min-w-0 max-w-80"
              data-slot="legal-8-error"
              title={error ?? undefined}
            >
              {text('error', error)}
            </span>
          </span>
        )
      },
      size: 400,
    },
  ]
}

export function createLegal8FailureColumns(
  context: Legal8ColumnContext,
): DataTableColumnDef<Legal8Failure>[] {
  const { labels, locale, timeZone } = context
  const stateOptions = dataSelectOptions(
    legal8FailureStates,
    labels.failureStates,
    legal8FailureStateAppearance,
  )
  const column = (id: keyof typeof labels.failureColumns) => ({
    header: labels.failureColumns[id],
    id,
    meta: { label: labels.failureColumns[id] },
  })
  const text = (id: keyof typeof labels.failureColumns, value: string) => (
    <TextProperty
      ariaLabel={labels.failureColumns[id]}
      value={value}
      variant="plain"
      labels={{ fallback: labels.noValue }}
    />
  )
  const instant = (id: keyof typeof labels.failureColumns, value: string) => (
    <DataDate
      ariaLabel={labels.failureColumns[id]}
      fallback={labels.noValue}
      locale={locale}
      timeZone={timeZone}
      value={value}
      variant="plain"
    />
  )

  return [
    {
      ...column('kind'),
      accessorFn: (failure) => failure.kind,
      cell: ({ row }) => text('kind', labels.failureKinds[row.original.kind]),
      size: 260,
    },
    {
      ...column('origin'),
      accessorFn: (failure) => failure.origin,
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          {text('origin', labels.failureOrigins[row.original.origin])}
          {row.original.simulated ? (
            <Legal8SimulatedMark label={labels.simulated} />
          ) : null}
        </span>
      ),
      size: 220,
    },
    {
      ...column('startedAt'),
      accessorFn: (failure) => failure.startedAt,
      cell: ({ row }) => instant('startedAt', row.original.startedAt),
      size: 140,
    },
    {
      ...column('lastOccurredAt'),
      accessorFn: (failure) => failure.lastOccurredAt,
      cell: ({ row }) => instant('lastOccurredAt', row.original.lastOccurredAt),
      size: 170,
    },
    {
      ...column('occurrences'),
      accessorFn: (failure) => failure.occurrences,
      cell: ({ row }) => text('occurrences', String(row.original.occurrences)),
      size: 120,
    },
    {
      ...column('state'),
      accessorFn: (failure) => failure.state,
      cell: ({ row }) => (
        <DataSelect<Legal8FailureState>
          ariaLabel={labels.failureColumns.state}
          options={stateOptions}
          value={row.original.state}
        />
      ),
      size: 150,
    },
  ]
}
