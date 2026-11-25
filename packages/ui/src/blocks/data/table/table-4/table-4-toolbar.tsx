import { PlusIcon, RadioButtonIcon } from '@phosphor-icons/react'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import type { UseDataTableReturn } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { TableToolbarHeading } from '../shared/table-toolbar-heading'
import type { Table4Row } from './table-4-cells'
import type { Table4Labels, Table4Status } from './types'

const statuses: readonly Table4Status[] = ['active', 'draft', 'archived']

export interface Table4ToolbarProps {
  labels: Table4Labels
  onAdd?: () => void
  table: UseDataTableReturn<Table4Row>['table']
}

export function Table4Toolbar({
  labels,
  onAdd,
  table,
}: Readonly<Table4ToolbarProps>) {
  const statusColumn = table.getColumn('status')
  const statusFilter = (statusColumn?.getFilterValue() as string) ?? ''
  const setStatusFilter = (value: string) => {
    statusColumn?.setFilterValue(value || undefined)
    table.setPageIndex(0)
  }

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={
        <TableToolbarHeading
          description={labels.description}
          title={labels.title}
        />
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
            <TableToolbarButton onClick={onAdd}>
              <PlusIcon aria-hidden="true" />
              {labels.addProduct}
            </TableToolbarButton>
          ) : null}
        </>
      }
    />
  )
}
