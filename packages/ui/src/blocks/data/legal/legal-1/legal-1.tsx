'use client'

import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionToolbar } from '../../shared/collection/data-collection-toolbar'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal1Labels } from './labels'
import { createLegal1Columns } from './legal-1-columns'
import { createLegal1Options, type Legal1FieldContext } from './legal-1-fields'
import { legal1Phases, legal1Statuses, legal1Views } from './legal-1-options'
import { renderLegal1KanbanCard, renderLegal1ListRow } from './legal-1-records'
import { Legal1Skeleton } from './legal-1-skeleton'
import type {
  Legal1Case,
  Legal1Mode,
  Legal1Props,
  Legal1Status,
  Legal1View,
} from './types'

export const legal1Modes: readonly Legal1Mode[] = ['table', 'list', 'kanban']

const noOwners: NonNullable<Legal1Props['owners']> = []

export function Legal1({
  cases,
  className,
  error,
  labels: labelsProp,
  locale,
  mode: modeProp,
  onCreate,
  onExport,
  onModeChange,
  onOpen,
  onOwnerChange,
  onPhaseChange,
  onQueueChange,
  onRetry,
  onStatusChange,
  onStatusFilterChange,
  onViewChange,
  owners = noOwners,
  pending,
  statusFilter: statusFilterProp,
  timeZone,
  view: viewProp,
}: Readonly<Legal1Props>) {
  const labels = useMemo(() => resolveLegal1Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal1Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Legal1Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [view, setView] = useControllable<Legal1View>(
    viewProp,
    'all',
    onViewChange,
  )
  const openCase = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changePhase = useStableHandler(onPhaseChange)
  const changeQueue = useStableHandler(onQueueChange)
  const changeStatus = useStableHandler(onStatusChange)

  const context = useMemo<Legal1FieldContext>(
    () => ({
      ...createLegal1Options(labels),
      labels,
      locale,
      onOpen: openCase,
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
      openCase,
      owners,
      timeZone,
    ],
  )

  const visibleCases = useMemo(
    () =>
      cases.filter(
        (item) =>
          (!statusFilter || item.status === statusFilter) &&
          (view === 'all' ||
            item.kind === (view === 'lawsuits' ? 'lawsuit' : 'matter')),
      ),
    [cases, statusFilter, view],
  )

  const collection = useMemo<DataCollectionDefinition<Legal1Case>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [
        {
          getGroupId: (item) => item.phase,
          id: 'phase',
          label: labels.columns.phase,
          options: legal1Phases.map((phase) => ({
            id: phase,
            label: labels.phases[phase],
          })),
        },
      ],
      records: visibleCases,
    }),
    [labels, visibleCases],
  )

  const columns = useMemo(() => createLegal1Columns(context), [context])
  const { table } = useDataTable<Legal1Case>({
    columns,
    data: visibleCases,
    getRowId: (item) => item.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Legal1Case>>(
    () => ({
      emptyColumnLabel: labels.emptyColumn,
      onMoveCard: changePhase
        ? ({ card, targetGroup }) => {
            const phase = legal1Phases.find(
              (item) => item === targetGroup.value,
            )
            if (phase && phase !== card.phase) changePhase(card.id, phase)
            return false
          }
        : undefined,
    }),
    [changePhase, labels.emptyColumn],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal1Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-1"
      title={labels.title}
      toolbar={
        <DataCollectionToolbar<Legal1Mode, Legal1Status>
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Legal1View>
              label={labels.viewList}
              onViewChange={setView}
              view={view}
              viewLabels={labels.views}
              views={legal1Views}
            />
          }
          loading={Boolean(loadState)}
          mode={mode}
          modeLabels={labels.modes}
          modes={legal1Modes}
          onCreate={onCreate}
          onExport={onExport}
          onModeChange={setMode}
          onStatusFilterChange={setStatusFilter}
          statusFilter={statusFilter}
          statusLabels={labels.statuses}
          statuses={legal1Statuses}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal1Case>
          collection={collection}
          emptyMessage={labels.empty}
          getRowOpenLabel={(item) => labels.openCase(item.title)}
          kanban={kanban}
          label={labels.title}
          mode={mode}
          onOpen={openCase ? (item) => openCase(item.id) : undefined}
          renderKanbanRecord={renderLegal1KanbanCard(context)}
          renderListRecord={renderLegal1ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
