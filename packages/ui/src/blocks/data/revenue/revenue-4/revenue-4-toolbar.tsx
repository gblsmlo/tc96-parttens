import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  DownloadSimpleIcon,
  HeartbeatIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/data-grid/components/data-grid-search'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { UseDataTableReturn } from '@tc96/ui/patterns/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import { revenue4HealthOrder } from './revenue-4-options'
import type { Revenue4Account, Revenue4Labels } from './types'

export interface Revenue4ToolbarProps {
  allCollapsed: boolean
  labels: Revenue4Labels
  onExport?: () => void
  onToggleAll?: () => void
  table: UseDataTableReturn<Revenue4Account>['table']
}

export function Revenue4Toolbar({
  allCollapsed,
  labels,
  onExport,
  onToggleAll,
  table,
}: Readonly<Revenue4ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const health =
    (filters.find((filter) => filter.id === 'health')?.value as
      | string
      | undefined) ?? ''
  const ToggleIcon = allCollapsed ? ArrowsOutSimpleIcon : ArrowsInSimpleIcon

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
          <CollectionToolbarDescription>
            {labels.description}
          </CollectionToolbarDescription>
        </CollectionToolbarHeading>
      }
      right={
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
                options={revenue4HealthOrder.map((option) => [
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
    />
  )
}
