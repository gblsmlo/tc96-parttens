import {
  Table6,
  type Table6Density,
  type Table6Props,
} from '@tc96/ui/blocks/data/table/table-6'
import { useState } from 'react'
import { accounts, regions, rowActions, summary } from '../fixtures/table-6.ts'
import type { Table6Controls } from './table-6-controls.ts'

interface ComposedTable6Props extends Table6Controls {
  onCollapsedRegionIdsChange?: Table6Props['onCollapsedRegionIdsChange']
  onDensityChange?: Table6Props['onDensityChange']
  onExport?: Table6Props['onExport']
  onRowAction?: Table6Props['onRowAction']
}

export const ComposedTable6 = ({
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
}: Readonly<ComposedTable6Props>) => {
  const [collapsed, setCollapsed] = useState<readonly string[]>([
    'emea',
    'apac',
    'latam',
  ])
  const [density, setDensity] = useState<Table6Density>('medium')

  return (
    <Table6
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
