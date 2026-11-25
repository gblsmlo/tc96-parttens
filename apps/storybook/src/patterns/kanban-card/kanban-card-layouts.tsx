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
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  KanbanCardSkeleton,
  KanbanCardTitle,
  PersonProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import {
  type Deal,
  type DealStage,
  initialDeals,
} from '../collection/fixtures/deals'
import {
  CardCountMenu,
  CardField,
  CardMenu,
} from '../collection/fixtures/kanban-card-parts'
import { DealCard } from '../collection/fixtures/pipeline-usage'
import { personOptions } from '../collection/fixtures/task-fields'
import {
  renderTaskKanbanCard,
  useTasks,
} from '../collection/fixtures/task-renderers'
import type { KanbanCardControls } from './kanban-card-controls.ts'

type CardParts = Omit<KanbanCardControls, 'loading' | 'title'>

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
}: Readonly<CardParts & { card: { title: string }; onOpen?: () => void }>) {
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
      interactive={openTrigger}
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

export function ComposedKanbanCard({
  loading,
  title,
  ...parts
}: Readonly<KanbanCardControls>) {
  if (loading)
    return (
      <KanbanCardSkeleton
        assignee={parts.footer}
        counts={parts.footer ? 1 : 0}
        descriptionLines={parts.description ? 1 : 0}
        dimmed={parts.dimmed}
        display={parts.display}
        fields={parts.fields ? 2 : 0}
        label="Carregando card"
        menu={parts.menu}
        selected={parts.selected}
      />
    )

  return <SampleKanbanCard card={{ title }} {...parts} />
}

export function DealCardExample({
  onOpen = ignore,
}: Readonly<{ onOpen?: () => void }>) {
  const [deal, setDeal] = useState<Deal>(initialDeals[0] as Deal)

  return (
    <DealCard
      deal={deal}
      onOpen={onOpen}
      onOwnerChange={(ownerId) =>
        setDeal((previous) => ({ ...previous, ownerId }))
      }
      onStageChange={(stage: DealStage) =>
        setDeal((previous) => ({ ...previous, stage }))
      }
    />
  )
}

export function TaskCardExample() {
  const { tasks, updateTask } = useTasks()
  const task = tasks[0]
  if (!task) return null

  return renderTaskKanbanCard(updateTask)(task)
}
