import { CopySimpleIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/ui/patterns'
import { Separator } from '@tc96/ui/separator'
import { useState } from 'react'
import type { ViewSwitcherControls } from './view-switcher-controls.ts'
import { type SavedView, savedViews, ViewIcon } from './view-switcher-data.tsx'

export interface ComposedViewSwitcherProps extends ViewSwitcherControls {
  initialFavoriteIds?: readonly string[]
  initialSelectedId?: string
  narrow?: boolean
  views?: readonly SavedView[]
}

export function ComposedViewSwitcher({
  create,
  icon,
  initialFavoriteIds = [],
  initialSelectedId,
  loading,
  narrow = false,
  options,
  search,
  variant,
  views = savedViews,
}: Readonly<ComposedViewSwitcherProps>) {
  const [currentViews, setCurrentViews] = useState<SavedView[]>([...views])
  const [selectedId, setSelectedId] = useState(
    initialSelectedId ?? views[0]?.id ?? '',
  )
  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    ...initialFavoriteIds,
  ])
  const [query, setQuery] = useState('')

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
  const viewIcon = icon ? <ViewIcon aria-hidden="true" /> : undefined

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

  const renderView = (view: SavedView) => {
    const favorite = favoriteIds.includes(view.id)
    const isSelected = view.id === selectedId

    return (
      <ViewSwitcherItem
        icon={
          favorite ? (
            <StarIcon
              aria-hidden="true"
              className="text-warning"
              weight="fill"
            />
          ) : (
            viewIcon
          )
        }
        key={view.id}
        label={view.label}
        onSelect={() => setSelectedId(view.id)}
        options={
          options && isSelected ? (
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
                <CopySimpleIcon aria-hidden="true" />
                Duplicar
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                disabled={currentViews.length === 1}
                onClick={() => deleteView(view.id)}
                variant="destructive"
              >
                <TrashIcon aria-hidden="true" />
                Excluir
              </MenuItem>
            </>
          ) : undefined
        }
        selected={isSelected}
      />
    )
  }

  const menu = (
    <ViewSwitcherMenu
      icon={viewIcon}
      label={selected?.label ?? 'Selecionar view'}
      variant={variant}
    >
      {search ? (
        <ViewSwitcherSearch onValueChange={setQuery} value={query} />
      ) : null}
      {loading ? (
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
      {create ? (
        <>
          <Separator />
          <ViewSwitcherCreate onClick={() => addView('Nova view')} />
        </>
      ) : null}
    </ViewSwitcherMenu>
  )

  return narrow ? <div className="w-48 min-w-0">{menu}</div> : menu
}

export const FavoritesAboveLayout = (
  controls: Readonly<ViewSwitcherControls>,
) => (
  <ComposedViewSwitcher
    {...controls}
    initialFavoriteIds={['all', 'overdue']}
    initialSelectedId="all"
  />
)
