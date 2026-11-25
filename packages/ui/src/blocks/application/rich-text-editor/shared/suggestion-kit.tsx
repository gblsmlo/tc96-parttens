'use client'

import { SuggestionPlugin } from '@platejs/suggestion/react'
import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import { cn } from '@tc96/utils'
import type { AnyPluginConfig } from 'platejs'
import {
  createPlatePlugin,
  PlateLeaf,
  type PlateLeafProps,
  useEditorRef,
} from 'platejs/react'
import type { ReactElement } from 'react'
import { leafSuggestion } from './collect'
import { notifyLater, useSuggestionState } from './store'
import type { SuggestionAuthor } from './types'

export function SuggestionLeaf(props: PlateLeafProps): ReactElement {
  const editor = useEditorRef() as RichTextEditorInstance
  const { activeId, view } = useSuggestionState(editor)
  const data = leafSuggestion(props.leaf as Record<string, unknown>)
  const inserted = data?.type !== 'remove'
  const hidden =
    (view === 'final' && !inserted) || (view === 'original' && inserted)
  const marked = view === 'all'
  return (
    <PlateLeaf
      {...props}
      as={inserted ? 'ins' : 'del'}
      attributes={{
        ...props.attributes,
        ...(data ? { 'data-suggestion-id': data.id } : {}),
        'data-suggestion-type': data?.type ?? 'insert',
        ...(data && data.id === activeId ? { 'data-active': 'true' } : {}),
      }}
      className={cn(
        'scroll-mt-32 no-underline',
        hidden && 'hidden',
        marked &&
          inserted &&
          'rounded-sm bg-success/10 text-success-foreground underline decoration-success/60 underline-offset-2',
        marked &&
          !inserted &&
          'rounded-sm bg-destructive/10 text-destructive-foreground line-through',
        data &&
          data.id === activeId &&
          !hidden &&
          'outline-2 outline-ring outline-offset-1',
      )}
    />
  )
}

const directEditsPlugin = createPlatePlugin({
  key: 'redline_direct_edits',
}).overrideEditor(
  ({
    editor,
    tf: { addMark, deleteBackward, deleteForward, insertBreak, removeMark },
  }) => {
    const direct = (edit: () => void) =>
      (editor as RichTextEditorInstance)
        .getApi(SuggestionPlugin)
        .suggestion.withoutSuggestions(edit)
    const atBlockEdge = (edge: 'end' | 'start') => {
      const selection = editor.selection
      if (!selection || editor.api.isExpanded()) return false
      const block = editor.api.block()
      if (!block) return false
      return edge === 'start'
        ? editor.api.isStart(selection.anchor, block[1])
        : editor.api.isEnd(selection.anchor, block[1])
    }
    return {
      transforms: {
        addMark(key, value) {
          direct(() => addMark(key, value))
        },
        deleteBackward(unit) {
          if (atBlockEdge('start')) direct(() => deleteBackward(unit))
          else deleteBackward(unit)
        },
        deleteForward(unit) {
          if (atBlockEdge('end')) direct(() => deleteForward(unit))
          else deleteForward(unit)
        },
        insertBreak() {
          if (editor.api.isExpanded()) editor.tf.collapse({ edge: 'end' })
          direct(() => insertBreak())
        },
        removeMark(key) {
          direct(() => removeMark(key))
        },
      },
    }
  },
)

const trackerPlugin = createPlatePlugin({
  key: 'redline_tracker',
}).overrideEditor(({ editor, tf: { apply } }) => ({
  transforms: {
    apply(operation) {
      apply(operation)
      if (operation.type !== 'set_selection')
        notifyLater(editor as RichTextEditorInstance)
    },
  },
}))

export interface SuggestionKitOptions {
  author: SuggestionAuthor
  suggesting?: boolean
}

/**
 * The Plate plugins of the suggestion engine, to pass as `features.plugins`:
 * the suggestion plugin with its leaf renderer, the plugin that keeps
 * formatting and paragraph splits out of the suggestions, and the change
 * tracker behind `useSuggestions`.
 *
 * @param options.author - stamped on every change the editor records
 * @param options.suggesting - starts in suggesting mode; defaults to `true`
 */
export function createSuggestionKit({
  author,
  suggesting = true,
}: SuggestionKitOptions): AnyPluginConfig[] {
  return [
    SuggestionPlugin.configure({
      options: { currentUserId: author.id, isSuggesting: suggesting },
    }).withComponent(SuggestionLeaf),
    directEditsPlugin,
    trackerPlugin,
  ]
}

/**
 * Turns suggesting mode on or off. Off writes plain edits.
 */
export function setSuggesting(
  editor: RichTextEditorInstance,
  suggesting: boolean,
): void {
  editor.setOption(SuggestionPlugin, 'isSuggesting', suggesting)
}
