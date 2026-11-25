import { FlagIcon, FolderIcon } from '@phosphor-icons/react'
import { MenuCheckboxItem, MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
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
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import { dataPriorities } from '../../shared/properties/data-priority'
import type { Projects1Labels, Projects1Task } from './types'

export interface Projects1ToolbarProps {
  description: string
  labels: Projects1Labels
  onCreate?: () => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  projects: readonly string[]
  showSubtasks: boolean
  table: UseDataGridReturn<Projects1Task>['table']
}

export function Projects1Toolbar({
  description,
  labels,
  onCreate,
  onShowSubtasksChange,
  projects,
  showSubtasks,
  table,
}: Readonly<Projects1ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const filterValue = (id: string) =>
    (filters.find((filter) => filter.id === id)?.value as string | undefined) ??
    ''
  const setFilter = (id: string, value: string) => {
    table.getColumn(id)?.setFilterValue(value || undefined)
    table.setPageIndex(0)
  }

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
            label={labels.settings}
            onClearFilters={() => {
              table.resetColumnFilters()
              table.setPageIndex(0)
            }}
          >
            <ViewSettingsSection label={labels.display}>
              {onShowSubtasksChange ? (
                <MenuCheckboxItem
                  checked={showSubtasks}
                  closeOnClick={false}
                  onCheckedChange={(checked) =>
                    onShowSubtasksChange(Boolean(checked))
                  }
                  variant="switch"
                >
                  {labels.showSubtasks}
                </MenuCheckboxItem>
              ) : null}
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
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label={labels.filters}>
              <FilterRadioSubmenu
                clearLabel={labels.allOptions}
                icon={FlagIcon}
                label={labels.columns.priority}
                onValueChange={(value) => setFilter('priority', value)}
                options={dataPriorities.map((priority) => [
                  priority,
                  labels.priorities[priority],
                ])}
                value={filterValue('priority')}
              />
              <FilterRadioSubmenu
                clearLabel={labels.allOptions}
                icon={FolderIcon}
                label={labels.columns.project}
                onValueChange={(value) => setFilter('project', value)}
                options={projects.map((project) => [project, project])}
                value={filterValue('project')}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onCreate ? (
            <GridToolbarButton onClick={onCreate} variant="default">
              {labels.create}
            </GridToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
