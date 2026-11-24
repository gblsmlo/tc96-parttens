import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  DownloadSimpleIcon,
  HeartbeatIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import { dataGrid6HealthOrder } from './data-grid-6-columns'
import type { DataGrid6Account, DataGrid6Labels } from './types'

export interface DataGrid6ToolbarProps {
  allCollapsed: boolean
  labels: DataGrid6Labels
  onExport?: () => void
  onToggleAll?: () => void
  table: UseDataGridReturn<DataGrid6Account>['table']
}

export function DataGrid6Toolbar({
  allCollapsed,
  labels,
  onExport,
  onToggleAll,
  table,
}: Readonly<DataGrid6ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const health =
    (filters.find((filter) => filter.id === 'health')?.value as
      | string
      | undefined) ?? ''
  const ToggleIcon = allCollapsed ? ArrowsOutSimpleIcon : ArrowsInSimpleIcon

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      description={labels.description}
      endSlot={
        <>
          <DataGridSearch
            aria-label={labels.search}
            className="w-40 sm:w-64 sm:max-w-none"
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
              <DataGridColumnsSubmenu
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
                options={dataGrid6HealthOrder.map((option) => [
                  option,
                  labels.health[option],
                ])}
                value={health}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onToggleAll ? (
            <GridToolbarButton onClick={onToggleAll}>
              <ToggleIcon aria-hidden="true" />
              {allCollapsed ? labels.expandAll : labels.collapseAll}
            </GridToolbarButton>
          ) : null}
          {onExport ? (
            <GridToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </GridToolbarButton>
          ) : null}
        </>
      }
      title={labels.title}
    />
  )
}
