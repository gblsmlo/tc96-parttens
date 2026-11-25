import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import { isConditionComplete } from '@tc96/ui/patterns/data-grid/lib/data-grid-conditions'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import type {
  Revenue1Condition,
  Revenue1Labels,
  Revenue1Renewal,
} from './types'

export interface Revenue1ToolbarProps {
  conditions: readonly Revenue1Condition[]
  labels: Revenue1Labels
  left: ReactNode
  onConditionsChange?: (conditions: Revenue1Condition[]) => void
  onCreate?: () => void
  onSaveView?: () => void
  table: UseDataGridReturn<Revenue1Renewal>['table']
}

export function Revenue1Toolbar({
  conditions,
  labels,
  left,
  onConditionsChange,
  onCreate,
  onSaveView,
  table,
}: Readonly<Revenue1ToolbarProps>) {
  const activeFilterCount = conditions.filter(isConditionComplete).length

  return (
    <GridToolbar
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
              <DataGridColumnsSubmenu
                label={labels.columnsMenu}
                table={table}
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
