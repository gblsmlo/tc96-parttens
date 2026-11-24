import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  DownloadSimpleIcon,
  HeartbeatIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { UseDataTableReturn } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { table6HealthOrder } from './table-6-columns'
import type { Table6Account, Table6Labels } from './types'

export interface Table6ToolbarProps {
  allCollapsed: boolean
  labels: Table6Labels
  onExport?: () => void
  onToggleAll?: () => void
  table: UseDataTableReturn<Table6Account>['table']
}

export function Table6Toolbar({
  allCollapsed,
  labels,
  onExport,
  onToggleAll,
  table,
}: Readonly<Table6ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const health =
    (filters.find((filter) => filter.id === 'health')?.value as
      | string
      | undefined) ?? ''
  const ToggleIcon = allCollapsed ? ArrowsOutSimpleIcon : ArrowsInSimpleIcon

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      description={labels.description}
      endSlot={
        <>
          <DataGridSearch
            aria-label={labels.search}
            className="w-40 sm:w-64"
            placeholder={labels.search}
            table={table}
          />
          <ViewSettingsMenu
            activeFilterCount={filters.length}
            clearLabel={labels.clearFilters}
            formatTriggerLabel={labels.filtersTrigger}
            label={labels.display}
            onClearFilters={() => table.resetColumnFilters()}
          >
            <ViewSettingsSection label={labels.display}>
              <DataGridDensitySubmenu
                densityLabels={labels.densities}
                label={labels.density}
                table={table}
              />
              <DataTableColumnsSubmenu
                label={labels.columnsMenu}
                table={table}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label={labels.filters}>
              <FilterRadioSubmenu
                clearLabel={labels.allOptions}
                icon={HeartbeatIcon}
                label={labels.columns.health}
                onValueChange={(value) =>
                  table.getColumn('health')?.setFilterValue(value || undefined)
                }
                options={table6HealthOrder.map((option) => [
                  option,
                  labels.health[option],
                ])}
                value={health}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onToggleAll ? (
            <TableToolbarButton onClick={onToggleAll}>
              <ToggleIcon aria-hidden="true" />
              {allCollapsed ? labels.expandAll : labels.collapseAll}
            </TableToolbarButton>
          ) : null}
          {onExport ? (
            <TableToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </TableToolbarButton>
          ) : null}
        </>
      }
      title={labels.title}
    />
  )
}
