import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  CollectionSearchField,
  CollectionToolbar,
  FilterRadioSubmenu,
  MenuCheckboxOption,
  MenuRadioOption,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { Separator } from '@tc96/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import {
  ArrowDownUpIcon,
  CalendarDaysIcon,
  CircleDotIcon,
  CopyPlusIcon,
  LayoutGridIcon,
  Rows3Icon,
  ShapesIcon,
  SignalHighIcon,
  StarIcon,
  Table2Icon,
  TagsIcon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { collectionToolbarArgTypes } from '../../test-utils/story-arg-types'

interface SavedView {
  id: string
  label: string
}

const views: SavedView[] = [
  { id: 'recent', label: 'Pessoas contatadas recentemente' },
  { id: 'all', label: 'Todas as pessoas' },
  { id: 'overdue', label: 'Aguardando retorno' },
]

type FilterKey = 'assignee' | 'date' | 'priority' | 'status' | 'tags'
type Filters = Record<FilterKey, readonly string[]>

const noFilters: Filters = {
  assignee: [],
  date: [],
  priority: [],
  status: [],
  tags: [],
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

const spreadsheetModes: readonly ViewSettingsMode<
  'datagrid' | 'datatable' | 'kanban'
>[] = [
  { icon: Table2Icon, label: 'Tabela', value: 'datatable' },
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: Table2Icon, label: 'Planilha', value: 'datagrid' },
]

const agendaModes: readonly ViewSettingsMode<
  'kanban' | 'list' | 'datagrid' | 'calendar'
>[] = [
  { icon: LayoutGridIcon, label: 'Kanban', value: 'kanban' },
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: Table2Icon, label: 'Tabela', value: 'datagrid' },
  { icon: CalendarDaysIcon, label: 'Agenda', value: 'calendar' },
]

