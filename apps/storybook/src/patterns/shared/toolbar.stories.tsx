import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ArrowDownUpIcon,
  CalendarDaysIcon,
  CircleDotIcon,
  CopyPlusIcon,
  LayoutGridIcon,
  PencilIcon,
  Rows3Icon,
  ShapesIcon,
  SignalHighIcon,
  StarIcon,
  Table2Icon,
  TagsIcon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  Action,
  type CollectionDefinition,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  FilterRadioSubmenu,
  SelectedViewCreate,
  SelectedViewItem,
  SelectedViewItems,
  SelectedViewMenu,
  SelectedViewSearch,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'

interface DemoItem {
  assigneeId: string | null
  id: string
  statusId: string | null
  title: string
}

type FilterKey = 'assignee' | 'date' | 'priority' | 'status' | 'tags'
type Filters = Record<FilterKey, string[]>

const demoCollection: CollectionDefinition<DemoItem> = {
  getKey: (item) => item.id,
  getLabel: (item) => item.title,
  groupings: [
    {
      getGroupId: (item) => item.statusId,
      id: 'status',
      label: 'Status',
      options: [
        { id: 'todo', label: 'A fazer' },
        { id: 'in-progress', label: 'Em andamento' },
        { id: 'review', label: 'Em revisão' },
        { id: 'done', label: 'Concluído' },
      ],
    },
    {
      getGroupId: (item) => item.assigneeId,
      id: 'assignee',
      label: 'Responsável',
      options: [
        { id: 'ana', label: 'Ana Souza' },
        { id: 'bruno', label: 'Bruno Lima' },
      ],
    },
  ],
  items: [],
}

const filterDefinitions = [
  {
    icon: CircleDotIcon,
    id: 'status',
    label: 'Status',
    options: ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'],
  },
  {
    icon: UserRoundIcon,
    id: 'assignee',
    label: 'Responsável',
    options: ['Sem responsável', 'Ana Souza', 'Bruno Lima'],
  },
  {
    icon: SignalHighIcon,
    id: 'priority',
    label: 'Prioridade',
    options: ['Sem prioridade', 'Urgente', 'Alta', 'Média', 'Baixa'],
  },
  {
    icon: TagsIcon,
    id: 'tags',
    label: 'Tags',
    options: ['Documento', 'Retorno', 'Prazo'],
  },
  {
    icon: CalendarDaysIcon,
    id: 'date',
    label: 'Prazo',
    options: ['Hoje', 'Esta semana', 'Atrasado', 'Sem prazo'],
  },
] as const

const viewModes: readonly ViewSettingsMode<'kanban' | 'list' | 'datagrid'>[] = [
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: Table2Icon, label: 'Tabela', value: 'datagrid' },
]

function createEmptyFilters(): Filters {
  return { assignee: [], date: [], priority: [], status: [], tags: [] }
}

function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="w-full max-w-6xl p-6">{children}</div>
}

const selectedViews = [
  { id: 'recent', label: 'Pessoas contatadas recentemente' },
  { id: 'all', label: 'Todas as pessoas' },
  { id: 'overdue', label: 'Aguardando retorno' },
] as const

function ViewIcon() {
  return (
    <span className="inline-flex size-4 items-center justify-center rounded bg-[#c65c50] text-white">
      <LayoutGridIcon aria-hidden="true" className="size-3" />
    </span>
  )
}

