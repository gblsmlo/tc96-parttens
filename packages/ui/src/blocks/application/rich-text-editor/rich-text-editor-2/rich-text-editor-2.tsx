import { getInitials } from '@tc96/ui/helpers/initials'
import {
  RichTextEditor,
  type RichTextMention,
  type RichTextValue,
  useRichTextEditor,
} from '@tc96/ui/patterns/rich-text-editor'
import { cn } from '@tc96/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { defaultRichTextEditor2Labels } from './labels'
import type {
  RichTextEditor2NavbarContext,
  RichTextEditor2Props,
  RichTextEditor2Settings,
} from './types'
import { WikiOutlinePopover, WikiOutlineRail } from './wiki-outline'
import {
  WikiLockBadge,
  WikiPageMenuItems,
  WikiPageStatus,
  WikiPageStrip,
} from './wiki-page-menu'
import { WikiTableBar } from './wiki-table-bar'

const defaultSettings: RichTextEditor2Settings = {
  fullWidth: false,
  locked: false,
  smallText: false,
}

export function RichTextEditor2({
  className,
  defaultSettings: settingsProp,
  defaultValue,
  labels: labelsProp,
  navbar,
  onSave,
  onSettingsChange,
  people = [],
  saveDelay = 800,
}: Readonly<RichTextEditor2Props>) {
  const labels = {
    ...defaultRichTextEditor2Labels,
    ...labelsProp,
    blockKinds: {
      ...defaultRichTextEditor2Labels.blockKinds,
      ...labelsProp?.blockKinds,
    },
  }
  const [settings, setSettings] = useState<RichTextEditor2Settings>({
    ...defaultSettings,
    ...settingsProp,
  })
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const mentions = useMemo<RichTextMention[]>(
    () =>
      people.map((person) => ({
        avatar: {
          fallback: getInitials(person.name),
          ...(person.image ? { url: person.image } : {}),
        },
        id: person.id,
        label: person.name,
      })),
    [people],
  )

  const editor = useRichTextEditor({
    ...(defaultValue ? { defaultValue } : {}),
    features: { h1: true },
    mentions,
  })

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleValueChange = (value: RichTextValue) => {
    if (!onSave) return
    setSaveStatus('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onSave(value)
      setSaveStatus('saved')
    }, saveDelay)
  }

  const handleSettingChange = (
    key: keyof RichTextEditor2Settings,
    value: boolean,
  ) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    onSettingsChange?.(next)
  }

  const status = onSave ? saveStatus : null
  const outline = <WikiOutlinePopover labels={labels} />
  const lockBadge = settings.locked ? <WikiLockBadge labels={labels} /> : null
  const context: RichTextEditor2NavbarContext = {
    lockBadge,
    onSettingChange: handleSettingChange,
    pageMenuItems: (
      <WikiPageMenuItems
        labels={labels}
        onSettingChange={handleSettingChange}
        settings={settings}
      />
    ),
    saveStatus: status,
    settings,
    status:
      status || lockBadge ? (
        <WikiPageStatus
          labels={labels}
          lockBadge={lockBadge}
          saveStatus={status}
        />
      ) : null,
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  return (
    <div
      className={cn('w-full', className)}
      data-slot="rich-text-editor-2"
      data-width={settings.fullWidth ? 'full' : 'page'}
    >
      <div
        className={cn(
          'relative mx-auto w-full',
          settings.fullWidth ? 'max-w-none' : 'max-w-4xl',
        )}
      >
        <RichTextEditor
          aria-label={labels.editor}
          blockLabels={{
            blockquote: labels.blockKinds.blockquote,
            h2: labels.blockKinds.h2,
            h3: labels.blockKinds.h3,
            ol: labels.blockKinds.ol,
            ul: labels.blockKinds.ul,
          }}
          contentClassName={cn(
            'min-h-96 px-6 pt-10 pb-24 sm:px-12 lg:pe-16',
            settings.smallText ? 'text-sm' : 'text-base',
          )}
          editor={editor}
          mentionEmptyLabel={labels.mentionEmpty}
          mentionLabel={labels.mention}
          mentions={mentions}
          onValueChange={handleValueChange}
          paragraphLabel={labels.blockKinds.p}
          placeholder={labels.placeholder}
          readOnly={settings.locked}
          slashMenuEmptyLabel={labels.slashMenuEmpty}
          slashMenuLabel={labels.slashMenu}
          toolbar={
            <>
              {navbarNode}
              <WikiPageStrip outline={outline} />
              <WikiTableBar labels={labels} />
            </>
          }
        >
          <WikiOutlineRail labels={labels} />
        </RichTextEditor>
      </div>
    </div>
  )
}
