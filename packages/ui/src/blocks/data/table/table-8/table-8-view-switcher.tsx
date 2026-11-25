import {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/ui/patterns/view-switcher/components/view-switcher'
import { useState } from 'react'
import type { Table8Labels, Table8View } from './types'

export function Table8ViewSwitcher({
  activeViewId,
  labels,
  onViewChange,
  onViewCreate,
  views,
}: Readonly<{
  activeViewId?: string
  labels: Table8Labels
  onViewChange: (viewId: string) => void
  onViewCreate?: () => void
  views: Table8View[]
}>) {
  const [query, setQuery] = useState('')
  const active = views.find((view) => view.id === activeViewId)
  const needle = query.trim().toLocaleLowerCase()
  const visible = needle
    ? views.filter((view) => view.label.toLocaleLowerCase().includes(needle))
    : views

  return (
    <ViewSwitcherMenu label={active?.label ?? labels.views}>
      <ViewSwitcherSearch
        label={labels.searchViews}
        onValueChange={setQuery}
        placeholder={labels.searchViews}
        value={query}
      />
      <ViewSwitcherItems label={labels.views}>
        {visible.map((view) => (
          <ViewSwitcherItem
            key={view.id}
            label={view.label}
            onSelect={() => onViewChange(view.id)}
            selected={view.id === activeViewId}
          />
        ))}
      </ViewSwitcherItems>
      {onViewCreate ? (
        <ViewSwitcherCreate label={labels.createView} onClick={onViewCreate} />
      ) : null}
    </ViewSwitcherMenu>
  )
}