function SelectedViewControl({
  searchable = true,
  withCreate = true,
  withOptions = true,
}: Readonly<{
  searchable?: boolean
  withCreate?: boolean
  withOptions?: boolean
}>) {
  const [selectedId, setSelectedId] = useState<string>('recent')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [event, setEvent] = useState('')
  const selected = selectedViews.find((view) => view.id === selectedId)
  const visibleViews = selectedViews.filter((view) =>
    view.label
      .toLocaleLowerCase('pt-BR')
      .includes(query.toLocaleLowerCase('pt-BR')),
  )
  const favoriteViews = visibleViews.filter((view) =>
    favoriteIds.includes(view.id),
  )
  const otherViews = visibleViews.filter(
    (view) => !favoriteIds.includes(view.id),
  )
  const renderView = (view: (typeof selectedViews)[number]) => {
    const isFavorite = favoriteIds.includes(view.id)

    return (
      <SelectedViewItem
        icon={<ViewIcon />}
        key={view.id}
        label={view.label}
        onSelect={() => setSelectedId(view.id)}
        options={
          withOptions && view.id === selectedId ? (
            <>
              <MenuItem
                className="whitespace-nowrap"
                onClick={() =>
                  setFavoriteIds((current) =>
                    isFavorite
                      ? current.filter((id) => id !== view.id)
                      : [...current, view.id],
                  )
                }
              >
                <StarIcon
                  aria-hidden="true"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
                {isFavorite
                  ? 'Remover dos favoritos'
                  : 'Adicionar aos favoritos'}
              </MenuItem>
              <MenuItem onClick={() => setEvent('renomear')}>
                <PencilIcon aria-hidden="true" />
                Renomear
              </MenuItem>
              <MenuItem onClick={() => setEvent('duplicar')}>
                <CopyPlusIcon aria-hidden="true" />
                Duplicar
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                onClick={() => setEvent('excluir')}
                variant="destructive"
              >
                <Trash2Icon aria-hidden="true" />
                Excluir
              </MenuItem>
              <div className="mt-1 border-t px-2 pt-2 pb-1 text-muted-foreground text-xs">
                Criado pela equipe · 30 set 2026
              </div>
            </>
          ) : undefined
        }
        selected={view.id === selectedId}
      />
    )
  }

  return (
    <>
      <SelectedViewMenu
        icon={<ViewIcon />}
        label={selected?.label ?? 'Selecionar view'}
      >
        {searchable ? (
          <SelectedViewSearch onValueChange={setQuery} value={query} />
        ) : null}
        {favoriteViews.length ? (
          <SelectedViewItems label="Favoritos">
            <MenuGroupLabel>Favoritos</MenuGroupLabel>
            {favoriteViews.map(renderView)}
          </SelectedViewItems>
        ) : null}
        {favoriteViews.length && otherViews.length ? <MenuSeparator /> : null}
        {otherViews.length ? (
          <SelectedViewItems>{otherViews.map(renderView)}</SelectedViewItems>
        ) : null}
        {!visibleViews.length ? (
          <MenuItem disabled>Nenhuma view encontrada</MenuItem>
        ) : null}
        {withCreate ? (
          <>
            <MenuSeparator />
            <SelectedViewCreate onClick={() => setEvent('criar')} />
          </>
        ) : null}
      </SelectedViewMenu>
      <span className="sr-only" data-story-event>
        {event}
      </span>
    </>
  )
}

/**
 * Superfície única: o que antes eram dois gatilhos vizinhos (Filtrar e
 * Configurações) vira um menu com seções. O pacote traz a moldura, a contagem e o
 * limpar; as seções e suas opções continuam do consumer.
 */
