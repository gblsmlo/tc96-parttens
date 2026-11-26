import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  DownloadSimpleIcon,
  HeartbeatIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/data-grid/components/data-grid-search'
import type { UseDataGridReturn } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components'
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import { revenue3HealthOrder } from './revenue-3-options'
import type { Revenue3Account, Revenue3Labels } from './types'

export interface Revenue3ToolbarProps {
  allCollapsed: boolean
  labels: Revenue3Labels
  onExport?: () => void
  onToggleAll?: () => void
  table: UseDataGridReturn<Revenue3Account>['table']
}

export function Revenue3Toolbar({
  allCollapsed,
  labels,
  onExport,
  onToggleAll,
  table,
}: Readonly<Revenue3ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const health =
    (filters.find((filter) => filter.id === 'health')?.value as
      | string
      | undefined) ?? ''
  const ToggleIcon = allCollapsed ? ArrowsOutSimpleIcon : ArrowsInSimpleIcon

  return (
    <GridToolbar
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
            className="w-40 sm:w-64 sm:max-w-none"
            placeholder={labels.search}
            table={table}
          />
          <ViewSettings
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
                options={revenue3HealthOrder.map((option) => [
                  option,
                  labels.health[option],
                ])}
                value={health}
              />
            </ViewSettingsSection>
          </ViewSettings>
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
    />
  )
}
