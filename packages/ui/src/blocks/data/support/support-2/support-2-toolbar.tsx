import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import { support2Queues, support2Statuses } from './support-2-options'
import type {
  Support2Labels,
  Support2Queue,
  Support2Status,
  Support2Ticket,
} from './types'

export interface Support2ToolbarProps {
  labels: Support2Labels
  left: ReactNode
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: Support2Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: Support2Status | null) => void
  queue: Support2Queue | null
  status: Support2Status | null
  table: DataTableTable<Support2Ticket>
}

export function Support2Toolbar({
  labels,
  left,
  onCreate,
  onExport,
  onQueueChange,
  onSaveView,
  onStatusChange,
  queue,
  status,
  table,
}: Readonly<Support2ToolbarProps>) {
  const activeFilterCount = (queue ? 1 : 0) + (status ? 1 : 0)

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={left}
      right={
        <>
          <DataGridSearch
            aria-label={labels.search}
            className="w-40 sm:w-64"
            placeholder={labels.search}
            table={table}
          />
          <ViewSettingsMenu
            activeFilterCount={activeFilterCount}
            formatTriggerLabel={labels.filterCount}
            clearLabel={labels.clearFilters}
            label={labels.display}
            onClearFilters={() => {
              onQueueChange(null)
              onStatusChange(null)
            }}
            onSavePreference={onSaveView}
            savePreferenceLabel={labels.saveView}
          >
            <ViewSettingsSection label={labels.display}>
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
            <MenuSeparator />
            <ViewSettingsSection label={labels.filters}>
              <FilterRadioSubmenu
                clearLabel={labels.allQueues}
                icon={StackIcon}
                label={labels.queue}
                onValueChange={(value) =>
                  onQueueChange(value ? (value as Support2Queue) : null)
                }
                options={support2Queues.map(
                  (id) => [id, labels.queues[id]] as const,
                )}
                value={queue ?? ''}
              />
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={FunnelSimpleIcon}
                label={labels.status}
                onValueChange={(value) =>
                  onStatusChange(value ? (value as Support2Status) : null)
                }
                options={support2Statuses.map(
                  (id) => [id, labels.statuses[id]] as const,
                )}
                value={status ?? ''}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onExport ? (
            <TableToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </TableToolbarButton>
          ) : null}
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
