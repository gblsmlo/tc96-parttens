'use client'

import { formatAmount } from '@tc96/ui/helpers/format'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionToolbar } from '../../shared/collection/data-collection-toolbar'
import { defaultDataCollectionLocale } from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal2Labels } from './labels'
import { createLegal2Columns } from './legal-2-columns'
import { createLegal2Options, type Legal2FieldContext } from './legal-2-fields'
import { legal2Statuses } from './legal-2-options'
import { renderLegal2ListRow } from './legal-2-records'
import { Legal2Skeleton } from './legal-2-skeleton'
import type {
  Legal2Contract,
  Legal2Mode,
  Legal2Props,
  Legal2Status,
} from './types'

export const legal2Modes: readonly Legal2Mode[] = ['table', 'list']

const noOwners: NonNullable<Legal2Props['owners']> = []

export function Legal2({
  className,
  contracts,
  currency = 'BRL',
  error,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onCreate,
  onExport,
  onModeChange,
  onOpen,
  onOwnerChange,
  onQueueChange,
  onRetry,
  onStatusChange,
  onStatusFilterChange,
  owners = noOwners,
  pending,
  statusFilter: statusFilterProp,
  timeZone,
}: Readonly<Legal2Props>) {
  const labels = useMemo(() => resolveLegal2Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal2Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Legal2Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const openContract = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changeQueue = useStableHandler(onQueueChange)
  const changeStatus = useStableHandler(onStatusChange)

  const context = useMemo<Legal2FieldContext>(
    () => ({
      ...createLegal2Options(labels),
      formatValue: (value) =>
        formatAmount(value, {
          currency,
          locale,
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          style: 'currency',
        }),
      labels,
      locale,
      onOpen: openContract,
      onOwnerChange: changeOwner,
      onQueueChange: changeQueue,
      onStatusChange: changeStatus,
      owners,
      timeZone,
    }),
    [
      changeOwner,
      changeQueue,
      changeStatus,
      currency,
      labels,
      locale,
      openContract,
      owners,
      timeZone,
    ],
  )

  const visibleContracts = useMemo(
    () =>
      statusFilter
        ? contracts.filter((item) => item.status === statusFilter)
        : contracts,
    [contracts, statusFilter],
  )

  const collection = useMemo<DataCollectionDefinition<Legal2Contract>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [],
      records: visibleContracts,
    }),
    [visibleContracts],
  )

  const columns = useMemo(() => createLegal2Columns(context), [context])
  const { table } = useDataTable<Legal2Contract>({
    columns,
    data: visibleContracts,
    getRowId: (item) => item.id,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal2Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-2"
      title={labels.title}
      toolbar={
        <DataCollectionToolbar<Legal2Mode, Legal2Status>
          description={labels.summary(
            visibleContracts.length,
            visibleContracts.filter((item) => item.status === 'signed').length,
          )}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          modeLabels={labels.modes}
          modes={legal2Modes}
          onCreate={onCreate}
          onExport={onExport}
          onModeChange={setMode}
          onStatusFilterChange={setStatusFilter}
          statusFilter={statusFilter}
          statusLabels={labels.statuses}
          statuses={legal2Statuses}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal2Contract>
          collection={collection}
          emptyMessage={labels.empty}
          getRowOpenLabel={(item) => labels.openContract(item.title)}
          label={labels.title}
          mode={mode}
          onOpen={openContract ? (item) => openContract(item.id) : undefined}
          renderListRecord={renderLegal2ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
