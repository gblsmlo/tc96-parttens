import {
  DataGrid2,
  type DataGrid2Props,
  type DataGrid2Settings,
} from '@tc96/ui/blocks/data/data-grid/data-grid-2'
import { useState } from 'react'
import {
  factorySettings,
  members,
  pageSizeOptions,
  views,
} from '../fixtures/data-grid-2.ts'
import type { DataGrid2Controls } from './data-grid-2-controls.ts'

interface ComposedDataGrid2Props extends DataGrid2Controls {
  onColumnVisibilityChange?: DataGrid2Props['onColumnVisibilityChange']
  onDensityChange?: DataGrid2Props['onDensityChange']
  onSave?: DataGrid2Props['onSave']
  onShowPausedChange?: DataGrid2Props['onShowPausedChange']
  onSortChange?: DataGrid2Props['onSortChange']
  onViewChange?: DataGrid2Props['onViewChange']
  onViewCreate?: DataGrid2Props['onViewCreate']
}

export const ComposedDataGrid2 = ({
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
}: Readonly<ComposedDataGrid2Props>) => {
  const [settings, setSettings] = useState<DataGrid2Settings>(factorySettings)
  const [activeViewId, setActiveViewId] = useState('all')
  const update = (patch: Partial<DataGrid2Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <DataGrid2
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
