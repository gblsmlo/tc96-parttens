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
import { WikiBlockGutter } from './wiki-block-menu'
import { WikiOutlinePopover, WikiOutlineRail } from './wiki-outline'
import {
  WikiLockBadge,
  WikiPageMenuItems,
  WikiPageStrip,
} from './wiki-page-menu'
import { WikiTableBar } from './wiki-table-bar'

const defaultSettings: RichTextEditor2Settings = {
  fullWidth: false,
  locked: false,
  smallText: false,
}

interface HoveredBlock {
  index: number
  top: number
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
  const [hovered, setHovered] = useState<HoveredBlock | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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
    blockDragLabels: {
      handle: labels.dragHandle,
      selection: labels.blockSelection,
    },
    ...(defaultValue ? { defaultValue } : {}),
    draggableBlocks: true,
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const trackBlock = (event: globalThis.MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const block = target.closest('[data-slot="rich-text-block"]')
      if (!block) return
      const index = editor.children.findIndex((node) => {
        const dom = editor.api.toDOMNode(node)
        return dom ? block.contains(dom) : false
      })
      if (index < 0) return
      const top =
        block.getBoundingClientRect().top -
        container.getBoundingClientRect().top
      setHovered((current) =>
        current?.index === index && current.top === top
          ? current
          : { index, top },
      )
    }
    container.addEventListener('mousemove', trackBlock)
    container.addEventListener('mouseover', trackBlock)
    return () => {
      container.removeEventListener('mousemove', trackBlock)
      container.removeEventListener('mouseover', trackBlock)
    }
  }, [editor])

  const status = onSave ? saveStatus : null
  const outline = <WikiOutlinePopover labels={labels} />
  const context: RichTextEditor2NavbarContext = {
    lockBadge: settings.locked ? <WikiLockBadge labels={labels} /> : null,
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
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  const shownBlock =
    hovered && hovered.index < editor.children.length ? hovered : null

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
        ref={containerRef}
      >
        <RichTextEditor
          aria-label={labels.editor}
          contentClassName={cn(
            'min-h-96 pt-6 pb-24 ps-24 lg:pe-16',
            settings.smallText ? 'text-sm' : 'text-base',
          )}
          draggableBlocks
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
              <WikiPageStrip
                labels={labels}
                outline={outline}
                saveStatus={status}
                settings={settings}
              />
              <WikiTableBar labels={labels} />
            </>
          }
        >
          {shownBlock && !settings.locked ? (
            <WikiBlockGutter
              editor={editor}
              index={shownBlock.index}
              labels={labels}
              top={shownBlock.top}
            />
          ) : null}
          <WikiOutlineRail labels={labels} />
        </RichTextEditor>
      </div>
    </div>
  )
}
