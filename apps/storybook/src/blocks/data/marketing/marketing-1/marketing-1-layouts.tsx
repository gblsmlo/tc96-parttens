import {
  Marketing1,
  type Marketing1Props,
} from '@tc96/ui/blocks/data/marketing/marketing-1'
import { useState } from 'react'
import {
  campaigns,
  factorySettings,
  type Marketing1ViewSettings,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/marketing-1.ts'
import type { Marketing1Controls } from './marketing-1-controls.ts'

interface ComposedMarketing1Props extends Marketing1Controls {
  onColumnVisibilityChange?: Marketing1Props['onColumnVisibilityChange']
  onCreate?: Marketing1Props['onCreate']
  onDensityChange?: Marketing1Props['onDensityChange']
  onExport?: Marketing1Props['onExport']
  onRowAction?: Marketing1Props['onRowAction']
  onSortChange?: Marketing1Props['onSortChange']
}

export const ComposedMarketing1 = ({
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
}: Readonly<ComposedMarketing1Props>) => {
  const [settings, setSettings] =
    useState<Marketing1ViewSettings>(factorySettings)
  const update = (patch: Partial<Marketing1ViewSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Marketing1
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
