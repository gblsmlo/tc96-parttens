import { PlusIcon } from '@phosphor-icons/react'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { isConditionComplete } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import { GridViewSwitcher } from '../shared/grid-view-switcher'
import type {
  DataGrid3Condition,
  DataGrid3Labels,
  DataGrid3Renewal,
  DataGrid3View,
} from './types'

export interface DataGrid3ToolbarProps {
  activeViewId?: string
  conditions: readonly DataGrid3Condition[]
  description: string
  labels: DataGrid3Labels
  locale?: string
  onConditionsChange?: (conditions: DataGrid3Condition[]) => void
  onCreate?: () => void
  onSaveView?: () => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  table: UseDataGridReturn<DataGrid3Renewal>['table']
  views?: DataGrid3View[]
}

export function DataGrid3Toolbar({
  activeViewId,
  conditions,
  description,
  labels,
  locale,
  onConditionsChange,
  onCreate,
  onSaveView,
  onViewChange,
  onViewCreate,
  table,
  views,
}: Readonly<DataGrid3ToolbarProps>) {
  const activeFilterCount = conditions.filter(isConditionComplete).length

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      description={description}
      endSlot={
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
              <PlusIcon aria-hidden="true" />
              {labels.create}
            </GridToolbarButton>
          ) : null}
        </>
      }
      startSlot={
        views?.length ? (
          <GridViewSwitcher
            activeViewId={activeViewId}
            labels={labels}
            locale={locale}
            onViewChange={onViewChange}
            onViewCreate={onViewCreate}
            views={views}
          />
        ) : undefined
      }
      title={labels.title}
    />
  )
}
