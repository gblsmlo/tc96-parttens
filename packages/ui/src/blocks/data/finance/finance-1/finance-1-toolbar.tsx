import {
  ArrowClockwiseIcon,
  CircleHalfIcon,
  CreditCardIcon,
  DownloadSimpleIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import { finance1Statuses } from './finance-1-options'
import type {
  Finance1Channel,
  Finance1Filters,
  Finance1Labels,
  Finance1Method,
  Finance1Transaction,
} from './types'

export const finance1Methods: readonly Finance1Method[] = [
  'card',
  'apple-pay',
  'google-pay',
  'paypal',
]

export const finance1Channels: readonly Finance1Channel[] = [
  'api',
  'web',
  'mobile',
  'pos',
]

export const emptyFinance1Filters: Finance1Filters = {
  channel: '',
  method: '',
  status: '',
}

export interface Finance1ToolbarProps {
  filters: Finance1Filters
  labels: Finance1Labels
  left: ReactNode
  onExport?: () => void
  onFiltersChange?: (filters: Finance1Filters) => void
  onRefresh?: () => void
  onSearchChange?: (search: string) => void
  refreshing: boolean
  search: string
  table: UseDataGridReturn<Finance1Transaction>['table']
}

export function Finance1Toolbar({
  filters,
  labels,
  left,
  onExport,
  onFiltersChange,
  onRefresh,
  onSearchChange,
  refreshing,
  search,
  table,
}: Readonly<Finance1ToolbarProps>) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const setFilter = <TKey extends keyof Finance1Filters>(
    key: TKey,
    value: string,
  ) => onFiltersChange?.({ ...filters, [key]: value as Finance1Filters[TKey] })

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
      left={left}
      right={
        <>
          {searchField}
          {onRefresh ? (
            <ToolbarButton
              aria-busy={refreshing || undefined}
              disabled={refreshing}
              onClick={onRefresh}
              render={<Button type="button" variant="ghost" />}
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
            onClearFilters={() => onFiltersChange?.(emptyFinance1Filters)}
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
                    options={finance1Statuses.map((status) => [
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
                    options={finance1Methods.map((method) => [
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
                    options={finance1Channels.map((channel) => [
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
    />
  )
}
