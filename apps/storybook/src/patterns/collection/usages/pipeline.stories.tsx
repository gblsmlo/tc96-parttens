import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import { Text } from '@tc96/elements/text'
import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
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
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  createDealCollection,
  type Deal,
  type DealStage,
  dealGroupings,
  isOpenStage,
  STAGE_COLOR,
  initialDeals as seedDeals,
} from '../fixtures/deals'
import {
  KanbanCardCountAction,
  KanbanCardMoreActions,
} from '../fixtures/kanban-card-actions'
import { people, peopleById, TIME_ZONE } from '../fixtures/tasks'
import { ViewSwitcherPicker } from '../fixtures/view-switcher-picker'

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
        <Avatar className="ml-auto" size="sm" title={owner?.name}>
          <AvatarFallback>
            <span aria-hidden>{owner?.initials}</span>
            <span className="sr-only">Responsável: {owner?.name}</span>
          </AvatarFallback>
        </Avatar>
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

interface PipelineArgs {
  initialDeals: readonly Deal[]
  loading: boolean
}

const meta = {
  args: { initialDeals: seedDeals, loading: false },
  decorators: [
    (Story) => (
      <main className="flex h-dvh flex-col p-6">
        <Story />
      </main>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'A sales pipeline as a `KanbanView` alone: one column per stage, projected from the `stage` grouping with `projectCollection`.',
          'The toolbar follows the Tasks usage: a saved-view picker, search, a `ViewSettingsMenu` filter by owner and a create action. Each column title carries the stage total, and a drop writes the new stage through `setGroupId`, so totals follow the card.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  render: function Pipeline({ initialDeals, loading }: Readonly<PipelineArgs>) {
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
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-semibold text-2xl">Pipeline de vendas</h1>
            <p className="text-muted-foreground text-sm">
              Arraste um negócio para mudar a etapa.
            </p>
          </div>
        </header>

        <CollectionFrame>
          <CollectionFrameHeader>
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
                <ViewSwitcherPicker
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
          </CollectionFrameBody>
        </CollectionFrame>
      </div>
    )
  },
  title: 'Patterns/Collection/Usages/Pipeline',
} satisfies Meta<PipelineArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialDeals: [] },
}

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

function center(element: Element) {
  const { height, left, top, width } = element.getBoundingClientRect()
  return { clientX: left + width / 2, clientY: top + height / 2 }
}

async function dragWithPointer(from: Element, to: Element) {
  const pointer = {
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelable: true,
    composed: true,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  }
  const start = center(from)
  const end = center(to)
  const steps = 12

  from.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, ...start }))
  for (let step = 1; step <= steps; step += 1) {
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        ...pointer,
        clientX: start.clientX + ((end.clientX - start.clientX) * step) / steps,
        clientY: start.clientY + ((end.clientY - start.clientY) * step) / steps,
      }),
    )
    await nextFrame()
    await nextFrame()
  }
  document.dispatchEvent(
    new PointerEvent('pointerup', { ...pointer, buttons: 0, ...end }),
  )
}

const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

const stage = (canvasElement: HTMLElement, name: string) =>
  within(
    within(canvasElement).getByRole('region', {
      name: new RegExp(`^${name}`),
    }),
  )

export const WinWithKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'From the handle: Space picks up Banco Aurora, the arrow moves it from Negociação to Ganho and Space drops it. The Ganho column total grows by the deal value.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      stage(canvasElement, 'Ganho').getByText(/190 mil/),
    ).toBeTruthy()

    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover card Banco Aurora',
    })
    handle.focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await waitFor(() =>
      expect(
        stage(canvasElement, 'Ganho').getByText('Banco Aurora'),
      ).toBeTruthy(),
    )
    await expect(
      stage(canvasElement, 'Negociação').queryByText('Banco Aurora'),
    ).toBeNull()
    await expect(
      stage(canvasElement, 'Ganho').getByText(/670 mil/),
    ).toBeTruthy()
  },
}

export const AdvanceWithPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The pointer grabs the whole card and drops it over a card in the next stage.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await dragWithPointer(
      stage(canvasElement, 'Lead').getByText('Marcos Tavares'),
      stage(canvasElement, 'Qualificado').getByText('Paulo Nunes'),
    )
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await waitFor(() =>
      expect(
        stage(canvasElement, 'Qualificado').getByText('Padaria Estrela'),
      ).toBeTruthy(),
    )
    await expect(
      stage(canvasElement, 'Lead').queryByText('Padaria Estrela'),
    ).toBeNull()
  },
}
