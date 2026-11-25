'use client'

import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo } from 'react'
import { defaultLegalLocale } from '../shared/labels'
import {
  LegalCollection,
  type LegalCollectionDefinition,
} from '../shared/legal-collection'
import { LegalFrame } from '../shared/legal-frame'
import { legalLoadState } from '../shared/legal-load-state'
import { LegalToolbar } from '../shared/legal-toolbar'
import { useControllable, useStableHandler } from '../shared/use-controllable'
import { resolveLegal4Labels } from './labels'
import { createLegal4Columns } from './legal-4-columns'
import { createLegal4Options, type Legal4FieldContext } from './legal-4-fields'
import { legal4Statuses } from './legal-4-options'
import { renderLegal4ListRow } from './legal-4-records'
import { Legal4Skeleton } from './legal-4-skeleton'
import type {
  Legal4Client,
  Legal4Mode,
  Legal4Props,
  Legal4Status,
} from './types'

export const legal4Modes: readonly Legal4Mode[] = ['table', 'list']

const noOwners: NonNullable<Legal4Props['owners']> = []

export function Legal4({
  className,
  clients,
  error,
  labels: labelsProp,
  locale = defaultLegalLocale,
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
}: Readonly<Legal4Props>) {
  const labels = useMemo(() => resolveLegal4Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal4Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Legal4Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const openClient = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changeQueue = useStableHandler(onQueueChange)
  const changeStatus = useStableHandler(onStatusChange)

  const context = useMemo<Legal4FieldContext>(
    () => ({
      ...createLegal4Options(labels),
      labels,
      locale,
      onOpen: openClient,
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
      labels,
      locale,
      openClient,
      owners,
      timeZone,
    ],
  )

  const visibleClients = useMemo(
    () =>
      statusFilter
        ? clients.filter((item) => item.status === statusFilter)
        : clients,
    [clients, statusFilter],
  )

  const collection = useMemo<LegalCollectionDefinition<Legal4Client>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings: [],
      records: visibleClients,
    }),
    [visibleClients],
  )

  const columns = useMemo(() => createLegal4Columns(context), [context])
  const { table } = useDataTable<Legal4Client>({
    columns,
    data: visibleClients,
    getRowId: (item) => item.id,
  })

  const loadState = legalLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal4Skeleton label={labels.loading} />,
  })

  return (
    <LegalFrame
      className={className}
      data-block="legal-4"
      title={labels.title}
      toolbar={
        <LegalToolbar<Legal4Mode, Legal4Status>
          description={labels.summary(
            visibleClients.length,
            visibleClients.filter((item) => item.status === 'active').length,
          )}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          modeLabels={labels.modes}
          modes={legal4Modes}
          onCreate={onCreate}
          onExport={onExport}
          onModeChange={setMode}
          onStatusFilterChange={setStatusFilter}
          statusFilter={statusFilter}
          statusLabels={labels.statuses}
          statuses={legal4Statuses}
        />
      }
    >
      {loadState ?? (
        <LegalCollection<Legal4Client>
          collection={collection}
          emptyMessage={labels.empty}
          getRowOpenLabel={(item) => labels.openClient(item.name)}
          label={labels.title}
          mode={mode}
          onOpen={openClient ? (item) => openClient(item.id) : undefined}
          renderListRecord={renderLegal4ListRow(context)}
          table={table}
        />
      )}
    </LegalFrame>
  )
}
