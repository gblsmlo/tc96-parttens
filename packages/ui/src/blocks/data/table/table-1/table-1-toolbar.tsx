import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import type {
  Table1Labels,
  Table1Queue,
  Table1Status,
  Table1Ticket,
} from './types'

const queues: readonly Table1Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

const statuses: readonly Table1Status[] = ['open', 'pending', 'resolved']

export interface Table1ToolbarProps {
  labels: Table1Labels
  left: ReactNode
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: Table1Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: Table1Status | null) => void
  queue: Table1Queue | null
  status: Table1Status | null
  table: DataTableTable<Table1Ticket>
}

export function Table1Toolbar({
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
}: Readonly<Table1ToolbarProps>) {
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
                  onQueueChange(value ? (value as Table1Queue) : null)
                }
                options={queues.map((id) => [id, labels.queues[id]] as const)}
                value={queue ?? ''}
              />
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={FunnelSimpleIcon}
                label={labels.status}
                onValueChange={(value) =>
                  onStatusChange(value ? (value as Table1Status) : null)
                }
                options={statuses.map(
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
