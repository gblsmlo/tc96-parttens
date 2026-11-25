import { PlusIcon, RadioButtonIcon } from '@phosphor-icons/react'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
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
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import type { DataGrid4Row } from './data-grid-4-cells'
import type { DataGrid4Labels, DataGrid4Status } from './types'

const statuses: readonly DataGrid4Status[] = ['active', 'draft', 'archived']

export interface DataGrid4ToolbarProps {
  labels: DataGrid4Labels
  onAdd?: () => void
  table: UseDataGridReturn<DataGrid4Row>['table']
}

export function DataGrid4Toolbar({
  labels,
  onAdd,
  table,
}: Readonly<DataGrid4ToolbarProps>) {
  const statusColumn = table.getColumn('status')
  const statusFilter = (statusColumn?.getFilterValue() as string) ?? ''
  const setStatusFilter = (value: string) => {
    statusColumn?.setFilterValue(value || undefined)
    table.setPageIndex(0)
  }

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
          <ViewSettingsMenu
            activeFilterCount={statusFilter ? 1 : 0}
            clearLabel={labels.clearFilters}
            formatTriggerLabel={labels.viewWithFilters}
            label={labels.view}
            onClearFilters={() => setStatusFilter('')}
          >
            <ViewSettingsSection label={labels.filters}>
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={RadioButtonIcon}
                label={labels.statusFilter}
                onValueChange={setStatusFilter}
                options={statuses.map((status) => [
                  status,
                  labels.statuses[status],
                ])}
                value={statusFilter}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onAdd ? (
            <GridToolbarButton onClick={onAdd}>
              <PlusIcon aria-hidden="true" />
              {labels.addProduct}
            </GridToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
