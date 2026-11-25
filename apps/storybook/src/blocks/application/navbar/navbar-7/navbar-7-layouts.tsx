import {
  Navbar7,
  type Navbar7Range,
} from '@tc96/ui/blocks/application/navbar/navbar-7'
import { MenuItem } from '@tc96/ui/menu'
import { useState } from 'react'
import { fn } from 'storybook/test'
import {
  breadcrumb,
  novemberRange,
  refreshOptions,
  searchItems,
} from '../fixtures/navbar-7.ts'
import type { Navbar7Controls } from './navbar-7-controls.ts'

export const navbar7Handlers = {
  onCompareChange: fn(),
  onRangeChange: fn(),
  onRefresh: fn(),
  onRefreshIntervalChange: fn(),
  onSearchSelect: fn(),
  onShare: fn(),
}

export const navbar7Menu = (
  <>
    <MenuItem>Exportar como PDF</MenuItem>
    <MenuItem>Duplicar painel</MenuItem>
    <MenuItem variant="destructive">Excluir painel</MenuItem>
  </>
)

const StatefulNavbar7 = ({
  compare: initialCompare,
  hasRange,
  refreshInterval: initialInterval,
  showCompare,
  showInterval,
  showMenu,
  showRange,
  showRefresh,
  showSearch,
  showShare,
}: Readonly<Navbar7Controls>) => {
  const [compare, setCompare] = useState(initialCompare)
  const [interval, setInterval] = useState(initialInterval)
  const [range, setRange] = useState<Navbar7Range>(
    hasRange ? novemberRange : {},
  )

  return (
    <Navbar7
      breadcrumb={breadcrumb}
      compare={compare}
      menu={showMenu ? navbar7Menu : undefined}
      onCompareChange={
        showCompare
          ? (next) => {
              setCompare(next)
              navbar7Handlers.onCompareChange(next)
            }
          : undefined
      }
      onRangeChange={
        showRange
          ? (next) => {
              setRange(next)
              navbar7Handlers.onRangeChange(next)
            }
          : undefined
      }
      onRefresh={showRefresh ? navbar7Handlers.onRefresh : undefined}
      onRefreshIntervalChange={
        showInterval
          ? (id) => {
              setInterval(id)
              navbar7Handlers.onRefreshIntervalChange(id)
            }
          : undefined
      }
      onSearchSelect={showSearch ? navbar7Handlers.onSearchSelect : undefined}
      onShare={showShare ? navbar7Handlers.onShare : undefined}
      range={range}
      refreshInterval={interval}
      refreshOptions={showInterval ? refreshOptions : undefined}
      searchItems={showSearch ? searchItems : undefined}
    />
  )
}

export const ComposedNavbar7 = (controls: Readonly<Navbar7Controls>) => (
  <StatefulNavbar7
    key={`${controls.hasRange}-${controls.compare}-${controls.refreshInterval}`}
    {...controls}
  />
)
