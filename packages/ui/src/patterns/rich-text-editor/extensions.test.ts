import { describe, expect, test } from 'bun:test'
import { getCommentKey, getDraftCommentKey } from '@platejs/comment'
import { CommentPlugin } from '@platejs/comment/react'
import {
  acceptSuggestion,
  getSuggestionKey,
  rejectSuggestion,
  type TResolvedSuggestion,
} from '@platejs/suggestion'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import {
  type ProviderConstructorProps,
  registerProviderType,
  type UnifiedProvider,
} from '@platejs/yjs'
import { YjsPlugin } from '@platejs/yjs/react'
import { richTextToPlainText } from '@tc96/ui/helpers/rich-text'
import type { Value } from 'platejs'
import { createPlateEditor } from 'platejs/react'
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from 'y-protocols/awareness'
import * as Y from 'yjs'
import { applyExtraBlock } from './extra-blocks'
import { applyBlock, richTextEditorOptions, setAlignment } from './plugins'
import {
  addTableColumn,
  addTableRow,
  hasTableHeaderRow,
  setTableColumnWidth,
  toggleTableHeaderRow,
} from './table-actions'

const paragraph = (text: string) => ({ children: [{ text }], type: 'p' })

function editorWith(
  value: Value,
  features: Parameters<typeof richTextEditorOptions>[3] = {},
) {
  return createPlateEditor({
    ...richTextEditorOptions(4, false, undefined, features),
    nodeId: false,
    value,
  })
}

describe('opt-in features', () => {
  test('h1 and alignment', () => {
    const editor = editorWith([paragraph('Titulo')], { align: true, h1: true })
    editor.tf.select({ path: [0, 0], offset: 0 })
    applyBlock(editor, 'h1')
    expect(editor.children[0]?.type).toBe('h1')
    setAlignment(editor, 'center')
    expect(editor.children[0]?.align).toBe('center')
  })

  test('without h1 the type is not registered', () => {
    const editor = editorWith([paragraph('x')])
    expect('h1' in editor.plugins).toBe(false)
  })
})

describe('table', () => {
  test('rows, columns, header and column width', () => {
    const editor = editorWith([paragraph('')])
    editor.tf.select({ path: [0, 0], offset: 0 })
    applyExtraBlock(editor, 'table')
    const table = () =>
      editor.children.find((node) => node.type === 'table') as {
        children: { children: unknown[]; type: string }[]
        colSizes?: number[]
      }
    editor.tf.select({ path: [1, 0, 0, 0, 0], offset: 0 })
    expect(table().children).toHaveLength(3)
    addTableRow(editor, 'after')
    expect(table().children).toHaveLength(4)
    addTableColumn(editor, 'after')
    expect(table().children[0]?.children).toHaveLength(4)
    expect(hasTableHeaderRow(editor)).toBe(false)
    toggleTableHeaderRow(editor)
    expect(hasTableHeaderRow(editor)).toBe(true)
    toggleTableHeaderRow(editor)
    expect(hasTableHeaderRow(editor)).toBe(false)
    const tablePath = editor.api.findPath(table() as never) as number[]
    setTableColumnWidth(editor, [...tablePath, 0, 1], 1, 200)
    expect(table().colSizes?.[1]).toBe(200)
  })
})

