'use client'

import { cn } from '@tc96/utils'
import { NodeApi, type TRange } from 'platejs'
import type { PlateEditor } from 'platejs/react'
import {
  type ReactElement,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'
import { richTextEditor4Colors } from './colors'
import type { RichTextEditor4Status, RichTextEditor4User } from './types'
import {
  comparePoints,
  getSharedRoot,
  type PlainPoint,
  relativeToPlainPoint,
} from './yjs-tree'

export interface RemotePerson {
  clientId: number
  color: RichTextEditor4User['color']
  id: string
  name: string
  selection: { anchor: unknown; focus: unknown } | null
  status: RichTextEditor4Status
}

const noPeople: RemotePerson[] = []

export function useRemotePeople(
  awareness: Awareness,
  selfId: string,
  enabled: boolean,
): RemotePerson[] {
  const [people, setPeople] = useState<RemotePerson[]>(noPeople)
  useEffect(() => {
    const read = () => {
      const next = new Map<string, RemotePerson>()
      awareness.getStates().forEach((state, clientId) => {
        const data = state.data as RichTextEditor4User | undefined
        if (clientId === awareness.clientID || !data || data.id === selfId)
          return
        const presence = state.presence as
          | { status?: RichTextEditor4Status }
          | undefined
        next.set(data.id, {
          clientId,
          color: data.color,
          id: data.id,
          name: data.name,
          selection: state.selection ?? null,
          status: presence?.status ?? 'viewing',
        })
      })
      setPeople([...next.values()])
    }
    read()
    awareness.on('change', read)
    return () => awareness.off('change', read)
  }, [awareness, selfId])
  return enabled ? people : noPeople
}

interface Box {
  height: number
  left: number
  top: number
  width: number
}

interface CaretLayout {
  caret: Box
  color: RichTextEditor4User['color']
  id: string
  name: string
  rects: Box[]
}

interface DomPoint {
  node: Node
  offset: number
}

function locate(editor: PlateEditor, point: PlainPoint): DomPoint | null {
  const node = NodeApi.get(editor, point.path)
  const element = node && editor.api.toDOMNode(node)
  if (!element) return null
  const walker = element.ownerDocument.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (text) =>
        text.parentElement?.closest('[data-slate-string]')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    },
  )
  let remaining = point.offset
  let last: Text | null = null
  while (walker.nextNode()) {
    const text = walker.currentNode as Text
    last = text
    if (remaining <= text.length) return { node: text, offset: remaining }
    remaining -= text.length
  }
  return last
    ? { node: last, offset: last.length }
    : { node: element, offset: 0 }
}

const toBox = (rect: DOMRect, origin: DOMRect): Box => ({
  height: Math.round(rect.height),
  left: Math.round(rect.left - origin.left),
  top: Math.round(rect.top - origin.top),
  width: Math.round(rect.width),
})

function measureCaret(
  point: DomPoint,
  origin: DOMRect,
  editor: PlateEditor,
  path: number[],
): Box {
  const range = document.createRange()
  range.setStart(point.node, point.offset)
  range.collapse(true)
  const rect = range.getClientRects()[0] ?? range.getBoundingClientRect()
  if (rect.height > 0) return { ...toBox(rect, origin), width: 0 }
  const block = NodeApi.get(editor, path)
  const element = block && editor.api.toDOMNode(block)
  const bounds = element?.getBoundingClientRect() ?? rect
  const lineHeight = element
    ? Number.parseFloat(getComputedStyle(element).lineHeight) || 24
    : 24
  return {
    height: Math.round(lineHeight),
    left: Math.round(bounds.left - origin.left),
    top: Math.round(bounds.top - origin.top),
    width: 0,
  }
}

function measureSelection(start: DomPoint, end: DomPoint, origin: DOMRect) {
  const range = document.createRange()
  range.setStart(start.node, start.offset)
  range.setEnd(end.node, end.offset)
  return Array.from(range.getClientRects())
    .filter((rect) => rect.width > 1 && rect.height > 1)
    .map((rect) => toBox(rect, origin))
}

