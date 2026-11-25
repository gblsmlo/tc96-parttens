import {
  Marketing2,
  type Marketing2Props,
} from '@tc96/ui/blocks/data/marketing/marketing-2'
import { useState } from 'react'
import {
  campaigns,
  factorySettings,
  type Marketing2ViewSettings,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/marketing-2.ts'
import type { Marketing2Controls } from './marketing-2-controls.ts'

interface ComposedMarketing2Props extends Marketing2Controls {
  onColumnVisibilityChange?: Marketing2Props['onColumnVisibilityChange']
  onCreate?: Marketing2Props['onCreate']
  onDensityChange?: Marketing2Props['onDensityChange']
  onExport?: Marketing2Props['onExport']
  onRowAction?: Marketing2Props['onRowAction']
  onSortChange?: Marketing2Props['onSortChange']
}

export const ComposedMarketing2 = ({
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
}: Readonly<ComposedMarketing2Props>) => {
  const [settings, setSettings] =
    useState<Marketing2ViewSettings>(factorySettings)
  const update = (patch: Partial<Marketing2ViewSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Marketing2
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