const meta = {
  args: {
    'aria-label': 'Controles da coleção',
    variant: 'plain',
  },
  argTypes: collectionToolbarArgTypes,
  component: CollectionToolbar,
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Patterns/Toolbar',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Contrato canônico, o mesmo que a página de Tarefas compõe. No slot esquerdo, a view selecionada: o popover reúne busca, as views (as favoritas num grupo próprio no início), as opções da view ativa e a criação de uma nova view. À direita, um só gatilho de Exibição, com as tabs de layout no topo e filtro e configuração como seções, seguido da ação de inclusão. A contagem no gatilho inclui apenas filtros ativos. A permissão é do consumer — sem ela a ação simplesmente não é composta.',
      },
    },
  },
  render: function Default(args) {
    const [savedViews, setSavedViews] = useState(views)
    const [selectedId, setSelectedId] = useState('recent')
    const [favoriteIds, setFavoriteIds] = useState<string[]>([])
    const [query, setQuery] = useState('')
    const [layout, setLayout] = useState<'kanban' | 'list' | 'datagrid'>(
      'kanban',
    )
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
      'comfortable',
    )
    const [sort, setSort] = useState<'due' | 'updated'>('due')
    const [filters, setFilters] = useState(noFilters)

    const selected = savedViews.find((view) => view.id === selectedId)
    const visibleViews = savedViews.filter((view) =>
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
    const activeFilterCount = Object.values(filters).reduce(
      (count, values) => count + values.length,
      0,
    )
    const modified =
      activeFilterCount > 0 || layout !== 'kanban' || sort !== 'due'

    const addView = (label: string) => {
      const id = crypto.randomUUID()
      setSavedViews((current) => [...current, { id, label }])
      setSelectedId(id)
    }

    const deleteView = (id: string) => {
      const remaining = savedViews.filter((view) => view.id !== id)
      setSavedViews(remaining)
      setFavoriteIds((current) => current.filter((item) => item !== id))
      setSelectedId(remaining[0]?.id ?? '')
    }

    const toggleFilter = (key: FilterKey, value: string) => {
      setFilters((current) => ({
        ...current,
        [key]: current[key].includes(value)
          ? current[key].filter((item) => item !== value)
          : [...current[key], value],
      }))
    }

    const viewIcon = (
      <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
        <LayoutGridIcon aria-hidden="true" className="size-3" />
      </span>
    )

    const renderView = (view: SavedView) => {
      const favorite = favoriteIds.includes(view.id)

      return (
        <ViewSwitcherItem
          icon={viewIcon}
          key={view.id}
          label={view.label}
          onSelect={() => setSelectedId(view.id)}
          options={
            view.id === selectedId ? (
              <>
                <MenuItem
                  className="whitespace-nowrap"
                  onClick={() =>
                    setFavoriteIds((current) =>
                      favorite
                        ? current.filter((item) => item !== view.id)
                        : [...current, view.id],
                    )
                  }
                >
                  <StarIcon
                    aria-hidden="true"
                    fill={favorite ? 'currentColor' : 'none'}
                  />
                  {favorite
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'}
                </MenuItem>
                <MenuItem onClick={() => addView(`${view.label} (cópia)`)}>
                  <CopyPlusIcon aria-hidden="true" />
                  Duplicar
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  disabled={savedViews.length === 1}
                  onClick={() => deleteView(view.id)}
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
      <CollectionToolbar
        {...args}
        endSlot={
          <>
            <ViewSettingsMenu
              activeFilterCount={activeFilterCount}
              mode={layout}
              modes={viewModes}
              onClearFilters={() => setFilters(noFilters)}
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
                    <MenuRadioGroup onValueChange={setDensity} value={density}>
                      <MenuRadioOption value="comfortable">
                        Confortável
                      </MenuRadioOption>
                      <MenuRadioOption value="compact">
                        Compacta
                      </MenuRadioOption>
                    </MenuRadioGroup>
                  </MenuSubPopup>
                </MenuSub>
                <MenuSub>
                  <MenuSubTrigger>
                    <CalendarDaysIcon aria-hidden="true" />
                    Ordenar por
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuRadioGroup onValueChange={setSort} value={sort}>
                      <MenuRadioOption value="due">Prazo</MenuRadioOption>
                      <MenuRadioOption value="updated">
                        Atualização
                      </MenuRadioOption>
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
                          <MenuCheckboxOption
                            checked={filters[id].includes(option)}
                            closeOnClick={false}
                            key={option}
                            onCheckedChange={() => toggleFilter(id, option)}
                          >
                            {option}
                          </MenuCheckboxOption>
                        ))}
                      </MenuGroup>
                    </MenuSubPopup>
                  </MenuSub>
                ))}
              </ViewSettingsSection>
            </ViewSettingsMenu>
            <Action label="Nova tarefa" onClick={() => undefined} />
          </>
        }
        startSlot={
          <ViewSwitcherMenu
            icon={viewIcon}
            label={selected?.label ?? 'Selecionar view'}
          >
            <ViewSwitcherSearch onValueChange={setQuery} value={query} />
            {favoriteViews.length ? (
              <ViewSwitcherItems label="Favoritos">
                <p
                  aria-hidden="true"
                  className="px-2 py-1 font-medium text-muted-foreground text-xs"
                >
                  Favoritos
                </p>
                {favoriteViews.map(renderView)}
              </ViewSwitcherItems>
            ) : null}
            {favoriteViews.length && otherViews.length ? <Separator /> : null}
            {otherViews.length ? (
              <ViewSwitcherItems>
                {otherViews.map(renderView)}
              </ViewSwitcherItems>
            ) : null}
            {visibleViews.length ? null : (
              <p className="px-2 py-1.5 text-muted-foreground text-sm">
                Nenhuma view encontrada
              </p>
            )}
            <Separator />
            <ViewSwitcherCreate onClick={() => addView('Nova view')} />
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const ViewSettingsInteraction: Story = {
  ...Default,
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
  tags: interaction,
}

export const ViewSettingsThreeModes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Com três modos de rótulo longo (Tabela, Kanban e Planilha), o menu alarga para caber os três labels inteiros, sem reticências.',
      },
    },
  },
  render: function ViewSettingsThreeModes(args) {
    const [layout, setLayout] = useState<'datagrid' | 'datatable' | 'kanban'>(
      'datatable',
    )
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
      'comfortable',
    )

    return (
      <CollectionToolbar
        {...args}
        endSlot={
          <ViewSettingsMenu
            mode={layout}
            modes={spreadsheetModes}
            onClearFilters={() => undefined}
            onModeChange={setLayout}
          >
            <ViewSettingsSection label="Exibição">
              <MenuSub>
                <MenuSubTrigger>
                  <Rows3Icon aria-hidden="true" />
                  Densidade
                </MenuSubTrigger>
                <MenuSubPopup>
                  <MenuRadioGroup onValueChange={setDensity} value={density}>
                    <MenuRadioOption value="comfortable">
                      Confortável
                    </MenuRadioOption>
                    <MenuRadioOption value="compact">Compacta</MenuRadioOption>
                  </MenuRadioGroup>
                </MenuSubPopup>
              </MenuSub>
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
    )
  },
}

