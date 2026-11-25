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
  onAddCard?: (columnId: string) => void
  onCollapsedChange?: (columnId: string, collapsed: boolean) => void
  onColorChange?: (columnId: string, color: string) => void
  onMoveCard?: (move: KanbanCardMove<SampleCard>) => boolean
}

export function ComposedKanban({
  addAction,
  collapsed,
  description,
  emptyColumnLabel,
  fields,
  footer,
  hidden,
  loading,
  menu,
  onAddCard = ignore,
  onCollapsedChange,
  onColorChange,
  onMoveCard,
  openTrigger,
  settingsAction,
}: Readonly<ComposedKanbanProps>) {
  const [columns, setColumns] = useState(sampleColumns)
  const lastColumnId = columns.at(-1)?.id
  const shownColumns = columns.map(
    (column, position): KanbanColumnData<SampleCard> => ({
      ...column,
      collapsed: column.collapsed || (collapsed && position === 0),
      hidden: hidden && column.id === lastColumnId,
    }),
  )
  const actions = {
    ...(addAction ? { onAddCard } : {}),
    ...(settingsAction
      ? {
          colorOptions: columnColorOptions,
          onCollapsedChange: (columnId: string, next: boolean) => {
            onCollapsedChange?.(columnId, next)
            setColumns((current) =>
              current.map((column) =>
                column.id === columnId
                  ? { ...column, collapsed: next }
                  : column,
              ),
            )
          },
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
      columns={shownColumns}
      emptyColumnLabel={emptyColumnLabel}
      getCardLabel={(card) => card.title}
      getColumnActions={() =>
        addAction || settingsAction ? actions : undefined
      }
      getKey={(card) => card.id}
      loading={loading}
      loadingCardAnatomy={{
        assignee: footer,
        counts: footer ? 1 : 0,
        descriptionLines: description ? 1 : 0,
        fields: fields ? 2 : 0,
        menu,
      }}
      loadingCardCount={2}
      loadingCardLabel="Carregando card"
      onMoveCard={(move) => {
        if (onMoveCard && !onMoveCard(move)) return false
        setColumns((current) => applyCardMove(current, move))
        return true
      }}
      renderCard={(card) => (
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
  onAddCard = ignore,
}: Readonly<{ loadingFor?: number; onAddCard?: (columnId: string) => void }>) {
  const loading = useSimulatedLoading(loadingFor)
  const { tasks, updateTask } = useTasks()

  return (
    <KanbanView
      columns={projectTaskColumns(tasks)}
      getCardLabel={(task) => task.title}
      getColumnActions={() => ({ onAddCard })}
      getKey={(task) => task.id}
      loading={loading}
      loadingCardAnatomy={taskCardAnatomy}
      loadingCardLabel="Carregando tarefa"
      onMoveCard={({ card, targetColumnId }) => {
        if (!isStatus(targetColumnId)) return false
        updateTask(card.id, { status: targetColumnId })
        return true
      }}
      renderCard={renderTaskKanbanCard(updateTask)}
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
      loadingCardAnatomy={dealCardAnatomy}
      loadingCardLabel="Carregando negócio"
      renderCard={(current) => (
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
