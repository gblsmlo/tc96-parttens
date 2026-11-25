import { getSuggestionKey } from '@platejs/suggestion'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import { NodeApi, nanoid, type Point, RangeApi, type TRange } from 'platejs'
import {
  applyDirectly,
  type SuggestionAuthor,
  setSuggesting,
} from '../shared/suggestions'
import { type TextBlock, textBlocks } from './document-text'
import type { RichTextEditor5Edit } from './types'

export interface WriteContext {
  assistant: SuggestionAuthor
  author: SuggestionAuthor
  created: Set<string>
  within: () => TRange | null
}

function pointAt(block: TextBlock, offset: number, inclusive: boolean): Point {
  for (const segment of block.segments) {
    const end = segment.start + segment.length
    if (offset < end || (inclusive && offset <= end))
      return { offset: offset - segment.start, path: segment.path }
  }
  return { offset: 0, path: [...block.path, 0] }
}

export function findRange(
  editor: RichTextEditorInstance,
  needle: string,
  within: TRange | null,
): TRange | null {
  if (needle.length === 0) return null
  for (const block of textBlocks(editor.children)) {
    let from = block.text.indexOf(needle)
    while (from >= 0) {
      const range: TRange = {
        anchor: pointAt(block, from, false),
        focus: pointAt(block, from + needle.length, true),
      }
      const inside =
        !within ||
        (RangeApi.includes(within, range.anchor) &&
          RangeApi.includes(within, range.focus))
      if (inside) return range
      from = block.text.indexOf(needle, from + 1)
    }
  }
  return null
}

function asAssistant(
  editor: RichTextEditorInstance,
  context: WriteContext,
  write: () => void,
): void {
  editor.setOption(SuggestionPlugin, 'currentUserId', context.assistant.id)
  setSuggesting(editor, true)
  try {
    write()
  } finally {
    setSuggesting(editor, false)
    editor.setOption(SuggestionPlugin, 'currentUserId', context.author.id)
  }
}

export function writeEdit(
  editor: RichTextEditorInstance,
  edit: RichTextEditor5Edit,
  context: WriteContext,
): TRange | null {
  const within = context.within()
  if (edit.type === 'replace') {
    const range = findRange(editor, edit.find, within)
    if (!range) return null
    editor.tf.select(range)
    asAssistant(editor, context, () => editor.tf.insertText(edit.text))
    return editor.selection
  }
  if (edit.type === 'insert') {
    const range = findRange(editor, edit.after, within)
    if (!range) return null
    editor.tf.select(range.focus)
    asAssistant(editor, context, () => editor.tf.insertText(edit.text))
    return editor.selection
  }
  let top = editor.children.length - 1
  if (edit.after) {
    const anchor = edit.after
    const hit = textBlocks(editor.children).find((block) =>
      block.text.includes(anchor),
    )
    if (hit) top = hit.path[0] ?? top
  }
  const id = nanoid()
  const suggestionId = nanoid()
  const node = {
    children: [
      {
        [getSuggestionKey(suggestionId)]: {
          createdAt: Date.now(),
          id: suggestionId,
          type: 'insert',
          userId: context.assistant.id,
        },
        suggestion: true,
        text: edit.text,
      },
    ],
    id,
    type: edit.block,
    ...(edit.block === 'action_item' ? { checked: false } : {}),
  }
  applyDirectly(editor, () => editor.tf.insertNodes(node, { at: [top + 1] }))
  context.created.add(id)
  const end = editor.api.end([top + 1])
  if (end) editor.tf.select(end)
  return editor.selection
}

export function pruneEmptyBlocks(
  editor: RichTextEditorInstance,
  created: Set<string>,
): void {
  for (let index = editor.children.length - 1; index >= 0; index -= 1) {
    const node = editor.children[index] as { id?: string } | undefined
    if (!node?.id || !created.has(node.id)) continue
    if (NodeApi.string(node as never).length > 0) continue
    applyDirectly(editor, () => editor.tf.removeNodes({ at: [index] }))
    created.delete(node.id)
  }
}

export function jumpToText(
  editor: RichTextEditorInstance,
  quote: string,
): boolean {
  const range = findRange(editor, quote, null)
  if (!range) return false
  editor.tf.focus()
  editor.tf.select(range)
  const dom = editor.api.toDOMRange(range)
  const target = dom?.startContainer.parentElement
  target?.scrollIntoView({ block: 'center' })
  return true
}

export function caretPosition(
  editor: RichTextEditorInstance,
  point: Point,
  container: HTMLElement,
): { height: number; left: number; top: number } | null {
  try {
    const dom = editor.api.toDOMRange({ anchor: point, focus: point })
    if (!dom) return null
    const rect = dom.getClientRects()[0] ?? dom.getBoundingClientRect()
    const box = container.getBoundingClientRect()
    const fallback = dom.startContainer.parentElement?.getBoundingClientRect()
    const source = rect.height > 0 ? rect : fallback
    if (!source) return null
    return {
      height: source.height,
      left: (rect.height > 0 ? rect.left : source.left) - box.left,
      top: source.top - box.top,
    }
  } catch {
    return null
  }
}
