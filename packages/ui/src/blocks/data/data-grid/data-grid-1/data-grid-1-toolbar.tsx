import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import type {
  DataGrid1Labels,
  DataGrid1Queue,
  DataGrid1Status,
  DataGrid1Ticket,
} from './types'

const queues: readonly DataGrid1Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

const statuses: readonly DataGrid1Status[] = ['open', 'pending', 'resolved']

export interface DataGrid1ToolbarProps {
  labels: DataGrid1Labels
  left: ReactNode
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: DataGrid1Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: DataGrid1Status | null) => void
  queue: DataGrid1Queue | null
  status: DataGrid1Status | null
  table: UseDataGridReturn<DataGrid1Ticket>['table']
}

export function DataGrid1Toolbar({
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
}: Readonly<DataGrid1ToolbarProps>) {
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
                  onQueueChange(value ? (value as DataGrid1Queue) : null)
                }
                options={queues.map((id) => [id, labels.queues[id]] as const)}
                value={queue ?? ''}
              />
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={FunnelSimpleIcon}
                label={labels.status}
                onValueChange={(value) =>
                  onStatusChange(value ? (value as DataGrid1Status) : null)
                }
                options={statuses.map(
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
