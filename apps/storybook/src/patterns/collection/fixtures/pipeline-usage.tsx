import { Text } from '@tc96/elements/text'
import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
  CollectionToolbar,
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardBodyRow,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardMove,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  MenuCheckboxOption,
  PersonProperty,
  projectCollection,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  BanknoteIcon,
  CalendarIcon,
  FileTextIcon,
  ListTodoIcon,
  MessageCircleIcon,
  UsersIcon,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  createDealCollection,
  type Deal,
  type DealStage,
  dealGroupings,
  isOpenStage,
  STAGE_COLOR,
  initialDeals as seedDeals,
} from './deals'
import {
  KanbanCardCountAction,
  KanbanCardMoreActions,
} from './kanban-card-actions'
import { personOptions } from './task-fields'
import { people, TIME_ZONE } from './tasks'
import { ViewSwitcherPicker } from './view-switcher-picker'

const LOCALE = 'pt-BR'

const formatValue = (value: number) =>
  formatAmount(value, {
    currency: 'BRL',
    locale: LOCALE,
    maximumFractionDigits: 0,
  })

const formatCompactValue = (value: number) =>
  formatAmount(value, { currency: 'BRL', locale: LOCALE, notation: 'compact' })

const sumValues = (deals: readonly Deal[]) =>
  deals.reduce((total, deal) => total + deal.value, 0)

const stageGrouping = dealGroupings.find(({ id }) => id === 'stage')

const projectDealColumns = (deals: readonly Deal[]): KanbanColumnData<Deal>[] =>
  projectCollection(createDealCollection(deals), 'stage').map((group) => ({
    cards: [...group.records],
    color: STAGE_COLOR[group.value as DealStage],
    count: group.count,
    id: group.value ?? group.id,
    title: group.label,
  }))

function DealCard({
  deal,
  onOwnerChange,
}: Readonly<{ deal: Deal; onOwnerChange: (ownerId: string) => void }>) {
  return (
    <KanbanCard density="sm">
      <KanbanCardHeader>
        <div className="flex min-w-0 items-center gap-2">
          <KanbanCardTitle className="min-w-0 flex-1 truncate">
            {deal.company}
          </KanbanCardTitle>
        </div>
        <KanbanCardDescription>{deal.contact}</KanbanCardDescription>
        <KanbanCardAction>
          <KanbanCardMoreActions
            items={['Editar negócio', 'Duplicar negócio']}
            label="Mais ações do negócio"
          />
        </KanbanCardAction>
      </KanbanCardHeader>

      <KanbanCardBody className="grid gap-2 text-sm">
        <KanbanCardBodyRow>
          <Text
            className="flex min-w-0 items-center gap-2"
            foreground="muted"
            size="sm"
          >
            <CalendarIcon aria-hidden className="size-3.5" />
            <time dateTime={deal.closeDate}>
              {formatShortDate(
                new Date(`${deal.closeDate}T12:00:00Z`),
                LOCALE,
                TIME_ZONE,
              )}
            </time>
          </Text>
        </KanbanCardBodyRow>
        <KanbanCardBodyRow>
          <Text
            className="flex min-w-0 items-center gap-2 tabular-nums"
            foreground="muted"
            size="sm"
          >
            <BanknoteIcon aria-hidden className="size-3.5" />
            <span>{formatValue(deal.value)}</span>
          </Text>
        </KanbanCardBodyRow>
      </KanbanCardBody>

      <KanbanCardFooter className="gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span data-kanban-card-action="">
            <KanbanCardCountAction
              createLabel="Criar nota"
              label="Notas: 1"
              viewLabel="Ver notas"
            >
              <FileTextIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </KanbanCardCountAction>
          </span>
          <span data-kanban-card-action="">
            <KanbanCardCountAction
              createLabel="Criar tarefa"
              label="Tarefas: 1"
              viewLabel="Ver tarefas"
            >
              <ListTodoIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </KanbanCardCountAction>
          </span>
          <span data-kanban-card-action="">
            <KanbanCardCountAction
              createLabel="Criar comentário"
              label="Comentários: 1"
              viewLabel="Ver comentários"
            >
              <MessageCircleIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </KanbanCardCountAction>
          </span>
        </div>
        <span className="ml-auto" data-kanban-card-action="">
          <PersonProperty
            ariaLabel="Responsável"
            avatarSize="sm"
            display="avatar"
            onValueChange={onOwnerChange}
            options={personOptions}
            value={deal.ownerId}
            variant="plain"
          />
        </span>
      </KanbanCardFooter>
    </KanbanCard>
  )
}

