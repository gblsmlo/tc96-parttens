'use client'

import { DownloadSimpleIcon, PlusIcon, PulseIcon } from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import { GridToolbarHeading } from '../shared/grid-toolbar-heading'
import type {
  DataGrid9Campaign,
  DataGrid9Labels,
  DataGrid9Status,
} from './types'

const statuses: readonly DataGrid9Status[] = [
  'active',
  'learning',
  'paused',
  'ended',
]

export interface DataGrid9ToolbarProps {
  description: string
  labels: DataGrid9Labels
  onCreate?: () => void
  onExport?: () => void
  table: UseDataGridReturn<DataGrid9Campaign>['table']
}

export function DataGrid9Toolbar({
  description,
  labels,
  onCreate,
  onExport,
  table,
}: Readonly<DataGrid9ToolbarProps>) {
  const statusColumn = table.getColumn('status')

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      left={
        <GridToolbarHeading description={description} title={labels.title} />
      }
      right={
        <>
          <DataGridSearch
            aria-label={labels.search}
            className="w-40 sm:w-64 sm:max-w-none"
            placeholder={labels.search}
            table={table}
          />
          <ViewSettingsMenu
            activeFilterCount={table.store.state.columnFilters.length}
            clearLabel={labels.clearFilters}
            formatTriggerLabel={labels.settingsWithFilters}
            label={labels.settings}
            onClearFilters={() => table.resetColumnFilters()}
          >
            <ViewSettingsSection label={labels.display}>
              <DataGridSortSubmenu
                clearLabel={labels.clearSort}
                getOptionLabel={labels.sortOption}
                label={labels.sortBy}
                table={table}
              />
              <DataGridColumnsSubmenu
                label={labels.columnsMenu}
                table={table}
              />
              <DataGridDensitySubmenu
                densityLabels={labels.densities}
                label={labels.density}
                table={table}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label={labels.filters}>
              <FilterRadioSubmenu
                clearLabel={labels.filterAll}
                icon={PulseIcon}
                label={labels.columns.status}
                onValueChange={(value) => {
                  statusColumn?.setFilterValue(value || undefined)
                  table.setPageIndex(0)
                }}
                options={statuses.map(
                  (status) => [status, labels.statuses[status]] as const,
                )}
                value={String(statusColumn?.getFilterValue() ?? '')}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onExport ? (
            <GridToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </GridToolbarButton>
          ) : null}
          {onCreate ? (
            <GridToolbarButton onClick={onCreate} variant="default">
              <PlusIcon aria-hidden="true" />
              {labels.create}
            </GridToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