function MergedViewSettingsControl() {
  const [density, setDensity] = useState<'comfortable' | 'compact'>(
    'comfortable',
  )
  const [filters, setFilters] = useState<Filters>(createEmptyFilters)
  const [layout, setLayout] = useState<'kanban' | 'list' | 'datagrid'>('kanban')
  const [sort, setSort] = useState<'due' | 'updated'>('due')
  const activeCount = Object.values(filters).reduce(
    (count, values) => count + values.length,
    0,
  )

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((currentValue) => currentValue !== value)
        : [...current[key], value],
    }))
  }

  const modified = activeCount > 0 || layout !== 'kanban' || sort !== 'due'

  return (
    <ViewSettingsMenu
      activeFilterCount={activeCount}
      mode={layout}
      modes={viewModes}
      onClearFilters={() => setFilters(createEmptyFilters())}
      onModeChange={setLayout}
      onSavePreference={() => undefined}
      savePreferenceDisabled={!modified}
    >
      <ViewSettingsSection label="Exibição">
        <MenuSub>
          <MenuSubTrigger>
            <Rows3Icon aria-hidden="true" />
            Densidade
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup
              onValueChange={(value) => setDensity(value as typeof density)}
              value={density}
            >
              <MenuRadioItem value="comfortable">Confortável</MenuRadioItem>
              <MenuRadioItem value="compact">Compacta</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
        <MenuSub>
          <MenuSubTrigger>
            <CalendarDaysIcon aria-hidden="true" />
            Ordenar por
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup
              onValueChange={(value) => setSort(value as typeof sort)}
              value={sort}
            >
              <MenuRadioItem value="due">Prazo</MenuRadioItem>
              <MenuRadioItem value="updated">Atualização</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
      </ViewSettingsSection>
      <MenuSeparator />
      <ViewSettingsSection label="Filtros">
        {filterDefinitions.map(({ icon: Icon, id, label, options }) => (
          <MenuSub key={id}>
            <MenuSubTrigger>
              <Icon aria-hidden="true" />
              {label}
            </MenuSubTrigger>
            <MenuSubPopup>
              <MenuGroup>
                <MenuGroupLabel>{label}</MenuGroupLabel>
                {options.map((option) => (
                  <MenuCheckboxItem
                    checked={filters[id].includes(option)}
                    closeOnClick={false}
                    key={option}
                    onCheckedChange={() => toggleFilter(id, option)}
                  >
                    {option}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
            </MenuSubPopup>
          </MenuSub>
        ))}
      </ViewSettingsSection>
    </ViewSettingsMenu>
  )
}

function FourModesViewSettingsControl() {
  const [layout, setLayout] = useState<
    'kanban' | 'list' | 'datagrid' | 'calendar'
  >('list')

  return (
    <ViewSettingsMenu
      mode={layout}
      modes={[
        ...viewModes,
        { icon: CalendarDaysIcon, label: 'Agenda', value: 'calendar' },
      ]}
      onClearFilters={() => undefined}
      onModeChange={setLayout}
    >
      <ViewSettingsSection label="Exibição">
        <MenuItem disabled>Densidade padrão</MenuItem>
      </ViewSettingsSection>
    </ViewSettingsMenu>
  )
}

function ToolbarProposal() {
  return (
    <CollectionProvider collection={demoCollection}>
      <CollectionToolbar
        aria-label="Controles da coleção"
        endSlot={
          <>
            <MergedViewSettingsControl />
            <Action label="Nova tarefa" onClick={() => undefined} />
          </>
        }
        startSlot={<SelectedViewControl />}
        variant="plain"
      />
    </CollectionProvider>
  )
}

/**
 * Coleção que não alterna layout: a busca fica visível à esquerda e o menu
 * carrega só ordenação e um filtro de valor único.
 */
function SingleValueToolbar() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [type, setType] = useState('')
  const activeCount = [search, type].filter(Boolean).length

  return (
    <CollectionToolbar
      aria-label="Controles da coleção"
      endSlot={
        <>
          <ViewSettingsMenu
            activeFilterCount={activeCount}
            onClearFilters={() => {
              setSearch('')
              setType('')
            }}
          >
            <ViewSettingsSection label="Exibição">
              <FilterRadioSubmenu
                clearLabel="Nome (A–Z)"
                icon={ArrowDownUpIcon}
                label="Ordenar por"
                onValueChange={(value) => setSort(value || 'name_asc')}
                options={[
                  ['name_desc', 'Nome (Z–A)'],
                  ['created_desc', 'Mais recentes'],
                ]}
                value={sort === 'name_asc' ? '' : sort}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label="Filtros">
              <FilterRadioSubmenu
                icon={ShapesIcon}
                label="Tipo"
                onValueChange={setType}
                options={[
                  ['person', 'Pessoa'],
                  ['organization', 'Organização'],
                ]}
                value={type}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          <Action label="Novo contato" onClick={() => undefined} />
        </>
      }
      startSlot={
        <CollectionSearchField
          label="Buscar contatos"
          onCommit={setSearch}
          placeholder="Nome, e-mail ou telefone"
          value={search}
        />
      }
      variant="plain"
    />
  )
}

const meta = {
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'plain', 'text'] },
  },
  component: CollectionToolbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Toolbar',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Contrato canônico, o mesmo que a página de Tarefas compõe: view selecionada no slot esquerdo; à direita um só gatilho de Exibição, com filtro e configuração como seções, seguido da ação de inclusão. A permissão é do consumer — sem ela a ação simplesmente não é composta.',
      },
    },
  },
  render: () => (
    <Frame>
      <ToolbarProposal />
    </Frame>
  ),
}

