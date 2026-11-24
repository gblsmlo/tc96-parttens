import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  PlusIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { DataGridColumnsSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-columns-submenu'
import { DataGridDensitySubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-density-submenu'
import { DataGridSearch } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-search'
import { DataGridSortSubmenu } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-sort-submenu'
import type { UseDataGridReturn } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import {
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import { GridViewSwitcher } from '../shared/grid-view-switcher'
import type {
  DataGrid1Labels,
  DataGrid1Queue,
  DataGrid1Status,
  DataGrid1Ticket,
  DataGrid1View,
} from './types'

const queues: readonly DataGrid1Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

const statuses: readonly DataGrid1Status[] = ['open', 'pending', 'resolved']

export interface DataGrid1ToolbarProps {
  activeViewId?: string
  description: string
  labels: DataGrid1Labels
  locale?: string
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: DataGrid1Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: DataGrid1Status | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  queue: DataGrid1Queue | null
  status: DataGrid1Status | null
  table: UseDataGridReturn<DataGrid1Ticket>['table']
  views?: DataGrid1View[]
}

export function DataGrid1Toolbar({
  activeViewId,
  description,
  labels,
  locale,
  onCreate,
  onExport,
  onQueueChange,
  onSaveView,
  onStatusChange,
  onViewChange,
  onViewCreate,
  queue,
  status,
  table,
  views,
}: Readonly<DataGrid1ToolbarProps>) {
  const activeFilterCount = (queue ? 1 : 0) + (status ? 1 : 0)

  return (
    <GridToolbar
      aria-label={labels.toolbar}
      description={description}
      endSlot={
        <>
          <DataGridSearch
            aria-label={labels.search}
            className="w-40 sm:w-64 sm:max-w-none"
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
            <GridToolbarButton onClick={onExport}>
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </GridToolbarButton>
          ) : null}
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
