import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type { SuggestionAuthor, SuggestionChange } from './types'

export interface SuggestionData {
  createdAt: number
  id: string
  isLineBreak?: boolean
  type: 'insert' | 'remove' | 'update'
  userId: string
}

type AnyNode = { [key: string]: unknown }

const isLeaf = (node: AnyNode): node is AnyNode & { text: string } =>
  typeof node.text === 'string'

const isSuggestionData = (value: unknown): value is SuggestionData =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as SuggestionData).id === 'string' &&
  typeof (value as SuggestionData).type === 'string'

/**
 * Reads the suggestion a text leaf carries, from its `suggestion_<id>` key.
 *
 * @param leaf - a Slate text node
 * @returns the data of the first suggestion on the leaf, or `undefined`
 */
export function leafSuggestion(leaf: AnyNode): SuggestionData | undefined {
  for (const key of Object.keys(leaf)) {
    if (!key.startsWith('suggestion_')) continue
    const data = leaf[key]
    if (isSuggestionData(data)) return data
  }
  return undefined
}

/**
 * Reads the suggestion a block element carries in its `suggestion` object.
 *
 * @param element - a Slate element
 * @returns the data, or `undefined` for a plain element or a line break marker
 */
export function blockSuggestion(element: AnyNode): SuggestionData | undefined {
  const data = element.suggestion
  return isSuggestionData(data) && !data.isLineBreak ? data : undefined
}

function textOf(node: AnyNode): string {
  if (isLeaf(node)) return node.text
  const children = (node.children ?? []) as AnyNode[]
  return children.map(textOf).join('')
}

interface Accumulator {
  after: string[]
  before: string[]
  createdAt: number
  userId: string
}

/**
 * Lists the changes of a document in reading order. Leaves that share a
 * suggestion id become one change: a removal plus an insertion is a replace.
 *
 * @param value - the editor document, with or without suggestion marks
 * @param authors - known people; an unknown `userId` becomes `{ id, name: id }`
 * @returns one entry per suggestion id, formatting-only updates left out
 */
export function collectSuggestions(
  value: RichTextValue,
  authors: readonly SuggestionAuthor[] = [],
): SuggestionChange[] {
  const found = new Map<string, Accumulator>()
  const add = (data: SuggestionData, text: string) => {
    if (data.type === 'update') return
    const entry = found.get(data.id) ?? {
      after: [],
      before: [],
      createdAt: data.createdAt,
      userId: data.userId,
    }
    entry.createdAt = Math.min(entry.createdAt, data.createdAt)
    const target = data.type === 'insert' ? entry.after : entry.before
    target.push(text)
    found.set(data.id, entry)
  }
  const walk = (nodes: readonly AnyNode[]) => {
    for (const node of nodes) {
      if (isLeaf(node)) {
        const data = leafSuggestion(node)
        if (data) add(data, node.text)
        continue
      }
      const data = blockSuggestion(node)
      if (data) {
        add(data, textOf(node))
        continue
      }
      walk((node.children ?? []) as AnyNode[])
    }
  }
  walk(value as unknown as AnyNode[])
  return [...found].map(([id, entry]) => {
    const before = entry.before.join('')
    const after = entry.after.join('')
    return {
      after,
      author: authors.find((author) => author.id === entry.userId) ?? {
        id: entry.userId,
        name: entry.userId,
      },
      before,
      createdAt: new Date(entry.createdAt),
      id,
      kind:
        entry.before.length > 0 && entry.after.length > 0
          ? 'replace'
          : entry.before.length > 0
            ? 'delete'
            : 'insert',
    }
  })
}
