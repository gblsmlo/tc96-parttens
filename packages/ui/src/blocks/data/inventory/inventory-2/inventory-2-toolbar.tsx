import { PlusIcon, RadioButtonIcon } from '@phosphor-icons/react'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/data-grid/components/data-grid-search'
import type { UseDataTableReturn } from '@tc96/ui/patterns/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import type { Inventory2Row } from './inventory-2-cells'
import { inventory2Statuses } from './inventory-2-options'
import type { Inventory2Labels } from './types'

export interface Inventory2ToolbarProps {
  labels: Inventory2Labels
  onAdd?: () => void
  table: UseDataTableReturn<Inventory2Row>['table']
}

export function Inventory2Toolbar({
  labels,
  onAdd,
  table,
}: Readonly<Inventory2ToolbarProps>) {
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
                options={inventory2Statuses.map((status) => [
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
