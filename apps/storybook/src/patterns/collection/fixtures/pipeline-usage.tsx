import {
  CalendarBlankIcon,
  ChatCircleIcon,
  FileTextIcon,
  ListChecksIcon,
  MoneyIcon,
  RadioButtonIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { formatShortDate } from '@tc96/ui/helpers/date'
import { formatAmount } from '@tc96/ui/helpers/format'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
  CollectionToolbar,
  KanbanCard,
  KanbanCardBody,
  KanbanCardControl,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardMove,
  KanbanCardOpenTrigger,
  type KanbanCardProps,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  PersonProperty,
  projectCollection,
  SelectProperty,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
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
import { CardCountMenu, CardField, CardMenu } from './kanban-card-parts'
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

export function DealCard({
  deal,
  onOpen,
  onOwnerChange,
  onStageChange,
  ...cardProps
}: Readonly<
  Omit<KanbanCardProps, 'children'> & {
    deal: Deal
    onOpen?: () => void
    onOwnerChange: (ownerId: string) => void
    onStageChange: (stage: DealStage) => void
  }
>) {
  const owner = (
    <KanbanCardControl className="ml-auto">
      <PersonProperty
        placeholder="Sem responsável"
        ariaLabel="Responsável"
        avatarSize="sm"
        display="avatar"
        onValueChange={onOwnerChange}
        options={personOptions}
        value={deal.ownerId}
        variant="plain"
      />
    </KanbanCardControl>
  )

  return (
    <KanbanCard interactive={Boolean(onOpen)} {...cardProps}>
      {onOpen ? (
        <KanbanCardOpenTrigger
          aria-label={`Abrir negócio ${deal.company}`}
          onClick={onOpen}
        />
      ) : null}
      <KanbanCardHeader>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <KanbanCardTitle className="min-w-0 flex-1 truncate">
            {deal.company}
          </KanbanCardTitle>
          {cardProps.display === 'minimal' ? owner : null}
        </div>
        <KanbanCardDescription>{deal.contact}</KanbanCardDescription>
        <CardMenu
          items={[{ label: 'Editar negócio' }, { label: 'Duplicar negócio' }]}
          label="Mais ações do negócio"
        />
      </KanbanCardHeader>
      <KanbanCardBody>
        <CardField
          icon={<RadioButtonIcon aria-hidden />}
          interactive
          label="Etapa"
        >
          <SelectProperty
            ariaLabel="Etapa"
            onValueChange={(value) => {
              if (value && isDealStage(value)) onStageChange(value)
            }}
            options={stageOptions}
            value={deal.stage}
            variant="plain"
          />
        </CardField>
        <CardField icon={<CalendarBlankIcon aria-hidden />} label="Prazo">
          <time dateTime={deal.closeDate}>
            {formatShortDate(
              new Date(`${deal.closeDate}T12:00:00Z`),
              LOCALE,
              TIME_ZONE,
            )}
          </time>
        </CardField>
        <CardField icon={<MoneyIcon aria-hidden />} label="Valor">
          {formatValue(deal.value)}
        </CardField>
      </KanbanCardBody>
      <KanbanCardFooter>
        <KanbanCardControl className="min-w-0 flex-1">
          <CardCountMenu
            count={1}
            icon={<FileTextIcon aria-hidden />}
            items={[{ label: 'Criar nota' }, { label: 'Ver notas' }]}
            label="Notas: 1"
          />
          <CardCountMenu
            count={1}
            icon={<ListChecksIcon aria-hidden />}
            items={[{ label: 'Criar tarefa' }, { label: 'Ver tarefas' }]}
            label="Tarefas: 1"
          />
          <CardCountMenu
            count={1}
            icon={<ChatCircleIcon aria-hidden />}
            items={[
              { label: 'Criar comentário' },
              { label: 'Ver comentários' },
            ]}
            label="Comentários: 1"
          />
        </KanbanCardControl>
        {owner}
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
            right={
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
                            <MenuCheckboxItem
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
                            </MenuCheckboxItem>
                          ))}
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  </ViewSettingsSection>
                </ViewSettingsMenu>
                <Action label="Novo negócio" onClick={() => undefined} />
              </>
            }
            left={
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
            emptyGroupLabel="Nenhum negócio nesta etapa."
            getRecordLabel={(deal) => deal.company}
            getKey={(deal) => deal.id}
            loading={loading}
            loadingCount={2}
            loadingLabel="Carregando negócio"
            onRecordMove={moveDeal}
            renderRecord={(deal) => (
              <DealCard
                deal={deal}
                onOwnerChange={(ownerId) => changeOwner(deal.id, ownerId)}
                onStageChange={(stage) => changeStage(deal.id, stage)}
              />
            )}
            renderGroupTitle={(column) => (
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
