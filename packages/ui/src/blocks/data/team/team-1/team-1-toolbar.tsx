'use client'

import { IdentificationBadgeIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { MenuCheckboxItem, MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
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
import { sortFromSorting } from '../../shared/grid/grid-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import type {
  Team1ColumnVisibility,
  Team1Labels,
  Team1Member,
  Team1Settings,
  Team1ToggleColumnId,
} from './types'

const team1ToggleColumns: readonly Team1ToggleColumnId[] = [
  'role',
  'team',
  'rating',
  'lastSeen',
  'activity',
  'priority',
  'location',
  'joined',
]

type Team1Table = UseDataGridReturn<Team1Member>['table']

export interface Team1ToolbarProps {
  description: string
  labels: Team1Labels
  onSave?: (settings: Team1Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  showPaused: boolean
  table: Team1Table
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
  labels: Team1Labels
  options: readonly (readonly [string, string])[]
  table: Team1Table
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

export function Team1Toolbar({
  description,
  labels,
  onSave,
  onShowPausedChange,
  showPaused,
  table,
}: Readonly<Team1ToolbarProps>) {
  const members = table.options.data
  const activeFilterCount = table.store.state.columnFilters.length

  const currentVisibility = (): Team1ColumnVisibility =>
    Object.fromEntries(
      team1ToggleColumns.map((id) => [
        id,
        table.getColumn(id)?.getIsVisible() ?? true,
      ]),
    )

  return (
    <GridToolbar
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
        <ViewSettings
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
        </ViewSettings>
      }
    />
  )
}
