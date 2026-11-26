import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import { isConditionComplete } from '@tc96/ui/patterns/data-grid/lib/data-grid-conditions'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import type {
  Revenue2Condition,
  Revenue2Labels,
  Revenue2Renewal,
} from './types'

export interface Revenue2ToolbarProps {
  conditions: readonly Revenue2Condition[]
  labels: Revenue2Labels
  left: ReactNode
  onConditionsChange?: (conditions: Revenue2Condition[]) => void
  onCreate?: () => void
  onSaveView?: () => void
  table: DataTableTable<Revenue2Renewal>
}

export function Revenue2Toolbar({
  conditions,
  labels,
  left,
  onConditionsChange,
  onCreate,
  onSaveView,
  table,
}: Readonly<Revenue2ToolbarProps>) {
  const activeFilterCount = conditions.filter(isConditionComplete).length

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={left}
      right={
        <>
          <ViewSettings
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
          </ViewSettings>
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
