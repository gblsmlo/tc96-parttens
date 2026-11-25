import {
  type KanbanCardMove,
  type KanbanColumnData,
  KanbanView,
} from '@tc96/ui/patterns'
import { useEffect, useState } from 'react'
import { sleep } from '../../test-utils/sleep'
import {
  type Deal,
  type DealStage,
  initialDeals,
} from '../collection/fixtures/deals'
import { projectTaskColumns } from '../collection/fixtures/kanban-tasks'
import { DealCard } from '../collection/fixtures/pipeline-usage'
import {
  renderTaskKanbanCard,
  useTasks,
} from '../collection/fixtures/task-renderers'
import { isStatus } from '../collection/fixtures/tasks'
import { SampleKanbanCard } from '../kanban-card/kanban-card-layouts.tsx'
import { type KanbanControls, kanbanControlArgs } from './kanban-controls.ts'
import {
  applyCardMove,
  columnColorOptions,
  dealCardAnatomy,
  type SampleCard,
  sampleColumns,
  taskCardAnatomy,
} from './kanban-data.ts'

export function useSimulatedLoading(delay: number | undefined) {
  const [loading, setLoading] = useState(delay !== undefined)

  useEffect(() => {
    if (delay === undefined) return
    let active = true
    sleep(delay).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [delay])

  return loading
}

const ignore = () => undefined

export interface ComposedKanbanProps extends KanbanControls {
  onRecordAdd?: (columnId: string) => void
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  onColorChange?: (columnId: string, color: string) => void
  onRecordMove?: (move: KanbanCardMove<SampleCard>) => boolean
}

export function ComposedKanban({
  addAction,
  collapsed,
  description,
  emptyGroupLabel,
  fields,
  footer,
  hidden,
  loading,
  menu,
  onRecordAdd = ignore,
  onCollapsedGroupIdsChange,
  onColorChange,
  onRecordMove,
  openTrigger,
  settingsAction,
}: Readonly<ComposedKanbanProps>) {
  const [columns, setColumns] = useState(sampleColumns)
  const [collapsedIds, setCollapsedIds] = useState<readonly string[]>([])
  const firstColumnId = columns[0]?.id
  const lastColumnId = columns.at(-1)?.id
  const collapsedGroupIds =
    collapsed && firstColumnId && !collapsedIds.includes(firstColumnId)
      ? [...collapsedIds, firstColumnId]
      : collapsedIds
  const shownColumns = columns.map(
    (column): KanbanColumnData<SampleCard> => ({
      ...column,
      hidden: hidden && column.id === lastColumnId,
    }),
  )
  const actions = {
    ...(addAction ? { onRecordAdd } : {}),
    ...(settingsAction
      ? {
          colorOptions: columnColorOptions,
          onColorChange: (columnId: string, color: string) => {
            onColorChange?.(columnId, color)
            setColumns((current) =>
              current.map((column) =>
                column.id === columnId ? { ...column, color } : column,
              ),
            )
          },
        }
      : {}),
  }

  return (
    <KanbanView<SampleCard>
      collapsedGroupIds={collapsedGroupIds}
      columns={shownColumns}
      {...(settingsAction
        ? {
            onCollapsedGroupIdsChange: (groupIds: readonly string[]) => {
              onCollapsedGroupIdsChange?.(groupIds)
              setCollapsedIds(groupIds)
            },
          }
        : {})}
      emptyGroupLabel={emptyGroupLabel}
      getRecordLabel={(card) => card.title}
      getGroupActions={() =>
        addAction || settingsAction ? actions : undefined
      }
      getKey={(card) => card.id}
      loading={loading}
      loadingAnatomy={{
        assignee: footer,
        counts: footer ? 1 : 0,
        descriptionLines: description ? 1 : 0,
        fields: fields ? 2 : 0,
        menu,
      }}
      loadingCount={2}
      loadingLabel="Carregando card"
      onRecordMove={(move) => {
        if (onRecordMove && !onRecordMove(move)) return false
        setColumns((current) => applyCardMove(current, move))
        return true
      }}
      renderRecord={(card) => (
        <SampleKanbanCard
          card={card}
          description={description}
          dimmed={false}
          display="full"
          fields={fields}
          footer={footer}
          menu={menu}
          openTrigger={openTrigger}
          selected={false}
        />
      )}
    />
  )
}

export function LoadingSampleBoard({
  loadingFor,
}: Readonly<{ loadingFor: number }>) {
  const loading = useSimulatedLoading(loadingFor)

  return <ComposedKanban {...kanbanControlArgs} loading={loading} />
}

export function TaskBoard({
  loadingFor,
  onRecordAdd = ignore,
}: Readonly<{
  loadingFor?: number
  onRecordAdd?: (columnId: string) => void
}>) {
  const loading = useSimulatedLoading(loadingFor)
  const { tasks, updateTask } = useTasks()

  return (
    <KanbanView
      columns={projectTaskColumns(tasks)}
      getRecordLabel={(task) => task.title}
      getGroupActions={() => ({ onRecordAdd })}
      getKey={(task) => task.id}
      loading={loading}
      loadingAnatomy={taskCardAnatomy}
      loadingLabel="Carregando tarefa"
      onRecordMove={({ card, targetColumnId }) => {
        if (!isStatus(targetColumnId)) return false
        updateTask(card.id, { status: targetColumnId })
        return true
      }}
      renderRecord={renderTaskKanbanCard(updateTask)}
    />
  )
}

export function DealColumn({
  loadingFor,
  onOpen,
}: Readonly<{ loadingFor?: number; onOpen: () => void }>) {
  const loading = useSimulatedLoading(loadingFor)
  const [deal, setDeal] = useState<Deal>(initialDeals[0] as Deal)

  return (
    <KanbanView<Deal>
      columns={[{ cards: [deal], count: 1, id: 'deals', title: 'Negócios' }]}
      getKey={(current) => current.id}
      loading={loading}
      loadingAnatomy={dealCardAnatomy}
      loadingLabel="Carregando negócio"
      renderRecord={(current) => (
        <DealCard
          deal={current}
          onOpen={onOpen}
          onOwnerChange={(ownerId) =>
            setDeal((previous) => ({ ...previous, ownerId }))
          }
          onStageChange={(stage: DealStage) =>
            setDeal((previous) => ({ ...previous, stage }))
          }
        />
      )}
    />
  )
}
