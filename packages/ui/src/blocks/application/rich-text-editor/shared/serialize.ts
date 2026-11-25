import {
  type RichTextNode,
  richTextToHtml,
  richTextToPlainText,
} from '@tc96/ui/helpers/rich-text'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { blockSuggestion, leafSuggestion } from './collect'
import type { SuggestionAuthor } from './types'

type AnyNode = { [key: string]: unknown }

const isLeaf = (node: AnyNode): node is AnyNode & { text: string } =>
  typeof node.text === 'string'

const stripSuggestionKeys = (leaf: AnyNode): AnyNode =>
  Object.fromEntries(
    Object.entries(leaf).filter(
      ([key]) => key !== 'suggestion' && !key.startsWith('suggestion_'),
    ),
  )

function project(nodes: readonly AnyNode[], hide: 'insert' | 'remove') {
  const result: AnyNode[] = []
  for (const node of nodes) {
    if (isLeaf(node)) {
      const data = leafSuggestion(node)
      if (data?.type === hide) continue
      result.push(data ? stripSuggestionKeys(node) : node)
      continue
    }
    if (blockSuggestion(node)?.type === hide) continue
    const children = project((node.children ?? []) as AnyNode[], hide)
    const { suggestion: _suggestion, ...rest } = node
    result.push({
      ...rest,
      children: children.length > 0 ? children : [{ text: '' }],
    })
  }
  return result
}

/**
 * Projects a redlined document onto one of its clean versions.
 *
 * @param value - the editor document
 * @param version - `final` keeps insertions and drops deletions, `original` the reverse
 * @returns a plain document with no suggestion marks
 */
export function projectSuggestions(
  value: RichTextValue,
  version: 'final' | 'original',
): RichTextValue {
  return project(
    value as unknown as AnyNode[],
    version === 'final' ? 'remove' : 'insert',
  ) as unknown as RichTextValue
}

/**
 * The text of the document with every change accepted, one line per block.
 */
export function finalText(value: RichTextValue): string {
  return richTextToPlainText(
    projectSuggestions(value, 'final') as unknown as RichTextNode[],
  )
}

/**
 * The text of the document with every change rejected, one line per block.
 */
export function originalText(value: RichTextValue): string {
  return richTextToPlainText(
    projectSuggestions(value, 'original') as unknown as RichTextNode[],
  )
}

const escapeAttribute = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

interface Tag {
  author: string
  createdAt: number
  name: 'del' | 'ins'
}

/**
 * Serializes the document as an HTML fragment where insertions are `<ins>` and
 * deletions are `<del>`, each with `data-author` and `datetime`.
 *
 * @param value - the editor document
 * @param authors - known people, to turn a `userId` into a name
 */
export function suggestionsToHtml(
  value: RichTextValue,
  authors: readonly SuggestionAuthor[] = [],
): string {
  const tags: Tag[] = []
  const mark = (nodes: readonly AnyNode[]): AnyNode[] =>
    nodes.map((node) => {
      if (isLeaf(node)) {
        const data = leafSuggestion(node)
        if (!data || data.type === 'update' || node.text === '')
          return stripSuggestionKeys(node)
        const name = data.type === 'insert' ? 'ins' : 'del'
        tags.push({
          author:
            authors.find((author) => author.id === data.userId)?.name ??
            data.userId,
          createdAt: data.createdAt,
          name,
        })
        const close = name === 'ins' ? '\uE002' : '\uE003'
        return {
          ...stripSuggestionKeys(node),
          text: `\uE000${tags.length - 1}\uE001${node.text}${close}`,
        }
      }
      return { ...node, children: mark((node.children ?? []) as AnyNode[]) }
    })
  const html = richTextToHtml(
    mark(value as unknown as AnyNode[]) as unknown as RichTextNode[],
  )
  return html
    .replace(/\uE000(\d+)\uE001/g, (_match, index: string) => {
      const tag = tags[Number(index)]
      if (!tag) return ''
      const datetime = new Date(tag.createdAt).toISOString()
      return `<${tag.name} data-author="${escapeAttribute(tag.author)}" datetime="${datetime}">`
    })
    .replaceAll('\uE002', '</ins>')
    .replaceAll('\uE003', '</del>')
}
