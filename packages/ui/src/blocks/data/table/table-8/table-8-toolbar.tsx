import {
  ArrowClockwiseIcon,
  CircleHalfIcon,
  CreditCardIcon,
  DownloadSimpleIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import type {
  Table8Channel,
  Table8Filters,
  Table8Labels,
  Table8Method,
  Table8Status,
  Table8Transaction,
} from './types'

export const table8Statuses: readonly Table8Status[] = [
  'settled',
  'pending',
  'refunded',
  'failed',
]

export const table8Methods: readonly Table8Method[] = [
  'card',
  'apple-pay',
  'google-pay',
  'paypal',
]

export const table8Channels: readonly Table8Channel[] = [
  'api',
  'web',
  'mobile',
  'pos',
]

export const emptyTable8Filters: Table8Filters = {
  channel: '',
  method: '',
  status: '',
}

export interface Table8ToolbarProps {
  filters: Table8Filters
  labels: Table8Labels
  left: ReactNode
  onExport?: () => void
  onFiltersChange?: (filters: Table8Filters) => void
  onRefresh?: () => void
  onSearchChange?: (search: string) => void
  refreshing: boolean
  search: string
  table: DataTableTable<Table8Transaction>
}

export function Table8Toolbar({
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
}: Readonly<Table8ToolbarProps>) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const setFilter = <TKey extends keyof Table8Filters>(
    key: TKey,
    value: string,
  ) => onFiltersChange?.({ ...filters, [key]: value as Table8Filters[TKey] })

  const searchField = onSearchChange ? (
    <CollectionSearchField
      label={labels.search}
      onCommit={onSearchChange}
      placeholder={labels.search}
      value={search}
    />
  ) : null

  return (
    <TableToolbar
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
            onClearFilters={() => onFiltersChange?.(emptyTable8Filters)}
          >
            <ViewSettingsSection label={labels.display}>
              <DataGridSortSubmenu label={labels.sortBy} table={table} />
              <DataGridDensitySubmenu label={labels.density} table={table} />
              <DataTableColumnsSubmenu
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
                    options={table8Statuses.map((status) => [
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
                    options={table8Methods.map((method) => [
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
                    options={table8Channels.map((channel) => [
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
            <TableToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </TableToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