describe('suggestion plugin', () => {
  const setup = () => {
    const editor = editorWith([paragraph('Hello world')], {
      plugins: [
        SuggestionPlugin.configure({
          options: { currentUserId: 'ana', isSuggesting: true },
        }),
      ],
    })
    return editor
  }

  test('typing in suggesting mode inserts a marked leaf', () => {
    const editor = setup()
    editor.tf.select({ path: [0, 0], offset: 5 })
    editor.tf.insertText('!!')
    const leaves = (
      editor.children[0] as { children: Record<string, unknown>[] }
    ).children
    const inserted = leaves.find((leaf) => leaf.suggestion === true)
    expect(inserted?.text).toBe('!!')
    const key = Object.keys(inserted ?? {}).find((k) =>
      k.startsWith('suggestion_'),
    )
    expect((inserted?.[key as string] as { type: string }).type).toBe('insert')
    expect((inserted?.[key as string] as { userId: string }).userId).toBe('ana')
  })

  test('deleting in suggesting mode keeps the text marked as removed', () => {
    const editor = setup()
    editor.tf.select({
      anchor: { offset: 0, path: [0, 0] },
      focus: { offset: 5, path: [0, 0] },
    })
    editor.tf.deleteFragment()
    expect(richTextToPlainText(editor.children as never)).toBe('Hello world')
    const leaves = (
      editor.children[0] as { children: Record<string, unknown>[] }
    ).children
    const removed = leaves.find((leaf) => leaf.suggestion === true)
    expect(removed?.text).toBe('Hello')
    const key = Object.keys(removed ?? {}).find((k) =>
      k.startsWith('suggestion_'),
    ) as string
    expect((removed?.[key] as { type: string }).type).toBe('remove')
  })

  test('turning suggesting mode off writes plain text', () => {
    const editor = setup()
    editor.setOption(SuggestionPlugin, 'isSuggesting', false)
    editor.tf.select({ path: [0, 0], offset: 5 })
    editor.tf.insertText('!!')
    expect(JSON.stringify(editor.children)).not.toContain('suggestion')
    expect(richTextToPlainText(editor.children as never)).toBe('Hello!! world')
  })

  const resolve = (editor: ReturnType<typeof setup>): TResolvedSuggestion => {
    const node = editor
      .getApi(SuggestionPlugin)
      .suggestion.nodes()[0]?.[0] as unknown as Record<string, unknown>
    const key = Object.keys(node).find((k) =>
      k.startsWith('suggestion_'),
    ) as string
    const data = node[key] as {
      createdAt: number
      id: string
      type: 'insert' | 'remove'
      userId: string
    }
    return {
      createdAt: new Date(data.createdAt),
      keyId: key,
      suggestionId: data.id,
      type: data.type,
      userId: data.userId,
      ...(data.type === 'insert'
        ? { newText: String(node.text) }
        : { text: String(node.text) }),
    }
  }

  test('accept keeps an insertion, reject drops it', () => {
    const accepted = setup()
    accepted.tf.select({ path: [0, 0], offset: 5 })
    accepted.tf.insertText('!!')
    accepted
      .getApi(SuggestionPlugin)
      .suggestion.withoutSuggestions(() =>
        acceptSuggestion(accepted, resolve(accepted)),
      )
    expect(richTextToPlainText(accepted.children as never)).toBe(
      'Hello!! world',
    )
    expect(JSON.stringify(accepted.children)).not.toContain('suggestion')

    const rejected = setup()
    rejected.tf.select({ path: [0, 0], offset: 5 })
    rejected.tf.insertText('!!')
    rejected
      .getApi(SuggestionPlugin)
      .suggestion.withoutSuggestions(() =>
        rejectSuggestion(rejected, resolve(rejected)),
      )
    expect(richTextToPlainText(rejected.children as never)).toBe('Hello world')
    expect(getSuggestionKey('x')).toBe('suggestion_x')
  })
})

describe('comment plugin', () => {
  test('a draft comment marks the selected text and can be unset', () => {
    const editor = editorWith([paragraph('Hello world')], {
      plugins: [CommentPlugin],
    })
    editor.tf.select({
      anchor: { offset: 0, path: [0, 0] },
      focus: { offset: 5, path: [0, 0] },
    })
    editor.getTransforms(CommentPlugin).comment.setDraft()
    const marked = () =>
      (editor.children[0] as { children: Record<string, unknown>[] }).children
        .filter((leaf) =>
          Object.keys(leaf).some((k) => k.startsWith('comment')),
        )
        .map((leaf) => leaf.text)
    expect(marked()).toEqual(['Hello'])
    expect(
      editor.getApi(CommentPlugin).comment.nodes({ isDraft: true }),
    ).toHaveLength(1)
    const [draftNode, draftPath] = editor
      .getApi(CommentPlugin)
      .comment.nodes({ isDraft: true })[0] as [
      Record<string, unknown>,
      number[],
    ]
    expect(draftNode.text).toBe('Hello')
    editor.tf.unsetNodes(getDraftCommentKey(), { at: draftPath })
    editor.tf.setNodes({ [getCommentKey('c1')]: true }, { at: draftPath })
    expect(editor.getApi(CommentPlugin).comment.has({ id: 'c1' })).toBe(true)
    expect(
      editor.getApi(CommentPlugin).comment.nodes({ id: 'c1' }),
    ).toHaveLength(1)
    editor.getTransforms(CommentPlugin).comment.unsetMark({ id: 'c1' })
    expect(editor.getApi(CommentPlugin).comment.has({ id: 'c1' })).toBe(false)
    editor.getTransforms(CommentPlugin).comment.unsetMark({})
    expect(marked()).toEqual([])
  })
})

