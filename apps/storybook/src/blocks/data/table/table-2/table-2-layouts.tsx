import {
  Table2,
  type Table2Props,
  type Table2Settings,
} from '@tc96/ui/blocks/data/table/table-2'
import { useState } from 'react'
import {
  factorySettings,
  members,
  pageSizeOptions,
} from '../fixtures/table-2.ts'
import type { Table2Controls } from './table-2-controls.ts'

interface ComposedTable2Props extends Table2Controls {
  onColumnVisibilityChange?: Table2Props['onColumnVisibilityChange']
  onDensityChange?: Table2Props['onDensityChange']
  onSave?: Table2Props['onSave']
  onShowPausedChange?: Table2Props['onShowPausedChange']
  onSortChange?: Table2Props['onSortChange']
}

export const ComposedTable2 = ({
  empty,
  locale,
  onColumnVisibilityChange,
  onDensityChange,
  onSave,
  onShowPausedChange,
  onSortChange,
  pageSize,
  savePreference,
  showPausedSwitch,
  title,
}: Readonly<ComposedTable2Props>) => {
  const [settings, setSettings] = useState<Table2Settings>(factorySettings)
  const update = (patch: Partial<Table2Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Table2
      columnVisibility={settings.columnVisibility}
      density={settings.density}
      labels={{ title }}
      locale={locale}
      members={empty ? [] : members}
      onColumnVisibilityChange={(columnVisibility) => {
        update({ columnVisibility })
        onColumnVisibilityChange?.(columnVisibility)
      }}
      onDensityChange={(density) => {
        update({ density })
        onDensityChange?.(density)
      }}
      onSave={savePreference ? (next) => onSave?.(next) : undefined}
      onShowPausedChange={
        showPausedSwitch
          ? (showPaused) => {
              update({ showPaused })
              onShowPausedChange?.(showPaused)
            }
          : undefined
      }
      onSortChange={(sort) => {
        update({ sort })
        onSortChange?.(sort)
      }}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showPaused={settings.showPaused}
      sort={settings.sort}
    />
  )
}
