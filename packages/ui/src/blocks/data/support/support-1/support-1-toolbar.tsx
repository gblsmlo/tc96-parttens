import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import type { ReactNode } from 'react'
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import { support1Queues, support1Statuses } from './support-1-options'
import type {
  Support1Labels,
  Support1Queue,
  Support1Status,
  Support1Ticket,
} from './types'

export interface Support1ToolbarProps {
  labels: Support1Labels
  left: ReactNode
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: Support1Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: Support1Status | null) => void
  queue: Support1Queue | null
  status: Support1Status | null
  table: UseDataGridReturn<Support1Ticket>['table']
}

export function Support1Toolbar({
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
}: Readonly<Support1ToolbarProps>) {
  const activeFilterCount = (queue ? 1 : 0) + (status ? 1 : 0)

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      left={left}
      right={
        <>
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
              <DataGridColumnsSubmenu
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
                  onQueueChange(value ? (value as Support1Queue) : null)
                }
                options={support1Queues.map(
                  (id) => [id, labels.queues[id]] as const,
                )}
                value={queue ?? ''}
              />
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={FunnelSimpleIcon}
                label={labels.status}
                onValueChange={(value) =>
                  onStatusChange(value ? (value as Support1Status) : null)
                }
                options={support1Statuses.map(
                  (id) => [id, labels.statuses[id]] as const,
                )}
                value={status ?? ''}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          {onExport ? (
            <GridToolbarButton onClick={onExport} variant="ghost">
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </GridToolbarButton>
          ) : null}
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
