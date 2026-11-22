import {
  Action,
  CollectionSearchField,
  CollectionToolbar,
  CollectionToolbarGroup,
  FilterRadioSubmenu,
  ViewSettingsMenu,
  ViewSettingsSection,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
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
import { Separator } from '@tc96/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { ToolbarButton } from '@tc96/ui/toolbar'
import {
  ArrowDownUpIcon,
  CalendarDaysIcon,
  CopyPlusIcon,
  Rows3Icon,
  ShapesIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import type { ToolbarControls } from './toolbar-controls.ts'
import {
  type AgendaLayout,
  agendaModes,
  type FilterKey,
  filterDefinitions,
  noFilters,
  type SavedView,
  type SpreadsheetLayout,
  savedViews,
  spreadsheetModes,
  ViewIcon,
  type ViewLayout,
  viewModes,
} from './toolbar-data.tsx'

type Density = 'comfortable' | 'compact'

type ViewSort = 'due' | 'updated'

const ignore = () => undefined

interface DensitySubmenuProps {
  density: Density
  onDensityChange: (density: Density) => void
}

const DensitySubmenu = ({
  density,
  onDensityChange,
}: Readonly<DensitySubmenuProps>) => (
  <MenuSub>
    <MenuSubTrigger>
      <Rows3Icon aria-hidden="true" />
      Densidade
    </MenuSubTrigger>
    <MenuSubPopup>
      <MenuRadioGroup onValueChange={onDensityChange} value={density}>
        <MenuRadioItem value="comfortable">Confortável</MenuRadioItem>
        <MenuRadioItem value="compact">Compacta</MenuRadioItem>
      </MenuRadioGroup>
    </MenuSubPopup>
  </MenuSub>
)

export interface ComposedToolbarProps extends ToolbarControls {
  initialFavoriteIds?: readonly string[]
  initialSelectedId?: string
  narrowSwitcher?: boolean
  views?: readonly SavedView[]
}

export function ComposedToolbar({
  action,
  ariaLabel,
  centerSlot,
  description,
  initialFavoriteIds = [],
  initialSelectedId,
  narrowSwitcher = false,
  settings,
  switcher,
  switcherCreate,
  switcherIcon,
  switcherLoading,
  switcherOptions,
  switcherSearch,
  switcherVariant,
  title,
  variant,
  views = savedViews,
}: Readonly<ComposedToolbarProps>) {
  const [currentViews, setCurrentViews] = useState<SavedView[]>([...views])
  const [selectedId, setSelectedId] = useState(
    initialSelectedId ?? views[0]?.id ?? '',
  )
  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    ...initialFavoriteIds,
  ])
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState<ViewLayout>('kanban')
  const [density, setDensity] = useState<Density>('comfortable')
  const [sort, setSort] = useState<ViewSort>('due')
  const [filters, setFilters] = useState(noFilters)

  const selected = currentViews.find((view) => view.id === selectedId)
  const visibleViews = currentViews.filter((view) =>
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
    setCurrentViews((current) => [...current, { id, label }])
    setSelectedId(id)
  }

  const deleteView = (id: string) => {
    const remaining = currentViews.filter((view) => view.id !== id)
    setCurrentViews(remaining)
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

  const renderView = (view: SavedView) => {
    const favorite = favoriteIds.includes(view.id)
    const isSelected = view.id === selectedId

    return (
      <ViewSwitcherItem
        icon={switcherIcon ? <ViewIcon /> : undefined}
        key={view.id}
        label={view.label}
        onSelect={() => setSelectedId(view.id)}
        options={
          switcherOptions && isSelected ? (
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
                {favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              </MenuItem>
              <MenuItem onClick={() => addView(`${view.label} (cópia)`)}>
                <CopyPlusIcon aria-hidden="true" />
                Duplicar
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                disabled={currentViews.length === 1}
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
        selected={isSelected}
      />
    )
  }

  const switcherMenu = (
    <ViewSwitcherMenu
      icon={switcherIcon ? <ViewIcon /> : undefined}
      label={selected?.label ?? 'Selecionar view'}
      variant={switcherVariant}
    >
      {switcherSearch ? (
        <ViewSwitcherSearch onValueChange={setQuery} value={query} />
      ) : null}
      {switcherLoading ? (
        <ViewSwitcherItems loading>
          {selected ? renderView(selected) : null}
        </ViewSwitcherItems>
      ) : (
        <>
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
            <ViewSwitcherItems>{otherViews.map(renderView)}</ViewSwitcherItems>
          ) : null}
          {visibleViews.length ? null : (
            <p className="px-2 py-1.5 text-muted-foreground text-sm">
              Nenhuma view encontrada
            </p>
          )}
        </>
      )}
      {switcherCreate ? (
        <>
          <Separator />
          <ViewSwitcherCreate onClick={() => addView('Nova view')} />
        </>
      ) : null}
    </ViewSwitcherMenu>
  )

  const settingsMenu = (
    <ViewSettingsMenu
      activeFilterCount={activeFilterCount}
      mode={layout}
      modes={viewModes}
      onClearFilters={() => setFilters(noFilters)}
      onModeChange={setLayout}
      onSavePreference={ignore}
      savePreferenceDisabled={!modified}
    >
      <ViewSettingsSection label="Exibição">
        <DensitySubmenu density={density} onDensityChange={setDensity} />
        <MenuSub>
          <MenuSubTrigger>
            <CalendarDaysIcon aria-hidden="true" />
            Ordenar por
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup onValueChange={setSort} value={sort}>
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

  const slots = {
    centerSlot: centerSlot ? (
      <ToggleGroup aria-label="Período" defaultValue={['week']}>
        <ToggleGroupItem value="day">Dia</ToggleGroupItem>
        <ToggleGroupItem value="week">Semana</ToggleGroupItem>
        <ToggleGroupItem value="month">Mês</ToggleGroupItem>
      </ToggleGroup>
    ) : undefined,
    endSlot:
      settings || action ? (
        <>
          {settings ? settingsMenu : null}
          {action ? <Action label="Nova tarefa" onClick={ignore} /> : null}
        </>
      ) : undefined,
    startSlot: switcher ? (
      narrowSwitcher ? (
        <div className="w-48 min-w-0">{switcherMenu}</div>
      ) : (
        switcherMenu
      )
    ) : undefined,
  }

  return variant === 'text' ? (
    <CollectionToolbar
      aria-label={ariaLabel}
      description={description}
      title={title}
      variant="text"
      {...slots}
    />
  ) : (
    <CollectionToolbar aria-label={ariaLabel} variant={variant} {...slots} />
  )
}

export function SearchFieldToolbar() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [type, setType] = useState('')
  const activeFilterCount = [search, type].filter(Boolean).length

  return (
    <CollectionToolbar
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
          <Action label="Novo contato" onClick={ignore} />
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
}

export function ThreeModesToolbar() {
  const [layout, setLayout] = useState<SpreadsheetLayout>('datatable')
  const [density, setDensity] = useState<Density>('comfortable')

  return (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu
          mode={layout}
          modes={spreadsheetModes}
          onClearFilters={ignore}
          onModeChange={setLayout}
        >
          <ViewSettingsSection label="Exibição">
            <DensitySubmenu density={density} onDensityChange={setDensity} />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  )
}

export function FourModesToolbar() {
  const [layout, setLayout] = useState<AgendaLayout>('list')
  const [density, setDensity] = useState<Density>('comfortable')

  return (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu
          mode={layout}
          modes={agendaModes}
          onClearFilters={ignore}
          onModeChange={setLayout}
        >
          <ViewSettingsSection label="Exibição">
            <DensitySubmenu density={density} onDensityChange={setDensity} />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  )
}

export function ChildrenToolbar() {
  return (
    <CollectionToolbar
      endSlot={<Action label="Nova tarefa" onClick={ignore} />}
    >
      <CollectionToolbarGroup aria-label="Atalhos de prazo">
        <ToolbarButton render={<Button size="sm" variant="outline" />}>
          Hoje
        </ToolbarButton>
        <ToolbarButton render={<Button size="sm" variant="outline" />}>
          Esta semana
        </ToolbarButton>
      </CollectionToolbarGroup>
    </CollectionToolbar>
  )
}
