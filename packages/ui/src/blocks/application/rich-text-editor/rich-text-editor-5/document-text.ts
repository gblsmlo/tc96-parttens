import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import type { Path, TRange } from 'platejs'

type AnyNode = { [key: string]: unknown }

export interface TextBlock {
  path: Path
  segments: { length: number; path: Path; start: number }[]
  text: string
}

const isText = (node: AnyNode): node is AnyNode & { text: string } =>
  typeof node.text === 'string'

const isRemoved = (leaf: AnyNode) =>
  Object.entries(leaf).some(
    ([key, value]) =>
      key.startsWith('suggestion_') &&
      typeof value === 'object' &&
      value !== null &&
      (value as { type?: string }).type === 'remove',
  )

function collect(
  nodes: readonly AnyNode[],
  base: Path,
  into: TextBlock[],
): void {
  nodes.forEach((node, index) => {
    if (isText(node)) return
    const path = [...base, index]
    const children = (node.children ?? []) as AnyNode[]
    if (children.length > 0 && children.every(isText)) {
      const block: TextBlock = { path, segments: [], text: '' }
      children.forEach((leaf, leafIndex) => {
        if (!isText(leaf) || isRemoved(leaf)) return
        block.segments.push({
          length: leaf.text.length,
          path: [...path, leafIndex],
          start: block.text.length,
        })
        block.text += leaf.text
      })
      into.push(block)
      return
    }
    collect(children, path, into)
  })
}

export function textBlocks(nodes: readonly unknown[]): TextBlock[] {
  const into: TextBlock[] = []
  collect(nodes as AnyNode[], [], into)
  return into
}

export function documentLines(editor: RichTextEditorInstance): string[] {
  return textBlocks(editor.children).map((block) => block.text)
}

export function passageLines(
  editor: RichTextEditorInstance,
  range: TRange,
): string[] {
  const fragment = editor.api.fragment(range) as unknown as AnyNode[]
  return textBlocks(fragment)
    .map((block) => block.text)
    .filter((line) => line.length > 0)
}