function link(a: Y.Doc, b: Y.Doc) {
  a.on('update', (update: Uint8Array, origin: unknown) => {
    if (origin !== 'remote') Y.applyUpdate(b, update, 'remote')
  })
  b.on('update', (update: Uint8Array, origin: unknown) => {
    if (origin !== 'remote') Y.applyUpdate(a, update, 'remote')
  })
}

class LocalProvider implements UnifiedProvider {
  awareness: Awareness
  document: Y.Doc
  isConnected = false
  isSynced = false
  type = 'local'
  private readonly props: ProviderConstructorProps

  constructor(props: ProviderConstructorProps) {
    this.props = props
    this.awareness = props.awareness as Awareness
    this.document = props.doc as Y.Doc
  }

  connect() {
    this.isConnected = true
    this.isSynced = true
    this.props.onConnect?.()
    this.props.onSyncChange?.(true)
  }

  disconnect() {
    this.isConnected = false
    this.props.onDisconnect?.()
  }

  destroy() {
    this.disconnect()
  }
}

registerProviderType('local', LocalProvider)

describe('yjs plugin', () => {
  test('two editors converge through an in-memory provider', async () => {
    const docA = new Y.Doc()
    const docB = new Y.Doc()
    link(docA, docB)
    const awarenessA = new Awareness(docA)
    const awarenessB = new Awareness(docB)
    const relay = (from: Awareness, to: Awareness) =>
      from.on(
        'update',
        (
          { added, removed, updated }: Record<string, number[]>,
          origin: unknown,
        ) => {
          if (origin === 'remote') return
          const changed = [...added, ...updated, ...removed]
          applyAwarenessUpdate(
            to,
            encodeAwarenessUpdate(from, changed),
            'remote',
          )
        },
      )
    relay(awarenessA, awarenessB)
    relay(awarenessB, awarenessA)
    const make = (doc: Y.Doc, awareness: Awareness, name: string) =>
      createPlateEditor({
        ...richTextEditorOptions(4, false, undefined, {
          plugins: [
            YjsPlugin.configure({
              options: {
                awareness,
                cursors: { data: { color: '#f00', name } },
                providers: [{ options: {}, type: 'local' } as never],
                ydoc: doc,
              },
            }),
          ],
          skipInitialization: true,
        }),
        nodeId: false,
      })
    const a = make(docA, awarenessA, 'A')
    const b = make(docB, awarenessB, 'B')
    await a.getApi(YjsPlugin).yjs.init({
      autoSelect: 'start',
      id: 'room',
      value: [paragraph('Hello')],
    })
    await b.getApi(YjsPlugin).yjs.init({ id: 'room', value: [paragraph('')] })
    a.tf.select({ path: [0, 0], offset: 5 })
    a.tf.insertText(' world')
    await new Promise((done) => setTimeout(done, 0))
    expect(richTextToPlainText(a.children as never)).toBe('Hello world')
    expect(richTextToPlainText(b.children as never)).toBe('Hello world')
    b.tf.select({ path: [0, 0], offset: 0 })
    b.tf.insertText('> ')
    await new Promise((done) => setTimeout(done, 0))
    expect(richTextToPlainText(a.children as never)).toBe('> Hello world')
    const states = [
      ...a.getOption(YjsPlugin, 'awareness').getStates().values(),
    ] as { data?: { name: string }; selection?: unknown }[]
    expect(states.map((state) => state.data?.name).sort()).toEqual(['A', 'B'])
    expect(states.every((state) => state.selection !== undefined)).toBe(true)
    a.getApi(YjsPlugin).yjs.destroy()
    b.getApi(YjsPlugin).yjs.destroy()
  })
})
