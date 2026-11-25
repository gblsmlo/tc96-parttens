import {
  Revenue3,
  type Revenue3Density,
  type Revenue3Props,
} from '@tc96/ui/blocks/data/revenue/revenue-3'
import { useState } from 'react'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/revenue-3.ts'
import type { Revenue3Controls } from './revenue-3-controls.ts'

interface ComposedRevenue3Props extends Revenue3Controls {
  onCollapsedRegionIdsChange?: Revenue3Props['onCollapsedRegionIdsChange']
  onDensityChange?: Revenue3Props['onDensityChange']
  onExport?: Revenue3Props['onExport']
  onRowAction?: Revenue3Props['onRowAction']
}

export const ComposedRevenue3 = ({
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
}: Readonly<ComposedRevenue3Props>) => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([
    'emea',
    'apac',
    'latam',
  ])
  const [density, setDensity] = useState<Revenue3Density>('medium')

  return (
    <Revenue3
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