type PresetScope = 'all' | 'mine' | 'open'

const presets: readonly { id: PresetScope; label: string }[] = [
  { id: 'all', label: 'Todos os negócios' },
  { id: 'mine', label: 'Meus negócios' },
  { id: 'open', label: 'Em aberto' },
]

const CURRENT_USER_ID = 'ana'

const matchesScope = (deal: Deal, scope: PresetScope) => {
  if (scope === 'mine') return deal.ownerId === CURRENT_USER_ID
  if (scope === 'open') return isOpenStage(deal.stage)
  return true
}

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

export interface PipelineUsageProps {
  initialDeals?: readonly Deal[]
  loading?: boolean
}

export function PipelineUsage({
  initialDeals = seedDeals,
  loading = false,
}: Readonly<PipelineUsageProps>) {
  const [deals, setDeals] = useState<Deal[]>(() => [...initialDeals])
  const [presetId, setPresetId] = useState<PresetScope>('all')
  const [ownerFilter, setOwnerFilter] = useState<readonly string[]>([])

  const visibleDeals = useMemo(() => {
    return deals.filter(
      (deal) =>
        matchesScope(deal, presetId) &&
        (ownerFilter.length === 0 || ownerFilter.includes(deal.ownerId)),
    )
  }, [deals, ownerFilter, presetId])
  const columns = useMemo(
    () => projectDealColumns(visibleDeals),
    [visibleDeals],
  )

  const moveDeal = useCallback(
    ({ card, sourceColumnId, targetColumnId }: KanbanCardMove<Deal>) => {
      if (!stageGrouping?.setGroupId || sourceColumnId === targetColumnId)
        return false
      const next = stageGrouping.setGroupId(card, targetColumnId)
      setDeals((current) =>
        current.map((deal) => (deal.id === next.id ? next : deal)),
      )
      return true
    },
    [],
  )

  const changeOwner = (dealId: string, ownerId: string) =>
    setDeals((current) =>
      current.map((deal) => (deal.id === dealId ? { ...deal, ownerId } : deal)),
    )

  const activeFilterCount = ownerFilter.length
  const clearFilters = () => {
    setOwnerFilter([])
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4">
      <CollectionFrame>
        <CollectionFrameHeader>
          <CollectionToolbar
            aria-label="Controles do pipeline de vendas"
            endSlot={
              <>
                <ViewSettingsMenu
                  activeFilterCount={activeFilterCount}
                  onClearFilters={clearFilters}
                >
                  <ViewSettingsSection label="Filtros">
                    <MenuSub>
                      <MenuSubTrigger>
                        <UsersIcon aria-hidden="true" />
                        Responsável
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Responsável</MenuGroupLabel>
                          {people.map((person) => (
                            <MenuCheckboxOption
                              checked={ownerFilter.includes(person.id)}
                              closeOnClick={false}
                              key={person.id}
                              onCheckedChange={() =>
                                setOwnerFilter((current) =>
                                  toggle(current, person.id),
                                )
                              }
                            >
                              {person.name}
                            </MenuCheckboxOption>
                          ))}
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  </ViewSettingsSection>
                </ViewSettingsMenu>
                <Action label="Novo negócio" onClick={() => undefined} />
              </>
            }
            startSlot={
              <ViewSwitcherPicker
                onSelect={(id) => {
                  const next = presets.find((preset) => preset.id === id)
                  if (next) setPresetId(next.id)
                }}
                selectedId={presetId}
                views={presets}
              />
            }
          />
        </CollectionFrameHeader>

        <CollectionFrameBody aria-label="Visualização da coleção">
          <KanbanView
            columns={columns}
            emptyColumnLabel="Nenhum negócio nesta etapa."
            getCardLabel={(deal) => deal.company}
            getKey={(deal) => deal.id}
            loading={loading}
            loadingCardCount={2}
            loadingCardLabel="Carregando negócio"
            onMoveCard={moveDeal}
            renderCard={(deal) => (
              <DealCard
                deal={deal}
                onOwnerChange={(ownerId) => changeOwner(deal.id, ownerId)}
              />
            )}
            renderColumnTitle={(column) => (
              <>
                {column.title}{' '}
                <span className="font-normal text-muted-foreground tabular-nums">
                  {formatCompactValue(sumValues(column.cards))}
                </span>
              </>
            )}
          />
        </CollectionFrameBody>
      </CollectionFrame>
    </div>
  )
}
