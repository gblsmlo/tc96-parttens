import {
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  PlusIcon,
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
} from '@tc96/ui/patterns/collection/shared/components/collection-view-settings'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { TableViewSwitcher } from '../shared/table-view-switcher'
import type {
  Table1Labels,
  Table1Queue,
  Table1Status,
  Table1Ticket,
  Table1View,
} from './types'

const queues: readonly Table1Queue[] = [
  'platform',
  'billing',
  'authentication',
  'integrations',
]

const statuses: readonly Table1Status[] = ['open', 'pending', 'resolved']

export interface Table1ToolbarProps {
  activeViewId?: string
  description: string
  labels: Table1Labels
  locale?: string
  onCreate?: () => void
  onExport?: () => void
  onQueueChange: (queue: Table1Queue | null) => void
  onSaveView?: () => void
  onStatusChange: (status: Table1Status | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  queue: Table1Queue | null
  status: Table1Status | null
  table: DataTableTable<Table1Ticket>
  views?: Table1View[]
}

export function Table1Toolbar({
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
}: Readonly<Table1ToolbarProps>) {
  const activeFilterCount = (queue ? 1 : 0) + (status ? 1 : 0)

  return (
    <TableToolbar
      aria-label={labels.toolbar}
      description={description}
      endSlot={
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
