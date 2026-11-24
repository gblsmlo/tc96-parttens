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
  views,
} from '../fixtures/table-2.ts'
import type { Table2Controls } from './table-2-controls.ts'

interface ComposedTable2Props extends Table2Controls {
  onColumnVisibilityChange?: Table2Props['onColumnVisibilityChange']
  onDensityChange?: Table2Props['onDensityChange']
  onSave?: Table2Props['onSave']
  onShowPausedChange?: Table2Props['onShowPausedChange']
  onSortChange?: Table2Props['onSortChange']
  onViewChange?: Table2Props['onViewChange']
  onViewCreate?: Table2Props['onViewCreate']
}

export const ComposedTable2 = ({
  empty,
  locale,
  onColumnVisibilityChange,
  onDensityChange,
  onSave,
  onShowPausedChange,
  onSortChange,
  onViewChange,
  onViewCreate,
  pageSize,
  savePreference,
  showPausedSwitch,
  title,
  viewCreate,
  views: showViews,
}: Readonly<ComposedTable2Props>) => {
  const [settings, setSettings] = useState<Table2Settings>(factorySettings)
  const [activeViewId, setActiveViewId] = useState('all')
  const update = (patch: Partial<Table2Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Table2
      activeViewId={showViews ? activeViewId : undefined}
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
      onViewChange={
        showViews
          ? (viewId) => {
              const view = views.find((option) => option.id === viewId)
              if (view) setSettings(view.settings)
              setActiveViewId(viewId)
              onViewChange?.(viewId)
            }
          : undefined
      }
      onViewCreate={
        showViews && viewCreate ? () => onViewCreate?.() : undefined
      }
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showPaused={settings.showPaused}
      sort={settings.sort}
      views={showViews ? views : undefined}
    />
  )
}