export const ViewSettingsThreeModesInteraction: Story = {
  ...ViewSettingsThreeModes,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    const tabs = menu.getAllByRole('menuitemradio')
    await expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Tabela',
      'Kanban',
      'Planilha',
    ])
    for (const tab of tabs) {
      await expect(tab).toHaveAttribute('data-layout', 'inline')
      const label = tab.querySelector('.truncate')
      if (!(label instanceof HTMLElement))
        throw new Error('The mode tab did not render its label.')
      await waitFor(() =>
        expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth),
      )
    }
  },
  tags: interaction,
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
  render: function ViewSettingsFourModes(args) {
    const [layout, setLayout] = useState<
      'kanban' | 'list' | 'datagrid' | 'calendar'
    >('list')
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
      'comfortable',
    )

    return (
      <CollectionToolbar
        {...args}
        endSlot={
          <ViewSettingsMenu
            mode={layout}
            modes={agendaModes}
            onClearFilters={() => undefined}
            onModeChange={setLayout}
          >
            <ViewSettingsSection label="Exibição">
              <MenuSub>
                <MenuSubTrigger>
                  <Rows3Icon aria-hidden="true" />
                  Densidade
                </MenuSubTrigger>
                <MenuSubPopup>
                  <MenuRadioGroup onValueChange={setDensity} value={density}>
                    <MenuRadioOption value="comfortable">
                      Confortável
                    </MenuRadioOption>
                    <MenuRadioOption value="compact">Compacta</MenuRadioOption>
                  </MenuRadioGroup>
                </MenuSubPopup>
              </MenuSub>
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
    )
  },
}

export const ViewSettingsFourModesInteraction: Story = {
  ...ViewSettingsFourModes,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    for (const tab of menu.getAllByRole('menuitemradio')) {
      await expect(tab).toHaveAttribute('data-layout', 'stacked')
    }
  },
  tags: interaction,
}

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Busca visível no slot esquerdo, para a coleção em que procurar é a interação principal — o menu esconderia o controle mais usado da tela. A coleção não alterna layout, então o menu carrega só ordenação e um filtro de valor único, pelo submenu compartilhado, que trata "todos" como ausência de filtro e devolve string vazia.',
      },
    },
  },
  render: function WithSearch(args) {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('name_asc')
    const [type, setType] = useState('')
    const activeFilterCount = [search, type].filter(Boolean).length

    return (
      <CollectionToolbar
        {...args}
        endSlot={
          <>
            <ViewSettingsMenu
              activeFilterCount={activeFilterCount}
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
      />
    )
  },
}

export const WithSearchInteraction: Story = {
  ...WithSearch,
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
  tags: interaction,
}

