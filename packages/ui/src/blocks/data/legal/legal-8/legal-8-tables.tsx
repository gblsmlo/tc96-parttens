'use client'

import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import {
  createLegal8FailureColumns,
  createLegal8RunColumns,
  type Legal8ColumnContext,
} from './legal-8-columns'
import type { Legal8Failure, Legal8Run } from './types'

export function Legal8RunsTable({
  context,
  runs,
}: Readonly<{ context: Legal8ColumnContext; runs: Legal8Run[] }>) {
  const { labels } = context
  const collection = useMemo<DataCollectionDefinition<Legal8Run>>(
    () => ({
      getKey: (run) => run.id,
      getLabel: (run) => labels.runKinds[run.kind],
      groupings: [],
      records: runs,
    }),
    [labels, runs],
  )
  const columns = useMemo(() => createLegal8RunColumns(context), [context])
  const { table } = useDataTable<Legal8Run>({
    columns,
    data: runs,
    getRowId: (run) => run.id,
  })

  return (
    <DataCollection<Legal8Run>
      collection={collection}
      emptyMessage={labels.runsEmpty}
      label={labels.views.runs}
      mode="table"
      table={table}
    />
  )
}

export function Legal8FailuresTable({
  context,
  failures,
}: Readonly<{ context: Legal8ColumnContext; failures: Legal8Failure[] }>) {
  const { labels, onOpenFailure } = context
  const collection = useMemo<DataCollectionDefinition<Legal8Failure>>(
    () => ({
      getKey: (failure) => failure.id,
      getLabel: (failure) => labels.failureKinds[failure.kind],
      groupings: [],
      records: failures,
    }),
    [failures, labels],
  )
  const columns = useMemo(() => createLegal8FailureColumns(context), [context])
  const { table } = useDataTable<Legal8Failure>({
    columns,
    data: failures,
    getRowId: (failure) => failure.id,
  })

  return (
    <DataCollection<Legal8Failure>
      collection={collection}
      emptyMessage={labels.failuresEmpty}
      getRowOpenLabel={(failure) =>
        labels.openFailureRow(labels.failureKinds[failure.kind])
      }
      label={labels.views.failures}
      mode="table"
      onOpen={
        onOpenFailure ? (failure) => onOpenFailure(failure.id) : undefined
      }
      table={table}
    />
  )
}