export const WithSelectedView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A view selecionada ocupa o início da toolbar. O menu reúne busca, itens selecionáveis, opções contextuais e criação de uma nova view.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    )

    const menu = within(await screen.findByRole('menu'))
    await expect(
      menu.getByRole('searchbox', { name: 'Buscar views' }),
    ).toBeVisible()
    await expect(
      menu.getByRole('menuitem', { name: 'Pessoas contatadas recentemente' }),
    ).toHaveAttribute('aria-current', 'true')
    await expect(
      menu.getByRole('menuitem', { name: 'Criar nova view' }),
    ).toBeVisible()
  },
  render: () => (
    <Frame>
      <CollectionToolbar
        aria-label="View selecionada da coleção"
        startSlot={<SelectedViewControl />}
        variant="plain"
      />
    </Frame>
  ),
}

export const WithSelectedViewAndSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A busca filtra os itens do menu sem alterar a view selecionada.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Pessoas contatadas recentemente',
      }),
    )
    const menu = within(await screen.findByRole('menu'))
    await userEvent.type(
      menu.getByRole('searchbox', { name: 'Buscar views' }),
      'retorno',
    )
    await expect(
      menu.getByRole('menuitem', { name: 'Aguardando retorno' }),
    ).toBeVisible()
    await expect(
      menu.queryByRole('menuitem', { name: 'Todas as pessoas' }),
    ).toBe(null)
  },
  render: () => (
    <Frame>
      <CollectionToolbar startSlot={<SelectedViewControl />} variant="plain" />
    </Frame>
  ),
}

export const Items: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A lista pode ser composta sozinha, com um item ativo e alternativas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    )
    const menu = within(await screen.findByRole('menu'))
    await expect(menu.queryByRole('searchbox')).toBe(null)
    await expect(
      menu.queryByRole('menuitem', { name: 'Criar nova view' }),
    ).toBe(null)
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Todas as pessoas' }),
    )
    await expect(
      canvas.getByRole('button', { name: 'Todas as pessoas' }),
    ).toBeVisible()
  },
  render: () => (
    <Frame>
      <CollectionToolbar
        startSlot={
          <SelectedViewControl
            searchable={false}
            withCreate={false}
            withOptions={false}
          />
        }
        variant="plain"
      />
    </Frame>
  ),
}

export const ItemOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'O botão de reticências abre as ações contextuais da view ativa.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Pessoas contatadas recentemente',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', {
        name: 'Opções de Pessoas contatadas recentemente',
      }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Renomear' }),
    ).toBeVisible()
    await expect(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    ).toBeVisible()
  },
  render: () => (
    <Frame>
      <CollectionToolbar startSlot={<SelectedViewControl />} variant="plain" />
    </Frame>
  ),
}

export const Favorites: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Favoritar uma view move o item para o grupo Favoritos no início do menu, separado das demais views. A ação pode ser revertida pelo mesmo submenu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Aguardando retorno' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Aguardando retorno' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', {
        name: 'Opções de Aguardando retorno',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Adicionar aos favoritos' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Aguardando retorno' }),
    )

    const menu = within(
      await screen.findByRole('menu', { name: 'Aguardando retorno' }),
    )
    await expect(menu.getByText('Favoritos')).toBeVisible()
    const viewLabels = menu
      .getAllByRole('menuitem')
      .map((item) => item.textContent)
      .filter((label) => selectedViews.some((view) => view.label === label))
    await expect(viewLabels).toEqual([
      'Aguardando retorno',
      'Pessoas contatadas recentemente',
      'Todas as pessoas',
    ])
    await expect(menu.getAllByRole('separator')).toHaveLength(2)
  },
  render: () => (
    <Frame>
      <CollectionToolbar startSlot={<SelectedViewControl />} variant="plain" />
    </Frame>
  ),
}

