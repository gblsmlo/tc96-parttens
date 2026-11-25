export interface RichTextLeaf {
  text: string
  [mark: string]: unknown
}

export interface RichTextElement {
  children: readonly RichTextNode[]
  type: string
}

export type RichTextNode = RichTextElement | RichTextLeaf

/**
 * Collapses every run of line breaks into one space, so a title is always a
 * single line, whatever line ending the text came with.
 */
export function flattenTitle(value: string): string {
  return value.replace(/(?:\r\n|[\r\n])+/g, ' ')
}

/**
 * Formats the "current over limit" counter shown next to a bounded field.
 */
export function formatTitleCounter(length: number, max: number): string {
  return `${length}/${max}`
}

function isLeaf(node: RichTextNode): node is RichTextLeaf {
  return typeof (node as RichTextLeaf).text === 'string'
}

function leafText(nodes: readonly RichTextNode[]): string {
  return nodes.map((node) => (isLeaf(node) ? node.text : '')).join('')
}

function collectLines(nodes: readonly RichTextNode[], lines: string[]): void {
  for (const node of nodes) {
    if (isLeaf(node)) continue
    if (node.children.every((child) => isLeaf(child))) {
      lines.push(leafText(node.children))
      continue
    }
    const inlineText = leafText(node.children)
    if (inlineText) lines.push(inlineText)
    collectLines(node.children, lines)
  }
}

/**
 * Turns a rich text document into plain text: one line per text block or list
 * item, in document order, with every mark dropped.
 *
 * @param value - the Slate-like node tree a rich text editor emits
 * @returns the lines joined by `\n`
 */
export function richTextToPlainText(value: readonly RichTextNode[]): string {
  const lines: string[] = []
  collectLines(value, lines)
  return lines.join('\n')
}

/**
 * Element types found anywhere in the tree, in document order and with
 * repeats, so a consumer can check a document against its own vocabulary.
 */
export function richTextElementTypes(value: readonly RichTextNode[]): string[] {
  return value.flatMap((node) =>
    isLeaf(node) ? [] : [node.type, ...richTextElementTypes(node.children)],
  )
}

/**
 * Whether any node in the tree carries an `id`, which an editor configured
 * without node ids must never produce.
 */
export function richTextHasNodeId(value: readonly RichTextNode[]): boolean {
  return value.some(
    (node) =>
      'id' in node || (!isLeaf(node) && richTextHasNodeId(node.children)),
  )
}

/**
 * Copy of the tree with every element `id` removed, so a document that an
 * editor tagged internally can leave it without carrying node ids.
 *
 * @param value - the Slate-like node tree, possibly carrying `id` on elements
 * @returns a new tree of the same shape, with no `id` on any element
 */
export function stripRichTextNodeIds(
  value: readonly RichTextNode[],
): RichTextNode[] {
  return value.map((node) => {
    if (isLeaf(node)) return node
    const { id: _id, ...rest } = node as RichTextElement & { id?: unknown }
    return { ...rest, children: stripRichTextNodeIds(node.children) }
  })
}

const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu

/**
 * Counts the words of a text: runs of letters or digits, where an inner
 * apostrophe, dot or hyphen keeps a word whole ("don't", "3.14", "e-mail").
 *
 * @param text - plain text
 * @returns the number of words, 0 for an empty or whitespace-only text
 */
export function countWords(text: string): number {
  return text.match(WORD_PATTERN)?.length ?? 0
}

export interface RichTextStats {
  characters: number
  charactersWithSpaces: number
  readingMinutes: number
  words: number
}

/**
 * Counts what a document footer shows: words, characters and reading time.
 *
 * @param value - the Slate-like node tree a rich text editor emits
 * @param wordsPerMinute - the reading speed behind `readingMinutes`
 * @returns `characters` without whitespace, `charactersWithSpaces` with the
 * text as written (blocks joined by one line break counted as one character)
 * and `readingMinutes` rounded up, 0 only for an empty document
 */
export function richTextStats(
  value: readonly RichTextNode[],
  wordsPerMinute = 200,
): RichTextStats {
  const text = richTextToPlainText(value)
  const words = countWords(text)
  return {
    characters: text.replace(/\s/g, '').length,
    charactersWithSpaces: text.length,
    readingMinutes: words === 0 ? 0 : Math.ceil(words / wordsPerMinute),
    words,
  }
}

const escapeHtml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const MARK_TAGS = [
  ['bold', 'strong'],
  ['italic', 'em'],
  ['underline', 'u'],
  ['strikethrough', 's'],
  ['code', 'code'],
  ['highlight', 'mark'],
] as const

const BLOCK_TAGS: Record<string, string> = {
  blockquote: 'blockquote',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  li: 'li',
  ol: 'ol',
  p: 'p',
  tr: 'tr',
  ul: 'ul',
}

function leafHtml(leaf: RichTextLeaf): string {
  let html = escapeHtml(leaf.text).replaceAll('\n', '<br>')
  for (const [mark, tag] of MARK_TAGS)
    if (leaf[mark] === true) html = `<${tag}>${html}</${tag}>`
  return html
}

function elementHtml(element: RichTextElement): string {
  const inner = richTextToHtml(element.children)
  const align = (element as { align?: unknown }).align
  const style =
    typeof align === 'string' && align !== 'left' && align !== 'start'
      ? ` style="text-align:${escapeHtml(align)}"`
      : ''
  const attributes = element as unknown as Record<string, unknown>
  switch (element.type) {
    case 'lic':
      return inner
    case 'a':
      return `<a href="${escapeHtml(String(attributes.url ?? ''))}">${inner}</a>`
    case 'mention':
      return `<span data-mention>@${escapeHtml(String(attributes.value ?? ''))}</span>`
    case 'action_item':
      return `<p><input type="checkbox" disabled${attributes.checked === true ? ' checked' : ''}> ${inner}</p>`
    case 'callout':
      return `<aside>${inner}</aside>`
    case 'code_block':
      return `<pre><code>${inner}</code></pre>`
    case 'hr':
      return '<hr>'
    case 'date':
      return `<time datetime="${escapeHtml(String(attributes.date ?? ''))}">${escapeHtml(String(attributes.date ?? ''))}</time>`
    case 'img':
      return `<img src="${escapeHtml(String(attributes.url ?? ''))}" alt="${escapeHtml(String(attributes.alt ?? ''))}">`
    case 'table':
      return `<table><tbody>${inner}</tbody></table>`
    case 'td':
      return `<td>${inner}</td>`
    case 'th':
      return `<th>${inner}</th>`
    default: {
      const tag = BLOCK_TAGS[element.type] ?? 'div'
      return `<${tag}${style}>${inner}</${tag}>`
    }
  }
}

/**
 * Serializes a rich text document to an HTML fragment. Text is escaped, marks
 * become `strong`, `em`, `u`, `s`, `code` and `mark`, a non-left `align`
 * becomes an inline `text-align`, and an unknown element type becomes a `div`.
 *
 * @param value - the Slate-like node tree a rich text editor emits
 * @returns the HTML, with no wrapper element and no whitespace between blocks
 */
export function richTextToHtml(value: readonly RichTextNode[]): string {
  return value
    .map((node) => (isLeaf(node) ? leafHtml(node) : elementHtml(node)))
    .join('')
}
