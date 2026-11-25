import {
  Revenue4,
  type Revenue4Density,
  type Revenue4Props,
} from '@tc96/ui/blocks/data/revenue/revenue-4'
import { useState } from 'react'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/revenue-4.ts'
import type { Revenue4Controls } from './revenue-4-controls.ts'

interface ComposedRevenue4Props extends Revenue4Controls {
  onCollapsedRegionIdsChange?: Revenue4Props['onCollapsedRegionIdsChange']
  onDensityChange?: Revenue4Props['onDensityChange']
  onExport?: Revenue4Props['onExport']
  onRowAction?: Revenue4Props['onRowAction']
}

export const ComposedRevenue4 = ({
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
}: Readonly<ComposedRevenue4Props>) => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([
    'emea',
    'apac',
    'latam',
  ])
  const [density, setDensity] = useState<Revenue4Density>('medium')

  return (
    <Revenue4
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
