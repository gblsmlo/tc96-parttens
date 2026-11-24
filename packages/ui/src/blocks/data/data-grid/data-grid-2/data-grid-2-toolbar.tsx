'use client'

import { IdentificationBadgeIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { MenuCheckboxItem, MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { sortFromSorting } from '../shared/grid-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { GridViewSwitcher } from '../shared/grid-view-switcher'
import type { GridViewProps } from '../shared/types'
import type {
  DataGrid2ColumnVisibility,
  DataGrid2Labels,
  DataGrid2Member,
  DataGrid2Settings,
  DataGrid2ToggleColumnId,
} from './types'

const dataGrid2ToggleColumns: readonly DataGrid2ToggleColumnId[] = [
  'role',
  'team',
  'rating',
  'lastSeen',
  'activity',
  'priority',
  'location',
  'joined',
]

type DataGrid2Table = UseDataGridReturn<DataGrid2Member>['table']

export interface DataGrid2ToolbarProps extends GridViewProps {
  description: string
  labels: DataGrid2Labels
  locale: string
  onSave?: (settings: DataGrid2Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  showPaused: boolean
  table: DataGrid2Table
}

const uniqueOptions = (values: readonly string[]) =>
  [...new Set(values)].map((value) => [value, value] as const)

function ColumnFilter({
  icon,
  id,
  labels,
  options,
  table,
}: Readonly<{
  icon: typeof UsersThreeIcon
  id: 'role' | 'team'
  labels: DataGrid2Labels
  options: readonly (readonly [string, string])[]
  table: DataGrid2Table
}>) {
  const column = table.getColumn(id)

  return (
    <FilterRadioSubmenu
      clearLabel={labels.filterAll}
      icon={icon}
      label={labels.columns[id]}
      onValueChange={(value) => {
        column?.setFilterValue(value || undefined)
        table.setPageIndex(0)
      }}
      options={options}
      value={String(column?.getFilterValue() ?? '')}
    />
  )
}

export function DataGrid2Toolbar({
  activeViewId,
  description,
  labels,
  locale,
  onSave,
  onShowPausedChange,
  onViewChange,
  onViewCreate,
  showPaused,
  table,
  views,
}: Readonly<DataGrid2ToolbarProps>) {
  const members = table.options.data
  const activeFilterCount = table.store.state.columnFilters.length

  const currentVisibility = (): DataGrid2ColumnVisibility =>
    Object.fromEntries(
      dataGrid2ToggleColumns.map((id) => [
        id,
        table.getColumn(id)?.getIsVisible() ?? true,
      ]),
    )

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      description={description}
      endSlot={
        <ViewSettingsMenu
          activeFilterCount={activeFilterCount}
          clearLabel={labels.clearFilters}
          formatTriggerLabel={labels.settingsWithFilters}
          label={labels.settings}
          onClearFilters={() => table.resetColumnFilters()}
          onSavePreference={
            onSave
              ? () =>
                  onSave({
                    columnVisibility: currentVisibility(),
                    density: table.options.meta?.dataGridDensity ?? 'tall',
                    showPaused,
                    sort: sortFromSorting(table.store.state.sorting),
                  })
              : undefined
          }
          savePreferenceLabel={labels.save}
        >
          <ViewSettingsSection label={labels.display}>
            <DataGridSortSubmenu
              clearLabel={labels.clearSort}
              getOptionLabel={labels.sortOption}
              label={labels.sorting}
              table={table}
            />
            <DataGridColumnsSubmenu
              label={labels.displayedProperties}
              table={table}
            />
            <DataGridDensitySubmenu
              densityLabels={labels.densities}
              label={labels.density}
              table={table}
            />
            {onShowPausedChange ? (
              <MenuCheckboxItem
                checked={showPaused}
                closeOnClick={false}
                onCheckedChange={(checked) =>
                  onShowPausedChange(Boolean(checked))
                }
              >
                {labels.pausedMembers}
              </MenuCheckboxItem>
            ) : null}
          </ViewSettingsSection>
          <MenuSeparator />
          <ViewSettingsSection label={labels.filters}>
            <ColumnFilter
              icon={IdentificationBadgeIcon}
              id="role"
              labels={labels}
              options={uniqueOptions(
                members.map((member) => member.role.label),
              )}
              table={table}
            />
            <ColumnFilter
              icon={UsersThreeIcon}
              id="team"
              labels={labels}
              options={uniqueOptions(members.map((member) => member.team.name))}
              table={table}
            />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
      startSlot={
        views ? (
          <GridViewSwitcher
            activeViewId={activeViewId}
            labels={labels}
            locale={locale}
            onViewChange={onViewChange}
            onViewCreate={onViewCreate}
            views={views}
          />
        ) : undefined
      }
      title={labels.title}
    />
  )
}
