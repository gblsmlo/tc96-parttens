import { LockSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { MenuCheckboxItem } from '@tc96/ui/menu'
import type { ReactNode } from 'react'
import type { RichTextEditor2Labels, RichTextEditor2Settings } from './types'

export function WikiPageMenuItems({
  labels,
  onSettingChange,
  settings,
}: Readonly<{
  labels: RichTextEditor2Labels
  onSettingChange: (key: keyof RichTextEditor2Settings, value: boolean) => void
  settings: RichTextEditor2Settings
}>) {
  return (
    <>
      <MenuCheckboxItem
        checked={settings.fullWidth}
        onCheckedChange={(next) => onSettingChange('fullWidth', next)}
      >
        {labels.fullWidth}
      </MenuCheckboxItem>
      <MenuCheckboxItem
        checked={settings.smallText}
        onCheckedChange={(next) => onSettingChange('smallText', next)}
      >
        {labels.smallText}
      </MenuCheckboxItem>
      <MenuCheckboxItem
        checked={settings.locked}
        onCheckedChange={(next) => onSettingChange('locked', next)}
      >
        {labels.lockPage}
      </MenuCheckboxItem>
    </>
  )
}

export function WikiLockBadge({
  labels,
}: Readonly<{ labels: RichTextEditor2Labels }>) {
  return (
    <Badge variant="secondary">
      <LockSimpleIcon aria-hidden="true" />
      {labels.locked}
    </Badge>
  )
}

export function WikiPageStatus({
  labels,
  lockBadge,
  saveStatus,
}: Readonly<{
  labels: RichTextEditor2Labels
  lockBadge: ReactNode
  saveStatus: 'saved' | 'saving' | null
}>) {
  return (
    <>
      {saveStatus ? (
        <output
          className="text-muted-foreground text-sm"
          data-slot="wiki-save-status"
        >
          {labels[saveStatus]}
        </output>
      ) : null}
      {lockBadge}
    </>
  )
}

export function WikiPageStrip({ outline }: Readonly<{ outline: ReactNode }>) {
  return (
    <div
      className="flex min-h-10 items-center gap-2 px-4 py-1 lg:hidden"
      data-slot="wiki-page-strip"
    >
      {outline}
    </div>
  )
}
