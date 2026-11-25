import { FlagIcon, FolderIcon, } from '@phosphor-icons/react'
import { MenuCheckboxItem, MenuSeparator } from '@tc96/ui/menu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { UseDataTableReturn } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
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
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { table5PriorityOrder } from './table-5-columns'
import type { Table5Labels, Table5Task } from './types'

export interface Table5ToolbarProps {
  description: string
  labels: Table5Labels
  onCreate?: () => void
  onShowSubtasksChange?: (showSubtasks: boolean) => void
  projects: readonly string[]
  showSubtasks: boolean
  table: UseDataTableReturn<Table5Task>['table']
}

export function Table5Toolbar({
  description,
  labels,
  onCreate,
  onShowSubtasksChange,
  projects,
  showSubtasks,
  table,
}: Readonly<Table5ToolbarProps>) {
  const filters = table.store.state.columnFilters
  const filterValue = (id: string) =>
    (filters.find((filter) => filter.id === id)?.value as string | undefined) ??
    ''
  const setFilter = (id: string, value: string) => {
    table.getColumn(id)?.setFilterValue(value || undefined)
    table.setPageIndex(0)
  }

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
              <DataTableColumnsSubmenu
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
                options={[...table5PriorityOrder]
                  .reverse()
                  .map((priority) => [priority, labels.priorities[priority]])}
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
            <TableToolbarButton onClick={onCreate} variant="default">
              {labels.create}
            </TableToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
