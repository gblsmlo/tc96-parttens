import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import { useSyncExternalStore } from 'react'
import type { SuggestionState, SuggestionView } from './types'

interface Store {
  listeners: Set<() => void>
  scheduled: boolean
  state: SuggestionState
}

const stores = new WeakMap<RichTextEditorInstance, Store>()

export function storeFor(editor: RichTextEditorInstance): Store {
  let store = stores.get(editor)
  if (!store) {
    store = {
      listeners: new Set(),
      scheduled: false,
      state: { activeId: null, view: 'all' },
    }
    stores.set(editor, store)
  }
  return store
}

export function notify(editor: RichTextEditorInstance): void {
  const store = storeFor(editor)
  for (const listener of store.listeners) listener()
}

export function notifyLater(editor: RichTextEditorInstance): void {
  const store = storeFor(editor)
  if (store.scheduled) return
  store.scheduled = true
  queueMicrotask(() => {
    store.scheduled = false
    notify(editor)
  })
}

export function subscribe(
  editor: RichTextEditorInstance,
  listener: () => void,
): () => void {
  const store = storeFor(editor)
  store.listeners.add(listener)
  return () => {
    store.listeners.delete(listener)
  }
}

export function getSuggestionState(
  editor: RichTextEditorInstance,
): SuggestionState {
  return storeFor(editor).state
}

/**
 * Subscribes a component to the review state of an editor: the active change
 * and the view. Works inside and outside the editor's `<Plate>` tree.
 */
export function useSuggestionState(
  editor: RichTextEditorInstance,
): SuggestionState {
  return useSyncExternalStore(
    (listener) => subscribe(editor, listener),
    () => storeFor(editor).state,
    () => storeFor(editor).state,
  )
}

export function setSuggestionView(
  editor: RichTextEditorInstance,
  view: SuggestionView,
): void {
  const store = storeFor(editor)
  if (store.state.view === view) return
  store.state = { ...store.state, view }
  notify(editor)
}

export function setActiveSuggestion(
  editor: RichTextEditorInstance,
  activeId: string | null,
): void {
  const store = storeFor(editor)
  if (store.state.activeId === activeId) return
  store.state = { ...store.state, activeId }
  notify(editor)
}
