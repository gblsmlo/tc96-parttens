import {
  Team2,
  type Team2Props,
  type Team2Settings,
} from '@tc96/ui/blocks/data/team/team-2'
import { useState } from 'react'
import {
  factorySettings,
  members,
  pageSizeOptions,
} from '../fixtures/team-2.ts'
import type { Team2Controls } from './team-2-controls.ts'

interface ComposedTeam2Props extends Team2Controls {
  onColumnVisibilityChange?: Team2Props['onColumnVisibilityChange']
  onDensityChange?: Team2Props['onDensityChange']
  onSave?: Team2Props['onSave']
  onShowPausedChange?: Team2Props['onShowPausedChange']
  onSortChange?: Team2Props['onSortChange']
}

export const ComposedTeam2 = ({
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
}: Readonly<ComposedTeam2Props>) => {
  const [settings, setSettings] = useState<Team2Settings>(factorySettings)
  const update = (patch: Partial<Team2Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Team2
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
