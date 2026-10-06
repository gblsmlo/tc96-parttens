import { Text } from '@tc96/elements/text'
import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  Action,
  CollectionSearchField,
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
import { SelectedViewPicker } from '../../shared/selected-view-picker'
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
import { people, peopleById, TIME_ZONE } from './tasks'

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
    cards: [...group.items],
    color: STAGE_COLOR[group.value as DealStage],
    count: group.count,
    id: group.value ?? group.id,
    title: group.label,
  }))

function DealCard({ deal }: Readonly<{ deal: Deal }>) {
  const owner = peopleById.get(deal.ownerId)

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
        <span
          className="ml-auto grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] text-foreground"
          title={owner?.name}
        >
          <span aria-hidden>{owner?.initials}</span>
          <span className="sr-only">Responsável: {owner?.name}</span>
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
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<readonly string[]>([])

  const visibleDeals = useMemo(() => {
    const term = search.toLocaleLowerCase(LOCALE)
    return deals.filter(
      (deal) =>
        matchesScope(deal, presetId) &&
        (!term ||
          `${deal.id} ${deal.company} ${deal.contact}`
            .toLocaleLowerCase(LOCALE)
            .includes(term)) &&
        (ownerFilter.length === 0 || ownerFilter.includes(deal.ownerId)),
    )
  }, [deals, ownerFilter, presetId, search])
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

  const activeFilterCount = ownerFilter.length + (search ? 1 : 0)
  const clearFilters = () => {
    setOwnerFilter([])
    setSearch('')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Pipeline de vendas</h1>
          <p className="text-muted-foreground text-sm">
            Arraste um negócio para mudar a etapa.
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CollectionToolbar
          aria-label="Controles do pipeline de vendas"
          endSlot={
            <>
              <CollectionSearchField
                label="Buscar negócios"
                onCommit={setSearch}
                placeholder="Buscar negócios…"
                value={search}
              />
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
            <SelectedViewPicker
              onSelect={(id) => {
                const next = presets.find((preset) => preset.id === id)
                if (next) setPresetId(next.id)
              }}
              selectedId={presetId}
              views={presets}
            />
          }
          variant="plain"
        />

        <section
          aria-label="Visualização da coleção"
          className="flex min-h-0 flex-1 flex-col gap-2"
        >
          <KanbanView
            columns={columns}
            emptyColumnLabel="Nenhum negócio nesta etapa."
            getCardLabel={(deal) => deal.company}
            getKey={(deal) => deal.id}
            loading={loading}
            loadingCardCount={2}
            loadingCardLabel="Carregando negócio"
            onMoveCard={moveDeal}
            renderCard={(deal) => <DealCard deal={deal} />}
            renderColumnTitle={(column) => (
              <>
                {column.title}{' '}
                <span className="font-normal text-muted-foreground tabular-nums">
                  {formatCompactValue(sumValues(column.cards))}
                </span>
              </>
            )}
          />
        </section>
      </div>
    </main>
  )
}
