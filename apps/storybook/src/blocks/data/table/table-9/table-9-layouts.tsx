import { Table9, type Table9Props } from '@tc96/ui/blocks/data/table/table-9'
import { useState } from 'react'
import {
  campaigns,
  factorySettings,
  pageSizeOptions,
  period,
  rowActions,
  summary,
  type Table9ViewSettings,
} from '../fixtures/table-9.ts'
import type { Table9Controls } from './table-9-controls.ts'

interface ComposedTable9Props extends Table9Controls {
  onColumnVisibilityChange?: Table9Props['onColumnVisibilityChange']
  onCreate?: Table9Props['onCreate']
  onDensityChange?: Table9Props['onDensityChange']
  onExport?: Table9Props['onExport']
  onRowAction?: Table9Props['onRowAction']
  onSortChange?: Table9Props['onSortChange']
}

export const ComposedTable9 = ({
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
}: Readonly<ComposedTable9Props>) => {
  const [settings, setSettings] = useState<Table9ViewSettings>(factorySettings)
  const update = (patch: Partial<Table9ViewSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Table9
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
