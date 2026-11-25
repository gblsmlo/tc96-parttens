'use client'

import { IdentificationBadgeIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { MenuCheckboxItem, MenuSeparator } from '@tc96/ui/menu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import type { DataTableTableMeta } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-types'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { sortFromSorting } from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import type {
  Table2ColumnVisibility,
  Table2Labels,
  Table2Member,
  Table2Settings,
  Table2ToggleColumnId,
} from './types'

const table2ToggleColumns: readonly Table2ToggleColumnId[] = [
  'role',
  'team',
  'rating',
  'lastSeen',
  'activity',
  'priority',
  'location',
  'joined',
]

type Table2Table = DataTableTable<Table2Member>

export interface Table2ToolbarProps {
  description: string
  labels: Table2Labels
  onSave?: (settings: Table2Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  showPaused: boolean
  table: Table2Table
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
  labels: Table2Labels
  options: readonly (readonly [string, string])[]
  table: Table2Table
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

export function Table2Toolbar({
  description,
  labels,
  onSave,
  onShowPausedChange,
  showPaused,
  table,
}: Readonly<Table2ToolbarProps>) {
  const members = table.options.data
  const activeFilterCount = table.store.state.columnFilters.length

  const currentVisibility = (): Table2ColumnVisibility =>
    Object.fromEntries(
      table2ToggleColumns.map((id) => [
        id,
        table.getColumn(id)?.getIsVisible() ?? true,
      ]),
    )

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
                    density:
                      (table.options.meta as DataTableTableMeta | undefined)
                        ?.dataGridDensity ?? 'tall',
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
            <DataTableColumnsSubmenu
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
    />
  )
}
