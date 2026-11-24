import {
  CalendarBlankIcon,
  FileTextIcon,
  RadioButtonIcon,
} from '@phosphor-icons/react'
import {
  KanbanCard,
  KanbanCardBody,
  KanbanCardControl,
  KanbanCardDescription,
  type KanbanCardDisplay,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardMove,
  KanbanCardOpenTrigger,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  PersonProperty,
} from '@tc96/ui/patterns'
import { useEffect, useState } from 'react'
import { sleep } from '../../../../test-utils/sleep'
import { type Deal, type DealStage, initialDeals } from '../../fixtures/deals'
import {
  CardCountMenu,
  CardField,
  CardMenu,
} from '../../fixtures/kanban-card-parts'
import { projectTaskColumns } from '../../fixtures/kanban-tasks'
import { DealCard } from '../../fixtures/pipeline-usage'
import { personOptions } from '../../fixtures/task-fields'
import { renderTaskKanbanCard, useTasks } from '../../fixtures/task-renderers'
import { isStatus } from '../../fixtures/tasks'
import { type KanbanControls, kanbanControlArgs } from './kanban-controls.ts'
import {
  applyCardMove,
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

type CardControls = Pick<
  KanbanControls,
  | 'description'
  | 'dimmed'
  | 'fields'
  | 'footer'
  | 'menu'
  | 'openTrigger'
  | 'selected'
> & { display: KanbanCardDisplay }

const ignore = () => undefined

export function SampleKanbanCard({
  card,
  description,
  dimmed,
  display,
  fields,
  footer,
  menu,
  onOpen = ignore,
  openTrigger,
  selected,
}: Readonly<CardControls & { card: SampleCard; onOpen?: () => void }>) {
  const assignee = (
    <KanbanCardControl className="ml-auto">
      <PersonProperty
        ariaLabel="Responsável"
        avatarSize="sm"
        display="avatar"
        options={personOptions}
        readOnly
        value="ana"
        variant="plain"
      />
    </KanbanCardControl>
  )

  return (
    <KanbanCard
      dimmed={dimmed}
      display={display}
      selected={selected}
      variant={openTrigger ? 'interactive' : 'default'}
    >
      {openTrigger ? (
        <KanbanCardOpenTrigger
          aria-label={`Abrir ${card.title}`}
          onClick={onOpen}
        />
      ) : null}
      <KanbanCardHeader>
        <KanbanCardTitle>{card.title}</KanbanCardTitle>
        {description ? (
          <KanbanCardDescription>
            Descrição curta do card.
          </KanbanCardDescription>
        ) : null}
        {menu ? (
          <CardMenu
            items={[{ label: 'Editar' }, { label: 'Duplicar' }]}
            label={`Mais ações de ${card.title}`}
          />
        ) : null}
      </KanbanCardHeader>
      {fields ? (
        <KanbanCardBody>
          <CardField icon={<RadioButtonIcon aria-hidden />} label="Campo">
            Valor
          </CardField>
          <CardField icon={<CalendarBlankIcon aria-hidden />} label="Prazo">
            20 nov.
          </CardField>
        </KanbanCardBody>
      ) : null}
      {footer ? (
        <KanbanCardFooter>
          <KanbanCardControl className="min-w-0 flex-1">
            <CardCountMenu
              count={1}
              icon={<FileTextIcon aria-hidden />}
              items={[{ label: 'Criar nota' }, { label: 'Ver notas' }]}
              label={`Notas de ${card.title}: 1`}
            />
          </KanbanCardControl>
          {assignee}
        </KanbanCardFooter>
      ) : null}
    </KanbanCard>
  )
}

export interface ComposedKanbanProps extends KanbanControls {
  onAddCard?: (columnId: string) => void
  onMoveCard?: (move: KanbanCardMove<SampleCard>) => boolean
}

export function ComposedKanban({
  addAction,
  collapsed,
  colors,
  description,
  dimmed,
  display,
  emptyColumnLabel,
  fields,
  footer,
  hidden,
  loading,
  menu,
  onAddCard = ignore,
  onMoveCard,
  openTrigger,
  selected,
  settingsAction,
}: Readonly<ComposedKanbanProps>) {
  const [columns, setColumns] = useState(sampleColumns)
  const lastColumnId = columns.at(-1)?.id
  const shownColumns = columns.map(
    (column, position): KanbanColumnData<SampleCard> => ({
      ...column,
      collapsed: collapsed && position === 0,
      color: colors ? column.color : undefined,
      hidden: hidden && column.id === lastColumnId,
    }),
  )
  const actions = {
    ...(addAction ? { onAddCard } : {}),
    ...(settingsAction ? { onOpenSettings: ignore } : {}),
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
          dimmed={dimmed && card.id === 'card-1'}
          display={display}
          fields={fields}
          footer={footer}
          menu={menu}
          openTrigger={openTrigger}
          selected={selected && card.id === 'card-1'}
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
