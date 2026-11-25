import { PlusIcon } from '@phosphor-icons/react'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { isConditionComplete } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import type { Table3Condition, Table3Labels, Table3Renewal } from './types'

export interface Table3ToolbarProps {
  conditions: readonly Table3Condition[]
  labels: Table3Labels
  left: ReactNode
  onConditionsChange?: (conditions: Table3Condition[]) => void
  onCreate?: () => void
  onSaveView?: () => void
  table: DataTableTable<Table3Renewal>
}

export function Table3Toolbar({
  conditions,
  labels,
  left,
  onConditionsChange,
  onCreate,
  onSaveView,
  table,
}: Readonly<Table3ToolbarProps>) {
  const activeFilterCount = conditions.filter(isConditionComplete).length

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={left}
      right={
        <>
          <ViewSettingsMenu
            activeFilterCount={activeFilterCount}
            clearLabel={labels.conditions.clearFilters}
            formatTriggerLabel={labels.filterCount}
            label={labels.settings}
            onClearFilters={() => onConditionsChange?.([])}
            onSavePreference={onSaveView}
            savePreferenceLabel={labels.saveView}
          >
            <ViewSettingsSection label={labels.settings}>
              <DataGridSortSubmenu
                clearLabel={labels.clearSort}
                getOptionLabel={labels.sortOption}
                label={labels.sortBy}
                table={table}
              />
              <DataGridDensitySubmenu
                densityLabels={labels.densities}
                label={labels.density}
                table={table}
              />
              <DataTableColumnsSubmenu
                label={labels.columnsMenu}
                table={table}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
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
