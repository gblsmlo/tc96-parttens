import {
  Team1,
  type Team1Props,
  type Team1Settings,
} from '@tc96/ui/blocks/data/team/team-1'
import { useState } from 'react'
import {
  factorySettings,
  members,
  pageSizeOptions,
} from '../fixtures/team-1.ts'
import type { Team1Controls } from './team-1-controls.ts'

interface ComposedTeam1Props extends Team1Controls {
  onColumnVisibilityChange?: Team1Props['onColumnVisibilityChange']
  onDensityChange?: Team1Props['onDensityChange']
  onSave?: Team1Props['onSave']
  onShowPausedChange?: Team1Props['onShowPausedChange']
  onSortChange?: Team1Props['onSortChange']
}

export const ComposedTeam1 = ({
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
}: Readonly<ComposedTeam1Props>) => {
  const [settings, setSettings] = useState<Team1Settings>(factorySettings)
  const update = (patch: Partial<Team1Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  return (
    <Team1
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
