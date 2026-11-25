import {
  CalendarDotsIcon,
  DownloadSimpleIcon,
  FunnelSimpleIcon,
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
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns/view-settings/components/view-settings'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import type { LegalMode, LegalModeLabels, LegalToolbarLabels } from './types'

const modeIcons = {
  calendar: CalendarDotsIcon,
  kanban: KanbanIcon,
  list: RowsIcon,
  table: TableIcon,
} as const satisfies Record<LegalMode, ViewSettingsMode['icon']>

export interface LegalToolbarButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: ButtonProps['variant']
}

export function LegalToolbarButton({
  children,
  onClick,
  variant = 'outline',
}: Readonly<LegalToolbarButtonProps>) {
  return (
    <ToolbarButton
      onClick={onClick}
      render={<Button type="button" variant={variant} />}
    >
      {children}
    </ToolbarButton>
  )
}

export interface LegalToolbarProps<
  TMode extends LegalMode,
  TStatus extends string,
> {
  description?: string
  labels: LegalToolbarLabels
  left?: ReactNode
  loading: boolean
  mode: TMode
  modeLabels: LegalModeLabels
  modes: readonly TMode[]
  onCreate?: () => void
  onExport?: () => void
  onModeChange: (mode: TMode) => void
  onStatusFilterChange: (status: TStatus | null) => void
  statusFilter: TStatus | null
  statusLabels: Record<TStatus, string>
  statuses: readonly TStatus[]
}

export function LegalToolbar<TMode extends LegalMode, TStatus extends string>({
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
}: Readonly<LegalToolbarProps<TMode, TStatus>>) {
  const viewModes = modes.map(
    (value): ViewSettingsMode<TMode> => ({
      icon: modeIcons[value],
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
            <ViewSettingsMenu
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
            </ViewSettingsMenu>
            {onExport ? (
              <LegalToolbarButton onClick={onExport} variant="ghost">
                <DownloadSimpleIcon aria-hidden="true" />
                {labels.export}
              </LegalToolbarButton>
            ) : null}
            {onCreate ? (
              <LegalToolbarButton onClick={onCreate} variant="default">
                {labels.create}
              </LegalToolbarButton>
            ) : null}
          </>
        )
      }
    />
  )
}
