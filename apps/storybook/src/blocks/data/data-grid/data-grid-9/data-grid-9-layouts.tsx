import {
  DataGrid9,
  type DataGrid9Props,
} from '@tc96/ui/blocks/data/data-grid/data-grid-9'
import { useState } from 'react'
import {
  campaigns,
  type DataGrid9ViewSettings,
  factorySettings,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/data-grid-9.ts'
import type { DataGrid9Controls } from './data-grid-9-controls.ts'

interface ComposedDataGrid9Props extends DataGrid9Controls {
  onColumnVisibilityChange?: DataGrid9Props['onColumnVisibilityChange']
  onCreate?: DataGrid9Props['onCreate']
  onDensityChange?: DataGrid9Props['onDensityChange']
  onExport?: DataGrid9Props['onExport']
  onRowAction?: DataGrid9Props['onRowAction']
  onSortChange?: DataGrid9Props['onSortChange']
}

export const ComposedDataGrid9 = ({
  currency,
  empty,
  headerActions,
  locale,
  onColumnVisibilityChange,
  onCreate,
  onDensityChange,
  onExport,
  onRowAction,
  onSortChange,
  pageSize,
  rowActions: showRowActions,
  title,
}: Readonly<ComposedDataGrid9Props>) => {
  const [settings, setSettings] =
    useState<DataGrid9ViewSettings>(factorySettings)
  const update = (patch: Partial<DataGrid9ViewSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <DataGrid9
      campaigns={empty ? [] : campaigns}
      columnVisibility={settings.columnVisibility}
      currency={currency}
      density={settings.density}
      labels={{ title }}
      locale={locale}
      onColumnVisibilityChange={(columnVisibility) => {
        update({ columnVisibility })
        onColumnVisibilityChange?.(columnVisibility)
      }}
      onCreate={headerActions ? (onCreate ?? (() => undefined)) : undefined}
      onDensityChange={(density) => {
        update({ density })
        onDensityChange?.(density)
      }}
      onExport={headerActions ? (onExport ?? (() => undefined)) : undefined}
      onRowAction={
        showRowActions ? (onRowAction ?? (() => undefined)) : undefined
      }
      onSortChange={(sort) => {
        update({ sort })
        onSortChange?.(sort)
      }}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      period={period}
      rowActions={showRowActions ? rowActions : undefined}
      sort={settings.sort}
      summary={summary}
    />
  )
}
