import * as Y from 'yjs'

export const SHARED_ROOT_KEY = 'content'

interface DeltaOp {
  insert: unknown
}

const deltaOf = (text: Y.XmlText): DeltaOp[] => text.toDelta() as DeltaOp[]

const isElement = (value: unknown): value is Y.XmlText =>
  value instanceof Y.XmlText

export const getSharedRoot = (doc: Y.Doc): Y.XmlText =>
  doc.get(SHARED_ROOT_KEY, Y.XmlText)

export function plainLength(text: Y.XmlText): number {
  let total = 0
  for (const op of deltaOf(text)) {
    if (typeof op.insert === 'string') total += op.insert.length
    else if (isElement(op.insert)) total += plainLength(op.insert)
  }
  return total
}

export function plainText(text: Y.XmlText): string {
  let value = ''
  for (const op of deltaOf(text)) {
    if (typeof op.insert === 'string') value += op.insert
    else if (isElement(op.insert)) value += plainText(op.insert)
  }
  return value
}

export function isTextBlock(text: Y.XmlText): boolean {
  const ops = deltaOf(text)
  return (
    !ops.some((op) => isElement(op.insert)) ||
    ops.some((op) => typeof op.insert === 'string' && op.insert.length > 0)
  )
}

export function listTextBlocks(root: Y.XmlText): Y.XmlText[] {
  const blocks: Y.XmlText[] = []
  const visit = (text: Y.XmlText) => {
    for (const op of deltaOf(text)) {
      if (!isElement(op.insert)) continue
      if (isTextBlock(op.insert)) blocks.push(op.insert)
      else visit(op.insert)
    }
  }
  visit(root)
  return blocks
}

function elementChildren(text: Y.XmlText): Y.XmlText[] {
  return deltaOf(text).flatMap((op) =>
    isElement(op.insert) ? [op.insert] : [],
  )
}

export function pathOf(root: Y.XmlText, block: Y.XmlText): number[] | null {
  const path: number[] = []
  let current: Y.XmlText = block
  while (current !== root) {
    const parent = current.parent
    if (!isElement(parent)) return null
    path.unshift(elementChildren(parent).indexOf(current))
    current = parent
  }
  return path
}

function plainOffsetAt(text: Y.XmlText, index: number): number {
  let consumed = 0
  let plain = 0
  for (const op of deltaOf(text)) {
    if (consumed >= index) return plain
    if (typeof op.insert === 'string') {
      const length = op.insert.length
      if (consumed + length >= index) return plain + (index - consumed)
      consumed += length
      plain += length
    } else if (isElement(op.insert)) {
      consumed += 1
      plain += plainLength(op.insert)
    }
  }
  return plain
}

function plainOffsetBefore(parent: Y.XmlText, child: Y.XmlText): number {
  let plain = 0
  for (const op of deltaOf(parent)) {
    if (op.insert === child) return plain
    if (typeof op.insert === 'string') plain += op.insert.length
    else if (isElement(op.insert)) plain += plainLength(op.insert)
  }
  return plain
}

export interface PlainPoint {
  offset: number
  path: number[]
}

export function relativeToPlainPoint(
  doc: Y.Doc,
  root: Y.XmlText,
  json: unknown,
): PlainPoint | null {
  if (!json || typeof json !== 'object') return null
  let absolute: ReturnType<typeof Y.createAbsolutePositionFromRelativePosition>
  try {
    absolute = Y.createAbsolutePositionFromRelativePosition(
      Y.createRelativePositionFromJSON(json),
      doc,
    )
  } catch {
    return null
  }
  if (!absolute || !isElement(absolute.type)) return null
  let type: Y.XmlText = absolute.type
  let offset = plainOffsetAt(type, absolute.index)
  while (type !== root) {
    const parent = type.parent
    if (!isElement(parent) || parent === root || !isTextBlock(parent)) break
    offset += plainOffsetBefore(parent, type)
    type = parent
  }
  const path = pathOf(root, type)
  return path ? { offset, path } : null
}

export function comparePoints(a: PlainPoint, b: PlainPoint): number {
  const length = Math.min(a.path.length, b.path.length)
  for (let index = 0; index < length; index += 1) {
    const difference = (a.path[index] ?? 0) - (b.path[index] ?? 0)
    if (difference !== 0) return difference
  }
  return a.path.length === b.path.length
    ? a.offset - b.offset
    : a.path.length - b.path.length
}
