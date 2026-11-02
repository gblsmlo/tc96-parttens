import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
  CollectionToolbar,
  KanbanCard,
  type KanbanCardMove,
  type KanbanColumnData,
  KanbanView,
  MenuCheckboxOption,
  PersonProperty,
  projectCollection,
  SelectProperty,
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
  CircleDotIcon,
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
  isDealStage,
  isOpenStage,
  STAGE_COLOR,
  initialDeals as seedDeals,
  stageOptions,
} from './deals'
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
  onStageChange,
}: Readonly<{
  deal: Deal
  onOwnerChange: (ownerId: string) => void
  onStageChange: (stage: DealStage) => void
}>) {
  return (
    <KanbanCard
      assignee={
        <PersonProperty
          ariaLabel="Responsável"
          avatarSize="sm"
          display="avatar"
          onValueChange={onOwnerChange}
          options={personOptions}
          value={deal.ownerId}
          variant="plain"
        />
      }
      counts={[
        {
          count: 1,
          icon: <FileTextIcon aria-hidden />,
          id: 'notes',
          items: [{ label: 'Criar nota' }, { label: 'Ver notas' }],
          label: 'Notas: 1',
        },
        {
          count: 1,
          icon: <ListTodoIcon aria-hidden />,
          id: 'tasks',
          items: [{ label: 'Criar tarefa' }, { label: 'Ver tarefas' }],
          label: 'Tarefas: 1',
        },
        {
          count: 1,
          icon: <MessageCircleIcon aria-hidden />,
          id: 'comments',
          items: [{ label: 'Criar comentário' }, { label: 'Ver comentários' }],
          label: 'Comentários: 1',
        },
      ]}
      density="sm"
      description={deal.contact}
      fields={[
        {
          content: (
            <SelectProperty
              ariaLabel="Etapa"
              onValueChange={(value) => {
                if (value && isDealStage(value)) onStageChange(value)
              }}
              options={stageOptions}
              value={deal.stage}
              variant="plain"
            />
          ),
          icon: <CircleDotIcon aria-hidden />,
          id: 'stage',
          label: 'Etapa',
          interactive: true,
        },
        {
          content: (
            <time dateTime={deal.closeDate}>
              {formatShortDate(
                new Date(`${deal.closeDate}T12:00:00Z`),
                LOCALE,
                TIME_ZONE,
              )}
            </time>
          ),
          icon: <CalendarIcon aria-hidden />,
          id: 'close-date',
          label: 'Prazo',
        },
        {
          content: formatValue(deal.value),
          icon: <BanknoteIcon aria-hidden />,
          id: 'value',
          label: 'Valor',
        },
      ]}
      menu={{
        items: [{ label: 'Editar negócio' }, { label: 'Duplicar negócio' }],
        label: 'Mais ações do negócio',
      }}
      title={deal.company}
    />
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

  const changeStage = (dealId: string, stage: DealStage) =>
    setDeals((current) =>
      current.map((deal) => (deal.id === dealId ? { ...deal, stage } : deal)),
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
                onStageChange={(stage) => changeStage(deal.id, stage)}
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
