import {
  DataGrid6,
  type DataGrid6Density,
  type DataGrid6Props,
} from '@tc96/ui/blocks/data/data-grid/data-grid-6'
import { useState } from 'react'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/data-grid-6.ts'
import type { DataGrid6Controls } from './data-grid-6-controls.ts'

interface ComposedDataGrid6Props extends DataGrid6Controls {
  onCollapsedRegionIdsChange?: DataGrid6Props['onCollapsedRegionIdsChange']
  onDensityChange?: DataGrid6Props['onDensityChange']
  onExport?: DataGrid6Props['onExport']
  onRowAction?: DataGrid6Props['onRowAction']
}

export const ComposedDataGrid6 = ({
  currency,
  empty,
  exportAction,
  kpis,
  locale,
  onCollapsedRegionIdsChange,
  onDensityChange,
  onExport,
  onRowAction,
  rowActions: showRowActions,
  title,
  toggleAll,
}: Readonly<ComposedDataGrid6Props>) => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([
    'emea',
    'apac',
    'latam',
  ])
  const [density, setDensity] = useState<DataGrid6Density>('medium')

  return (
    <DataGrid6
      accounts={empty ? [] : accounts}
      collapsedRegionIds={toggleAll ? collapsed : undefined}
      currency={currency}
      density={density}
      labels={{ title }}
      locale={locale}
      onCollapsedRegionIdsChange={
        toggleAll
          ? (next) => {
              setCollapsed(next)
              onCollapsedRegionIdsChange?.(next)
            }
          : undefined
      }
      onDensityChange={(next) => {
        setDensity(next)
        onDensityChange?.(next)
      }}
      onExport={exportAction ? (onExport ?? (() => undefined)) : undefined}
      onRowAction={
        showRowActions ? (onRowAction ?? (() => undefined)) : undefined
      }
      regions={regions}
      rowActions={showRowActions ? rowActions : undefined}
      summary={kpis ? summary : undefined}
    />
  )
}