export const WithText: Story = {
  args: {
    'aria-label': 'Controles das tarefas',
    description: 'Acompanhe e organize o trabalho da equipe.',
    title: 'Tarefas',
    variant: 'text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A variante text exibe título e descrição no início da toolbar, mantendo Exibição e a ação principal alinhadas à direita.',
      },
    },
  },
  render: function WithText(args) {
    const [layout, setLayout] = useState<'kanban' | 'list' | 'datagrid'>(
      'kanban',
    )
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
      'comfortable',
    )

    return (
      <CollectionToolbar
        {...args}
        endSlot={
          <>
            <ViewSettingsMenu
              mode={layout}
              modes={viewModes}
              onClearFilters={() => undefined}
              onModeChange={setLayout}
            >
              <ViewSettingsSection label="Exibição">
                <MenuSub>
                  <MenuSubTrigger>
                    <Rows3Icon aria-hidden="true" />
                    Densidade
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuRadioGroup onValueChange={setDensity} value={density}>
                      <MenuRadioOption value="comfortable">
                        Confortável
                      </MenuRadioOption>
                      <MenuRadioOption value="compact">
                        Compacta
                      </MenuRadioOption>
                    </MenuRadioGroup>
                  </MenuSubPopup>
                </MenuSub>
              </ViewSettingsSection>
            </ViewSettingsMenu>
            <Action label="Nova tarefa" onClick={() => undefined} />
          </>
        }
      />
    )
  },
}

export const WithTextInteraction: Story = {
  ...WithText,
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
  tags: interaction,
}

export const WithCenterSlot: Story = {
  args: {
    centerSlot: (
      <ToggleGroup aria-label="Período" defaultValue={['week']}>
        <ToggleGroupItem value="day">Dia</ToggleGroupItem>
        <ToggleGroupItem value="week">Semana</ToggleGroupItem>
        <ToggleGroupItem value="month">Mês</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A control in `centerSlot` sits in the middle of the toolbar: the start and end groups split the remaining width equally, so the center does not drift when one side is wider.',
      },
    },
  },
  render: function WithCenterSlot(args) {
    const [selectedId, setSelectedId] = useState('recent')
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
      'comfortable',
    )
    const selected = views.find((view) => view.id === selectedId)

    const viewIcon = (
      <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
        <LayoutGridIcon aria-hidden="true" className="size-3" />
      </span>
    )

    return (
      <CollectionToolbar
        {...args}
        endSlot={
          <>
            <ViewSettingsMenu onClearFilters={() => undefined}>
              <ViewSettingsSection label="Exibição">
                <MenuSub>
                  <MenuSubTrigger>
                    <Rows3Icon aria-hidden="true" />
                    Densidade
                  </MenuSubTrigger>
                  <MenuSubPopup>
                    <MenuRadioGroup onValueChange={setDensity} value={density}>
                      <MenuRadioOption value="comfortable">
                        Confortável
                      </MenuRadioOption>
                      <MenuRadioOption value="compact">
                        Compacta
                      </MenuRadioOption>
                    </MenuRadioGroup>
                  </MenuSubPopup>
                </MenuSub>
              </ViewSettingsSection>
            </ViewSettingsMenu>
            <Action label="Nova tarefa" onClick={() => undefined} />
          </>
        }
        startSlot={
          <ViewSwitcherMenu
            icon={viewIcon}
            label={selected?.label ?? 'Selecionar view'}
          >
            <ViewSwitcherItems>
              {views.map((view) => (
                <ViewSwitcherItem
                  icon={viewIcon}
                  key={view.id}
                  label={view.label}
                  onSelect={() => setSelectedId(view.id)}
                  selected={view.id === selectedId}
                />
              ))}
            </ViewSwitcherItems>
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const WithCenterSlotInteraction: Story = {
  ...WithCenterSlot,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Controles da coleção',
    })
    const center = canvas
      .getByRole('group', { name: 'Período' })
      .closest('[data-slot="toolbar-group"]')
    if (!(center instanceof HTMLElement))
      throw new Error('The center slot did not render.')

    const toolbarRect = toolbar.getBoundingClientRect()
    const centerRect = center.getBoundingClientRect()
    await expect(
      Math.abs(
        centerRect.left +
          centerRect.width / 2 -
          (toolbarRect.left + toolbarRect.width / 2),
      ),
    ).toBeLessThan(1)
  },
  tags: interaction,
}
