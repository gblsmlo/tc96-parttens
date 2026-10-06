import {
  SelectedViewCreate,
  SelectedViewItem,
  SelectedViewItems,
  SelectedViewMenu,
  SelectedViewSearch,
} from '@tc96/parttens'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { Separator } from '@tc96/ui/separator'
import {
  CopyPlusIcon,
  LayoutGridIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'

export interface SelectedViewOption {
  id: string
  label: string
}

export interface SelectedViewPickerProps {
  footer?: ReactNode
  onCreate?: () => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onRename?: (id: string) => void
  onSelect: (id: string) => void
  searchable?: boolean
  selectedId: string
  views: readonly SelectedViewOption[]
  withOptions?: boolean
}

export function ViewIcon() {
  return (
    <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
      <LayoutGridIcon aria-hidden="true" className="size-3" />
    </span>
  )
}

export function SelectedViewPicker({
  footer,
  onCreate,
  onDelete,
  onDuplicate,
  onRename,
  onSelect,
  searchable = true,
  selectedId,
  views,
  withOptions = true,
}: Readonly<SelectedViewPickerProps>) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const selected = views.find((view) => view.id === selectedId)
  const visibleViews = views.filter((view) =>
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
  const hasManagement = Boolean(onRename || onDuplicate || onDelete)

  const renderView = (view: SelectedViewOption) => {
    const isFavorite = favoriteIds.includes(view.id)

    return (
      <SelectedViewItem
        icon={<ViewIcon />}
        key={view.id}
        label={view.label}
        onSelect={() => onSelect(view.id)}
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
              {onRename ? (
                <MenuItem onClick={() => onRename(view.id)}>
                  <PencilIcon aria-hidden="true" />
                  Renomear
                </MenuItem>
              ) : null}
              {onDuplicate ? (
                <MenuItem onClick={() => onDuplicate(view.id)}>
                  <CopyPlusIcon aria-hidden="true" />
                  Duplicar
                </MenuItem>
              ) : null}
              {hasManagement ? <MenuSeparator /> : null}
              {onDelete ? (
                <MenuItem
                  onClick={() => onDelete(view.id)}
                  variant="destructive"
                >
                  <Trash2Icon aria-hidden="true" />
                  Excluir
                </MenuItem>
              ) : null}
              {footer ? (
                <div className="mt-1 border-t px-2 pt-2 pb-1 text-muted-foreground text-xs">
                  {footer}
                </div>
              ) : null}
            </>
          ) : undefined
        }
        selected={view.id === selectedId}
      />
    )
  }

  return (
    <SelectedViewMenu
      icon={<ViewIcon />}
      label={selected?.label ?? 'Selecionar view'}
    >
      {searchable ? (
        <SelectedViewSearch onValueChange={setQuery} value={query} />
      ) : null}
      {favoriteViews.length ? (
        <SelectedViewItems label="Favoritos">
          <p
            aria-hidden="true"
            className="px-2 py-1 font-medium text-muted-foreground text-xs"
          >
            Favoritos
          </p>
          {favoriteViews.map(renderView)}
        </SelectedViewItems>
      ) : null}
      {favoriteViews.length && otherViews.length ? <Separator /> : null}
      {otherViews.length ? (
        <SelectedViewItems>{otherViews.map(renderView)}</SelectedViewItems>
      ) : null}
      {!visibleViews.length ? (
        <p className="px-2 py-1.5 text-muted-foreground text-sm">
          Nenhuma view encontrada
        </p>
      ) : null}
      {onCreate ? (
        <>
          <Separator />
          <SelectedViewCreate onClick={onCreate} />
        </>
      ) : null}
    </SelectedViewMenu>
  )
}
