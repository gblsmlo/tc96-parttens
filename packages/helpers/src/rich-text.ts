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
