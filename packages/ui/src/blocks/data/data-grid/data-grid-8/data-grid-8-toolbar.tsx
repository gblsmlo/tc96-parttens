import {
  ArrowClockwiseIcon,
  CircleHalfIcon,
  CreditCardIcon,
  DownloadSimpleIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/ui/patterns/toolbar/components/view-switcher'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import type {
  DataGrid8Channel,
  DataGrid8Filters,
  DataGrid8Labels,
  DataGrid8Method,
  DataGrid8Status,
  DataGrid8Transaction,
  DataGrid8View,
} from './types'

export const dataGrid8Statuses: readonly DataGrid8Status[] = [
  'settled',
  'pending',
  'refunded',
  'failed',
]

export const dataGrid8Methods: readonly DataGrid8Method[] = [
  'card',
  'apple-pay',
  'google-pay',
  'paypal',
]

export const dataGrid8Channels: readonly DataGrid8Channel[] = [
  'api',
  'web',
  'mobile',
  'pos',
]

export const emptyDataGrid8Filters: DataGrid8Filters = {
  channel: '',
  method: '',
  status: '',
}

export interface DataGrid8ToolbarProps {
  activeViewId?: string
  description: string
  filters: DataGrid8Filters
  labels: DataGrid8Labels
  onExport?: () => void
  onFiltersChange?: (filters: DataGrid8Filters) => void
  onRefresh?: () => void
  onSearchChange?: (search: string) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  refreshing: boolean
  search: string
  table: UseDataGridReturn<DataGrid8Transaction>['table']
  views?: DataGrid8View[]
}

function DataGrid8ViewSwitcher({
  activeViewId,
  labels,
  onViewChange,
  onViewCreate,
  views,
}: Readonly<{
  activeViewId?: string
  labels: DataGrid8Labels
  onViewChange: (viewId: string) => void
  onViewCreate?: () => void
  views: DataGrid8View[]
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

export function DataGrid8Toolbar({
  activeViewId,
  description,
  filters,
  labels,
  onExport,
  onFiltersChange,
  onRefresh,
  onSearchChange,
  onViewChange,
  onViewCreate,
  refreshing,
  search,
  table,
  views,
}: Readonly<DataGrid8ToolbarProps>) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const setFilter = <TKey extends keyof DataGrid8Filters>(
    key: TKey,
    value: string,
  ) => onFiltersChange?.({ ...filters, [key]: value as DataGrid8Filters[TKey] })

  const switcher =
    views && onViewChange ? (
      <DataGrid8ViewSwitcher
        activeViewId={activeViewId}
        labels={labels}
        onViewChange={onViewChange}
        onViewCreate={onViewCreate}
        views={views}
      />
    ) : null
  const searchField = onSearchChange ? (
    <CollectionSearchField
      label={labels.search}
      onCommit={onSearchChange}
      placeholder={labels.search}
      value={search}
    />
  ) : null

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      description={description}
      endSlot={
        <>
          {searchField}
          {onRefresh ? (
            <ToolbarButton
              aria-busy={refreshing || undefined}
              disabled={refreshing}
              onClick={onRefresh}
              render={<Button size="sm" type="button" variant="ghost" />}
            >
              <ArrowClockwiseIcon
                aria-hidden="true"
                className={cn(
                  refreshing && 'animate-spin motion-reduce:animate-none',
                )}
                data-refreshing={refreshing ? 'true' : undefined}
              />
              {labels.refresh}
            </ToolbarButton>
          ) : null}
          <ViewSettingsMenu
            activeFilterCount={onFiltersChange ? activeFilterCount : 0}
            clearLabel={labels.clearFilters}
            label={labels.viewSettings}
            onClearFilters={() => onFiltersChange?.(emptyDataGrid8Filters)}
          >
            <ViewSettingsSection label={labels.display}>
              <DataGridSortSubmenu label={labels.sortBy} table={table} />
              <DataGridDensitySubmenu label={labels.density} table={table} />
              <DataGridColumnsSubmenu
                label={labels.columnsMenu}
                table={table}
              />
            </ViewSettingsSection>
            {onFiltersChange ? (
              <>
                <MenuSeparator />
                <ViewSettingsSection label={labels.filters}>
                  <FilterRadioSubmenu
                    clearLabel={labels.allOptions}
                    icon={CircleHalfIcon}
                    label={labels.columns.status}
                    onValueChange={(value) => setFilter('status', value)}
                    options={dataGrid8Statuses.map((status) => [
                      status,
                      labels.statuses[status],
                    ])}
                    value={filters.status}
                  />
                  <FilterRadioSubmenu
                    clearLabel={labels.allOptions}
                    icon={CreditCardIcon}
                    label={labels.columns.method}
                    onValueChange={(value) => setFilter('method', value)}
                    options={dataGrid8Methods.map((method) => [
                      method,
                      labels.methods[method],
                    ])}
                    value={filters.method}
                  />
                  <FilterRadioSubmenu
                    clearLabel={labels.allOptions}
                    icon={ShareNetworkIcon}
                    label={labels.columns.channel}
                    onValueChange={(value) => setFilter('channel', value)}
                    options={dataGrid8Channels.map((channel) => [
                      channel,
                      labels.channels[channel],
                    ])}
                    value={filters.channel}
                  />
                </ViewSettingsSection>
              </>
            ) : null}
          </ViewSettingsMenu>
          {onExport ? (
            <GridToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </GridToolbarButton>
          ) : null}
        </>
      }
      startSlot={switcher ?? undefined}
      title={labels.title}
    />
  )
}
