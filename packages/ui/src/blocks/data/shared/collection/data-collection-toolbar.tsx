import {
  CalendarDotsIcon,
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  GridFourIcon,
  KanbanIcon,
  RowsIcon,
  TableIcon,
} from '@phosphor-icons/react'
import { Button, type ButtonProps } from '@tc96/ui/button'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettings,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import type {
  DataCollectionMode,
  DataCollectionModeLabels,
  DataCollectionToolbarLabels,
  DataCollectionToolbarMode,
} from './types'

export const dataCollectionModeIcons = {
  calendar: CalendarDotsIcon,
  gallery: GridFourIcon,
  kanban: KanbanIcon,
  list: RowsIcon,
  table: TableIcon,
} as const satisfies Record<DataCollectionMode, ViewSettingsMode['icon']>

export interface DataCollectionToolbarButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: ButtonProps['variant']
}

export function DataCollectionToolbarButton({
  children,
  onClick,
  variant = 'outline',
}: Readonly<DataCollectionToolbarButtonProps>) {
  return (
    <ToolbarButton
      onClick={onClick}
      render={<Button type="button" variant={variant} />}
    >
      {children}
    </ToolbarButton>
  )
}

export interface DataCollectionToolbarProps<
  TMode extends DataCollectionToolbarMode,
  TStatus extends string,
> {
  description?: string
  labels: DataCollectionToolbarLabels
  left?: ReactNode
  loading: boolean
  mode: TMode
  modeLabels: DataCollectionModeLabels
  modes: readonly TMode[]
  onCreate?: () => void
  onExport?: () => void
  onModeChange: (mode: TMode) => void
  onStatusFilterChange: (status: TStatus | null) => void
  statusFilter: TStatus | null
  statusLabels: Record<TStatus, string>
  statuses: readonly TStatus[]
}

export function DataCollectionToolbar<
  TMode extends DataCollectionToolbarMode,
  TStatus extends string,
>({
  description,
  labels,
  left,
  loading,
  mode,
  modeLabels,
  modes,
  onCreate,
  onExport,
  onModeChange,
  onStatusFilterChange,
  statusFilter,
  statusLabels,
  statuses,
}: Readonly<DataCollectionToolbarProps<TMode, TStatus>>) {
  const viewModes = modes.map(
    (value): ViewSettingsMode<TMode> => ({
      icon: dataCollectionModeIcons[value],
      label: modeLabels[value],
      value,
    }),
  )

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={
        left ?? (
          <CollectionToolbarHeading>
            <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
            <CollectionToolbarDescription>
              {loading ? undefined : description}
            </CollectionToolbarDescription>
          </CollectionToolbarHeading>
        )
      }
      right={
        loading ? undefined : (
          <>
            <ViewSettings
              activeFilterCount={statusFilter ? 1 : 0}
              clearLabel={labels.clearFilters}
              formatTriggerLabel={labels.filterCount}
              label={labels.display}
              mode={mode}
              modes={viewModes}
              onClearFilters={() => onStatusFilterChange(null)}
              onModeChange={onModeChange}
            >
              <ViewSettingsSection label={labels.filters}>
                <FilterRadioSubmenu
                  clearLabel={labels.allStatuses}
                  icon={FunnelSimpleIcon}
                  label={labels.status}
                  onValueChange={(value) =>
                    onStatusFilterChange(
                      statuses.find((status) => status === value) ?? null,
                    )
                  }
                  options={statuses.map(
                    (status) => [status, statusLabels[status]] as const,
                  )}
                  value={statusFilter ?? ''}
                />
              </ViewSettingsSection>
            </ViewSettings>
            {onExport ? (
              <DataCollectionToolbarButton onClick={onExport} variant="ghost">
                <DownloadSimpleIcon aria-hidden="true" />
                {labels.export}
              </DataCollectionToolbarButton>
            ) : null}
            {onCreate ? (
              <DataCollectionToolbarButton onClick={onCreate} variant="default">
                {labels.create}
              </DataCollectionToolbarButton>
            ) : null}
          </>
        )
      }
    />
  )
}
