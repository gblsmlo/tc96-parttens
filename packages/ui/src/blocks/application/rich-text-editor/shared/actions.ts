import {
  getSuggestionKey,
  acceptSuggestion as plateAcceptSuggestion,
  rejectSuggestion as plateRejectSuggestion,
  type TResolvedSuggestion,
} from '@platejs/suggestion'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import type {
  RichTextEditorInstance,
  RichTextValue,
} from '@tc96/ui/patterns/rich-text-editor'
import { useMemo, useSyncExternalStore } from 'react'
import { collectSuggestions } from './collect'
import { setActiveSuggestion, subscribe } from './store'
import type { SuggestionAuthor, SuggestionChange } from './types'

const describe = (id: string): TResolvedSuggestion => ({
  createdAt: new Date(),
  keyId: getSuggestionKey(id),
  suggestionId: id,
  type: 'insert',
  userId: '',
})

/**
 * Runs an edit as a direct change even while the editor is suggesting, so it
 * is not recorded as a new suggestion.
 */
export function applyDirectly(
  editor: RichTextEditorInstance,
  edit: () => void,
): void {
  editor.getApi(SuggestionPlugin).suggestion.withoutSuggestions(edit)
}

/**
 * Lists the changes of an editor and re-renders when the document changes.
 * Needs the plugins from `createSuggestionKit` on the editor.
 *
 * @param editor - the editor created with `useRichTextEditor`
 * @param authors - known people, to turn a `userId` into a name
 */
export function useSuggestions(
  editor: RichTextEditorInstance,
  authors?: readonly SuggestionAuthor[],
): SuggestionChange[] {
  const children = useSyncExternalStore(
    (listener) => subscribe(editor, listener),
    () => editor.children,
    () => editor.children,
  )
  return useMemo(
    () => collectSuggestions(children as RichTextValue, authors),
    [children, authors],
  )
}

export function acceptSuggestion(
  editor: RichTextEditorInstance,
  id: string,
): void {
  applyDirectly(editor, () => plateAcceptSuggestion(editor, describe(id)))
}

export function rejectSuggestion(
  editor: RichTextEditorInstance,
  id: string,
): void {
  applyDirectly(editor, () => plateRejectSuggestion(editor, describe(id)))
}

export function acceptAll(editor: RichTextEditorInstance): void {
  applyDirectly(editor, () => {
    for (const change of collectSuggestions(editor.children as RichTextValue))
      plateAcceptSuggestion(editor, describe(change.id))
  })
}

export function rejectAll(editor: RichTextEditorInstance): void {
  applyDirectly(editor, () => {
    for (const change of collectSuggestions(editor.children as RichTextValue))
      plateRejectSuggestion(editor, describe(change.id))
  })
}

/**
 * Marks a change as the active one and scrolls it into view.
 */
export function goTo(editor: RichTextEditorInstance, id: string): void {
  setActiveSuggestion(editor, id)
  const entry = editor.getApi(SuggestionPlugin).suggestion.node({ at: [], id })
  const dom = entry ? editor.api.toDOMNode(entry[0]) : undefined
  dom?.scrollIntoView({ block: 'center' })
}