const boxStyle = (box: Box) => ({
  height: box.height,
  left: box.left,
  top: box.top,
  width: box.width,
})

export function RemoteCarets({
  containerRef,
  doc,
  draft,
  editor,
  followId,
  people,
}: Readonly<{
  containerRef: RefObject<HTMLElement | null>
  doc: Y.Doc
  draft: TRange | null
  editor: PlateEditor
  followId: string | null
  people: RemotePerson[]
}>): ReactElement {
  const [layouts, setLayouts] = useState<CaretLayout[]>([])
  const [draftRects, setDraftRects] = useState<Box[]>([])
  const signature = useRef('')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let frame = 0
    const measure = () => {
      const origin = container.getBoundingClientRect()
      const root = getSharedRoot(doc)
      const next: CaretLayout[] = []
      for (const person of people) {
        if (!person.selection) continue
        const anchor = relativeToPlainPoint(doc, root, person.selection.anchor)
        const focus = relativeToPlainPoint(doc, root, person.selection.focus)
        if (!anchor || !focus) continue
        const [start, end] =
          comparePoints(anchor, focus) <= 0 ? [anchor, focus] : [focus, anchor]
        const from = locate(editor, start)
        const to = locate(editor, end)
        const at = locate(editor, focus)
        if (!from || !to || !at) continue
        next.push({
          caret: measureCaret(at, origin, editor, focus.path),
          color: person.color,
          id: person.id,
          name: person.name,
          rects:
            comparePoints(anchor, focus) === 0
              ? []
              : measureSelection(from, to, origin),
        })
      }
      const domRange = draft && editor.api.toDOMRange(draft)
      const nextDraft = domRange
        ? Array.from(domRange.getClientRects())
            .filter((rect) => rect.width > 1 && rect.height > 1)
            .map((rect) => toBox(rect, origin))
        : []
      const key = JSON.stringify([next, nextDraft])
      if (key === signature.current) return
      signature.current = key
      setLayouts(next)
      setDraftRects(nextDraft)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const editable = editor.api.toDOMNode(editor)
    const mutations = new MutationObserver(schedule)
    if (editable)
      mutations.observe(editable, {
        characterData: true,
        childList: true,
        subtree: true,
      })
    const resize = new ResizeObserver(schedule)
    resize.observe(container)
    doc.on('update', schedule)
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      resize.disconnect()
      doc.off('update', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [containerRef, doc, editor, people, draft])

  const followed = layouts.find((layout) => layout.id === followId)
  const followedAt = followed
    ? `${followed.caret.left}:${followed.caret.top}`
    : ''
  useEffect(() => {
    if (!followId || !followedAt) return
    containerRef.current
      ?.querySelector(
        `[data-slot="remote-caret"][data-user="${CSS.escape(followId)}"]`,
      )
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [containerRef, followId, followedAt])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      data-slot="remote-carets"
    >
      {draftRects.map((rect) => (
        <span
          className="absolute bg-primary/25"
          data-slot="comment-draft"
          key={`${rect.left}:${rect.top}:${rect.width}`}
          style={boxStyle(rect)}
        />
      ))}
      {layouts.map((layout) => {
        const palette = richTextEditor4Colors[layout.color]
        return (
          <div data-slot="remote-person" data-user={layout.id} key={layout.id}>
            {layout.rects.map((rect) => (
              <span
                className={cn('absolute', palette.fill)}
                data-slot="remote-selection"
                data-user={layout.id}
                key={`${rect.left}:${rect.top}:${rect.width}`}
                style={boxStyle(rect)}
              />
            ))}
            <span
              className={cn('absolute w-0.5 -translate-x-px', palette.bar)}
              data-slot="remote-caret"
              data-user={layout.id}
              style={boxStyle({ ...layout.caret, width: 2 })}
            >
              <span
                className="absolute start-0 bottom-full flex -translate-y-px items-center gap-1 whitespace-nowrap rounded-sm rounded-bl-none border bg-popover px-1.5 py-0.5 text-popover-foreground text-xs shadow-sm"
                data-slot="remote-caret-label"
              >
                <span className={cn('size-1.5 rounded-full', palette.dot)} />
                {layout.name}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