export const CreateNewView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A ação de criação fica após os itens, com callback definido pelo consumer.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Criar nova view' }),
    )
    await expect(
      canvasElement.querySelector('[data-story-event]')?.textContent,
    ).toBe('criar')
  },
  render: () => (
    <Frame>
      <CollectionToolbar startSlot={<SelectedViewControl />} variant="plain" />
    </Frame>
  ),
}

export const ViewSettings: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'As tabs de layout ficam no topo do menu Exibição, antes das seções. Até três modos, ícone e label ficam inline. A contagem no gatilho inclui apenas filtros ativos.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Um gatilho, não dois: Filtrar e Configurações não coexistem nesta superfície.
    await expect(canvas.queryByRole('button', { name: 'Filtrar' })).toBe(null)
    await expect(canvas.queryByRole('button', { name: 'Configurações' })).toBe(
      null,
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))

    const menu = within(await screen.findByRole('menu'))
    const tabs = menu.getAllByRole('menuitemradio')
    await expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Kanban',
      'Lista',
      'Tabela',
    ])
    for (const tab of tabs) {
      await expect(tab).toHaveAttribute('data-layout', 'inline')
    }
    await expect(
      tabs[0].closest('[data-slot="menu-radio-group"]')?.nextElementSibling,
    ).toHaveAttribute('data-slot', 'menu-group')
    for (const section of ['Exibição', 'Filtros']) {
      await expect(menu.getByText(section)).toBeTruthy()
    }

    // Sem filtro ativo, limpar não tem o que fazer. O item do menu é um `div` com
    // `role=menuitem`, então o estado desabilitado vive em `data-disabled`.
    await expect(
      menu.getByRole('menuitem', { name: /Limpar filtros/ }),
    ).toHaveAttribute('data-disabled')
    // Rascunho igual ao ponto de partida não tem preferência a guardar.
    await expect(
      menu.getByRole('menuitem', { name: /Salvar preferência/ }),
    ).toHaveAttribute('data-disabled')
  },
  render: () => (
    <Frame>
      <CollectionToolbar
        aria-label="Ajustes da coleção"
        endSlot={<MergedViewSettingsControl />}
        variant="plain"
      />
    </Frame>
  ),
}

export const ViewSettingsFourModes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Com quatro modos, cada tab empilha o ícone acima do label para caber no menu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    for (const tab of menu.getAllByRole('menuitemradio')) {
      await expect(tab).toHaveAttribute('data-layout', 'stacked')
    }
  },
  render: () => (
    <Frame>
      <CollectionToolbar
        endSlot={<FourModesViewSettingsControl />}
        variant="plain"
      />
    </Frame>
  ),
}

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Busca visível no slot esquerdo, para a coleção em que procurar é a interação principal — o menu esconderia o controle mais usado da tela. Os filtros de valor único usam o submenu compartilhado, que trata "todos" como ausência de filtro e devolve string vazia.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const field = canvas.getByRole('searchbox', { name: 'Buscar contatos' })
    await userEvent.type(field, 'ana')
    // Digitar não confirma: quem consome escreve na URL, e escrever por tecla
    // empilharia uma entrada de histórico por letra.
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeTruthy()

    await userEvent.keyboard('{Enter}')
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
    ).toBeTruthy()
  },
  render: () => (
    <Frame>
      <SingleValueToolbar />
    </Frame>
  ),
}

export const WithText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A variante text exibe título e descrição no início da toolbar, mantendo Exibição e a ação principal alinhadas à direita.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Controles das tarefas',
    })

    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Tarefas' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Acompanhe e organize o trabalho da equipe.'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible()
  },
  render: () => (
    <Frame>
      <CollectionToolbar
        aria-label="Controles das tarefas"
        description="Acompanhe e organize o trabalho da equipe."
        endSlot={
          <>
            <MergedViewSettingsControl />
            <Action label="Nova tarefa" onClick={() => undefined} />
          </>
        }
        title="Tarefas"
        variant="text"
      />
    </Frame>
  ),
}
