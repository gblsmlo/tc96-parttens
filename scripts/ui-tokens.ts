import ts from 'typescript'

export type TokenBlock = { heading: string; classes: string[] }

const tableRow = /^\| `[^`]+` \| `(.+?)` \|/

export function parseTokenBlocks(markdown: string): TokenBlock[] {
  const blocks: TokenBlock[] = []
  let inParts = false
  let current: TokenBlock | undefined
  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) {
      inParts = line === '## Parts'
      current = undefined
      continue
    }
    if (!inParts) continue
    const heading = line.match(/^#{3,4} (.+)$/)
    if (heading?.[1]) {
      current = { classes: [], heading: heading[1] }
      blocks.push(current)
      continue
    }
    const row = line.match(tableRow)
    if (row?.[1] && current) current.classes.push(...row[1].split(/\s+/))
  }
  return blocks.filter((block) => block.classes.length > 0)
}

function isClassValue(node: ts.Node): boolean {
  let child: ts.Node = node
  let parent = node.parent
  while (parent) {
    if (ts.isJsxAttribute(parent)) return parent.name.getText() === 'className'
    if (ts.isCallExpression(parent)) {
      const callee = parent.expression.getText()
      return (
        (callee === 'cn' || callee === 'cva') &&
        parent.arguments.some((argument) => argument === child)
      )
    }
    if (ts.isConditionalExpression(parent) && parent.condition === child)
      return false
    if (
      ts.isPropertyAssignment(parent) &&
      parent.name.getText() === 'defaultVariants'
    )
      return false
    if (
      !ts.isConditionalExpression(parent) &&
      !ts.isPropertyAssignment(parent) &&
      !ts.isObjectLiteralExpression(parent) &&
      !ts.isParenthesizedExpression(parent) &&
      !ts.isJsxExpression(parent)
    )
      return false
    child = parent
    parent = parent.parent
  }
  return false
}

export function sourceClassStrings(source: string): string[] {
  const file = ts.createSourceFile(
    'component.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const strings: string[] = []
  const visit = (node: ts.Node) => {
    const isKey =
      node.parent !== undefined &&
      ts.isPropertyAssignment(node.parent) &&
      node.parent.name === node
    if (
      ts.isStringLiteral(node) &&
      node.text.trim() &&
      !isKey &&
      isClassValue(node)
    )
      strings.push(node.text)
    ts.forEachChild(node, visit)
  }
  visit(file)
  return strings
}

const sorted = (classes: string[]) => [...classes].sort().join(' ')

export function compareTokens(markdown: string, source: string): string[] {
  const blocks = parseTokenBlocks(markdown)
  const strings = sourceClassStrings(source)
  const sourceKeys = new Set(strings.map((value) => sorted(value.split(/\s+/))))
  const blockKeys = new Set(blocks.map((block) => sorted(block.classes)))
  const problems: string[] = []
  for (const block of blocks) {
    if (new Set(block.classes).size !== block.classes.length)
      problems.push(`${block.heading}: a class appears twice`)
    if (!sourceKeys.has(sorted(block.classes)))
      problems.push(`${block.heading}: no class string in the source matches`)
  }
  for (const value of strings)
    if (!blockKeys.has(sorted(value.split(/\s+/))))
      problems.push(`source "${value}": no TOKENS.md block matches`)
  return problems
}
