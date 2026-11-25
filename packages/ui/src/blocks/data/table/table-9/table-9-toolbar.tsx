'use client'

import { DownloadSimpleIcon, PlusIcon, PulseIcon } from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { TableToolbarHeading } from '../shared/table-toolbar-heading'
import type { Table9Campaign, Table9Labels, Table9Status } from './types'

const statuses: readonly Table9Status[] = [
  'active',
  'learning',
  'paused',
  'ended',
]

export interface Table9ToolbarProps {
  description: string
  labels: Table9Labels
  onCreate?: () => void
  onExport?: () => void
  table: DataTableTable<Table9Campaign>
}

export function Table9Toolbar({
  description,
  labels,
  onCreate,
  onExport,
  table,
}: Readonly<Table9ToolbarProps>) {
  const statusColumn = table.getColumn('status')

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={
        <TableToolbarHeading description={description} title={labels.title} />
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
              <DataTableColumnsSubmenu
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
            <TableToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </TableToolbarButton>
          ) : null}
          {onCreate ? (
            <TableToolbarButton onClick={onCreate} variant="default">
              <PlusIcon aria-hidden="true" />
              {labels.create}
            </TableToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
