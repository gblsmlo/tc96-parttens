import { LockSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { MenuCheckboxItem } from '@tc96/ui/menu'
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

export function WikiPageStrip({
  labels,
  outline,
  saveStatus,
  settings,
}: Readonly<{
  labels: RichTextEditor2Labels
  outline: React.ReactNode
  saveStatus: 'saved' | 'saving' | null
  settings: RichTextEditor2Settings
}>) {
  return (
    <div
      className="flex min-h-10 items-center gap-2 py-1"
      data-slot="wiki-page-strip"
    >
      {outline}
      <div className="ms-auto flex items-center gap-2">
        {saveStatus ? (
          <output className="text-muted-foreground text-sm">
            {labels[saveStatus]}
          </output>
        ) : null}
        {settings.locked ? <WikiLockBadge labels={labels} /> : null}
      </div>
    </div>
  )
}
