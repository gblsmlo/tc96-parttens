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
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import { finance2Statuses } from './finance-2-options'
import type {
  Finance2Channel,
  Finance2Filters,
  Finance2Labels,
  Finance2Method,
  Finance2Transaction,
} from './types'

export const finance2Methods: readonly Finance2Method[] = [
  'card',
  'apple-pay',
  'google-pay',
  'paypal',
]

export const finance2Channels: readonly Finance2Channel[] = [
  'api',
  'web',
  'mobile',
  'pos',
]

export const emptyFinance2Filters: Finance2Filters = {
  channel: '',
  method: '',
  status: '',
}

export interface Finance2ToolbarProps {
  filters: Finance2Filters
  labels: Finance2Labels
  left: ReactNode
  onExport?: () => void
  onFiltersChange?: (filters: Finance2Filters) => void
  onRefresh?: () => void
  onSearchChange?: (search: string) => void
  refreshing: boolean
  search: string
  table: DataTableTable<Finance2Transaction>
}

export function Finance2Toolbar({
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
}: Readonly<Finance2ToolbarProps>) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const setFilter = <TKey extends keyof Finance2Filters>(
    key: TKey,
    value: string,
  ) => onFiltersChange?.({ ...filters, [key]: value as Finance2Filters[TKey] })

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
            onClearFilters={() => onFiltersChange?.(emptyFinance2Filters)}
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
                    options={finance2Statuses.map((status) => [
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
                    options={finance2Methods.map((method) => [
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
                    options={finance2Channels.map((channel) => [
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
