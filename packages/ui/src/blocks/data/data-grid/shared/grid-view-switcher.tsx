import {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/ui/patterns/toolbar/components/view-switcher'
import { Separator } from '@tc96/ui/separator'
import { useState } from 'react'
import { defaultGridLocale } from './format'
import type { GridView, GridViewLabels } from './types'

export interface GridViewSwitcherProps {
  activeViewId?: string
  labels: GridViewLabels
  locale?: string
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  views: readonly GridView[]
}

export function GridViewSwitcher({
  activeViewId,
  labels,
  locale = defaultGridLocale,
  onViewChange,
  onViewCreate,
  views,
}: Readonly<GridViewSwitcherProps>) {
  const [query, setQuery] = useState('')
  const activeView = views.find((view) => view.id === activeViewId)
  const needle = query.trim().toLocaleLowerCase(locale)
  const visibleViews = views.filter((view) =>
    view.label.toLocaleLowerCase(locale).includes(needle),
  )

  return (
    <ViewSwitcherMenu label={activeView?.label ?? labels.viewSelect}>
      <ViewSwitcherSearch
        label={labels.viewSearch}
        onValueChange={setQuery}
        placeholder={labels.viewSearchPlaceholder}
        value={query}
      />
      {visibleViews.length ? (
        <ViewSwitcherItems label={labels.views}>
          {visibleViews.map((view) => (
            <ViewSwitcherItem
              key={view.id}
              label={view.label}
              onSelect={() => onViewChange?.(view.id)}
              selected={view.id === activeViewId}
            />
          ))}
        </ViewSwitcherItems>
      ) : (
        <p className="px-2 py-1.5 text-muted-foreground text-sm">
          {labels.viewsEmpty}
        </p>
      )}
      {onViewCreate ? (
        <>
          <Separator />
          <ViewSwitcherCreate
            label={labels.viewCreate}
            onClick={onViewCreate}
          />
        </>
      ) : null}
    </ViewSwitcherMenu>
  )
}
