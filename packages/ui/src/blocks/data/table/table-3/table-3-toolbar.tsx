import { PlusIcon } from '@phosphor-icons/react'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { isConditionComplete } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { TableViewSwitcher } from '../shared/table-view-switcher'
import type {
  Table3Condition,
  Table3Labels,
  Table3Renewal,
  Table3View,
} from './types'

export interface Table3ToolbarProps {
  activeViewId?: string
  conditions: readonly Table3Condition[]
  description: string
  labels: Table3Labels
  locale?: string
  onConditionsChange?: (conditions: Table3Condition[]) => void
  onCreate?: () => void
  onSaveView?: () => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  table: DataTableTable<Table3Renewal>
  views?: Table3View[]
}

export function Table3Toolbar({
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
}: Readonly<Table3ToolbarProps>) {
  const activeFilterCount = conditions.filter(isConditionComplete).length

  return (
    <TableToolbar
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
      startSlot={
        views?.length ? (
          <TableViewSwitcher
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
