'use client'

import type { PaginationState } from '@tanstack/react-table'
import { DataGrid } from '@tc96/ui/patterns/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Switch } from '@tc96/ui/switch'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { useId, useMemo, useState } from 'react'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsIntegration8Labels } from './labels'
import { createSettingsIntegration8Columns } from './settings-integration-8-columns'
import { SettingsIntegration8Skeleton } from './settings-integration-8-skeleton'
import type {
  SettingsIntegration8Item,
  SettingsIntegration8Props,
} from './types'

export const defaultSettingsIntegration8PageSizeOptions: readonly number[] = [
  10, 20, 50,
]

export function SettingsIntegration8({
  allPaused = false,
  className,
  error,
  integrations,
  labels: labelsProp,
  onAllPausedChange,
  onCopyKey,
  onEnabledChange,
  onRetry,
  pageSize: pageSizeProp = 10,
  pageSizeOptions = defaultSettingsIntegration8PageSizeOptions,
  pending,
}: Readonly<SettingsIntegration8Props>) {
  const labels = useMemo(
    () => ({ ...defaultSettingsIntegration8Labels, ...labelsProp }),
    [labelsProp],
  )
  const columns = useMemo(
    () =>
      createSettingsIntegration8Columns({
        labels,
        onCopyKey,
        onEnabledChange,
        paused: allPaused,
      }),
    [allPaused, labels, onCopyKey, onEnabledChange],
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeProp,
  })
  const { table } = useDataGrid<SettingsIntegration8Item>({
    columns,
    data: integrations,
    enablePagination: true,
    getRowId: (item) => item.id,
    onPaginationChange: setPagination,
    pagination,
  })
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsIntegration8Skeleton />,
  })
  const titleId = `settings-integration-8-title-${useId()}`
  const pauseId = `settings-integration-8-pause-${useId()}`

  return (
    <section
      aria-labelledby={titleId}
      className={cn('mx-auto flex w-full max-w-4xl flex-col gap-3', className)}
      data-slot="settings-section"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Text
            render={<h2 id={titleId}>{labels.title}</h2>}
            size="base"
            weight="medium"
          />
          <Text
            foreground="muted"
            render={<p>{labels.description}</p>}
            size="sm"
          />
        </div>
        {onAllPausedChange && !loadState && integrations.length > 0 ? (
          <div className="flex items-center gap-2">
            <Switch
              aria-labelledby={pauseId}
              checked={allPaused}
              onCheckedChange={(paused) => onAllPausedChange(paused)}
            />
            <Text
              render={<span id={pauseId}>{labels.pauseAll}</span>}
              size="sm"
            />
          </div>
        ) : null}
      </div>
      {loadState ??
        (integrations.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <DataGrid
            aria-label={labels.title}
            footer={
              <DataGridPagination
                pageSizeLabel={labels.rowsPerPage}
                pageSizeOptions={pageSizeOptions}
                table={table}
              />
            }
            table={table}
          />
        ))}
    </section>
  )
}
