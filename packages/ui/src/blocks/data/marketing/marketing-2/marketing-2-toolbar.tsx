'use client'

import { DownloadSimpleIcon, PulseIcon } from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import { marketing2Statuses } from './marketing-2-options'
import type { Marketing2Campaign, Marketing2Labels } from './types'

export interface Marketing2ToolbarProps {
  description: string
  labels: Marketing2Labels
  onCreate?: () => void
  onExport?: () => void
  table: DataTableTable<Marketing2Campaign>
}

export function Marketing2Toolbar({
  description,
  labels,
  onCreate,
  onExport,
  table,
}: Readonly<Marketing2ToolbarProps>) {
  const statusColumn = table.getColumn('status')

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
          <CollectionToolbarDescription>
            {description}
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
                options={marketing2Statuses.map(
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
              {labels.create}
            </TableToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
