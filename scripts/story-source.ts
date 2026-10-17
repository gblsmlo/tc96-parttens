import { readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

export interface ImportBinding {
  module: string
  imported: string
  kind: 'default' | 'namespace' | 'named'
  typeOnly: boolean
}

interface IndexEntry {
  type: string
  importPath: string
  exportName?: string
}

const root = fileURLToPath(new URL('..', import.meta.url))
const storybookDir = resolve(root, 'apps/storybook')
const omittedStoryKeys = new Set(['play', 'tags', 'name', 'argTypes'])
const omittedMetaKeys = new Set(['argTypes'])
const omittedParameterKeys = new Set(['a11y'])

export function extractStory(text: string, exportName: string) {
  const source = parseTsx(text)
  const { declarations, imports, meta } = indexStatements(source)

  const story = declarations.get(exportName)
  if (!story) throw new Error(`export not found: ${exportName}`)

  const omitted = new Set<ts.Node>()
  const isA11yOnly = (expression: ts.Expression) => {
    const object = resolveObject(expression, declarations)
    return (
      object !== undefined &&
      object.properties.length > 0 &&
      object.properties.every((property) =>
        omittedParameterKeys.has(propertyName(property) ?? ''),
      )
    )
  }

  const omitFrom = (object: ts.ObjectLiteralExpression, keys: Set<string>) => {
    for (const property of object.properties) {
      const name = propertyName(property)
      if (name && keys.has(name)) omitted.add(property)
      if (name === 'parameters' && ts.isPropertyAssignment(property)) {
        omitParameters(property)
      }
    }
  }

  const omitParameters = (property: ts.PropertyAssignment) => {
    const value = unwrap(property.initializer)
    if (!ts.isObjectLiteralExpression(value)) {
      if (isA11yOnly(value)) omitted.add(property)
      return
    }
    for (const parameter of value.properties) {
      const name = propertyName(parameter)
      if (
        (name && omittedParameterKeys.has(name)) ||
        (ts.isSpreadAssignment(parameter) && isA11yOnly(parameter.expression))
      ) {
        omitted.add(parameter)
      }
    }
    if (value.properties.every((parameter) => omitted.has(parameter))) {
      omitted.add(property)
    }
  }

  const metaObject = meta && metaObjectOf(meta, declarations)
  if (metaObject) omitFrom(metaObject, omittedMetaKeys)

  const stripped = new Set<ts.Statement>()
  let included = new Set<ts.Statement>()
  let usedImports = new Set<string>()
  let pending = [story]

  while (pending.length > 0) {
    for (const statement of pending) {
      stripped.add(statement)
      for (const object of storyObjects(statement, declarations)) {
        omitFrom(object, omittedStoryKeys)
      }
    }
    included = new Set()
    usedImports = new Set()
    const queue: ts.Statement[] = [story]
    if (meta) queue.push(meta)
    while (queue.length > 0) {
      const statement = queue.pop() as ts.Statement
      if (included.has(statement)) continue
      included.add(statement)
      for (const name of references(statement, omitted)) {
        const local = declarations.get(name)
        if (local && !included.has(local)) queue.push(local)
        if (imports.has(name)) usedImports.add(name)
      }
    }
    pending = [...included].filter(
      (statement) => isStoryExport(statement) && !stripped.has(statement),
    )
  }

  const body = source.statements
    .filter((statement) => included.has(statement))
    .map((statement) => printWithout(statement, omitted, source))

  return `${printImports(usedImports, imports).join('\n')}\n\n${body.join('\n\n')}`
}

export function parseTsx(text: string) {
  return ts.createSourceFile(
    'story.tsx',
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
}

export function indexStatements(source: ts.SourceFile) {
  const declarations = new Map<string, ts.Statement>()
  const imports = new Map<string, ImportBinding>()
  let meta: ts.Statement | undefined

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      collectImports(statement, imports)
    } else if (ts.isExportAssignment(statement)) {
      meta = statement
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        for (const name of bindingNames(declaration.name)) {
          declarations.set(name, statement)
        }
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, statement)
    }
  }
  return { declarations, imports, meta }
}

export function collectImports(
  statement: ts.ImportDeclaration,
  imports: Map<string, ImportBinding>,
) {
  const module = (statement.moduleSpecifier as ts.StringLiteral).text
  const clause = statement.importClause
  if (!clause) return
  const typeOnly = clause.isTypeOnly
  if (clause.name) {
    imports.set(clause.name.text, {
      imported: clause.name.text,
      kind: 'default',
      module,
      typeOnly,
    })
  }
  const bindings = clause.namedBindings
  if (bindings && ts.isNamespaceImport(bindings)) {
    imports.set(bindings.name.text, {
      imported: bindings.name.text,
      kind: 'namespace',
      module,
      typeOnly,
    })
  }
  if (bindings && ts.isNamedImports(bindings)) {
    for (const element of bindings.elements) {
      imports.set(element.name.text, {
        imported: element.propertyName
          ? `${element.propertyName.text} as ${element.name.text}`
          : element.name.text,
        kind: 'named',
        module,
        typeOnly: typeOnly || element.isTypeOnly,
      })
    }
  }
}

export function printImports(
  used: Set<string>,
  imports: Map<string, ImportBinding>,
) {
  const modules = new Map<
    string,
    { defaultName?: string; namespace?: string; named: string[] }
  >()
  for (const name of used) {
    const binding = imports.get(name) as ImportBinding
    const group = modules.get(binding.module) ?? { named: [] }
    if (binding.kind === 'default') group.defaultName = binding.imported
    else if (binding.kind === 'namespace') group.namespace = binding.imported
    else {
      group.named.push(
        binding.typeOnly ? `type ${binding.imported}` : binding.imported,
      )
    }
    modules.set(binding.module, group)
  }
  return [...modules].map(([module, group]) => {
    const parts = [
      group.defaultName,
      group.namespace && `* as ${group.namespace}`,
      group.named.length > 0 &&
        `{ ${group.named.sort((a, b) => a.replace(/^type /, '').localeCompare(b.replace(/^type /, ''))).join(', ')} }`,
    ].filter(Boolean)
    return `import ${parts.join(', ')} from '${module}'`
  })
}

function printWithout(
  statement: ts.Statement,
  omitted: Set<ts.Node>,
  source: ts.SourceFile,
) {
  const offset = statement.getStart(source)
  let text = source.text.slice(offset, statement.getEnd())
  const ranges = [...omitted]
    .filter(
      (node) =>
        node.getStart(source) >= offset && node.getEnd() <= statement.getEnd(),
    )
    .filter(
      (node) =>
        ![...omitted].some(
          (other) =>
            other !== node &&
            other.getStart(source) <= node.getStart(source) &&
            other.getEnd() >= node.getEnd(),
        ),
    )
    .sort((a, b) => b.getStart(source) - a.getStart(source))

  for (const node of ranges) {
    const start = node.getStart(source) - offset
    let end = node.getEnd() - offset
    if (text[end] === ',') end += 1
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const ownsLine = text.slice(lineStart, start).trim() === ''
    const rest = text.slice(end)
    text = ownsLine
      ? text.slice(0, lineStart) + rest.replace(/^[ \t]*\n/, '')
      : text.slice(0, start) + rest.replace(/^[ \t]+/, '')
  }
  return text.replace(/\{\n\s*\}/g, '{}')
}

export function references(node: ts.Node, omitted: Set<ts.Node>) {
  const found = new Set<string>()
  const visit = (current: ts.Node) => {
    if (omitted.has(current)) return
    if (ts.isIdentifier(current) && !isMemberName(current)) {
      found.add(current.text)
    }
    ts.forEachChild(current, visit)
  }
  visit(node)
  return found
}

export function isMemberName(identifier: ts.Identifier) {
  const parent = identifier.parent
  return (
    ((ts.isPropertyAccessExpression(parent) ||
      ts.isPropertyAssignment(parent) ||
      ts.isJsxAttribute(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isMethodDeclaration(parent)) &&
      parent.name === identifier) ||
    false
  )
}

export function bindingNames(name: ts.BindingName): string[] {
  if (ts.isIdentifier(name)) return [name.text]
  return name.elements.flatMap((element) =>
    ts.isOmittedExpression(element) ? [] : bindingNames(element.name),
  )
}

export function propertyName(property: ts.ObjectLiteralElementLike) {
  if (!property.name) return undefined
  if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
    return property.name.text
  }
  return undefined
}

export function unwrap(node: ts.Expression): ts.Expression {
  if (
    ts.isSatisfiesExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    return unwrap(node.expression)
  }
  return node
}

export function objectOf(statement: ts.Statement) {
  if (!ts.isVariableStatement(statement)) return undefined
  const initializer = statement.declarationList.declarations[0]?.initializer
  const value = initializer && unwrap(initializer)
  return value && ts.isObjectLiteralExpression(value) ? value : undefined
}

function storyObjects(
  statement: ts.Statement,
  declarations: Map<string, ts.Statement>,
  seen = new Set<ts.Statement>(),
): ts.ObjectLiteralExpression[] {
  if (seen.has(statement)) return []
  seen.add(statement)
  const objects = new Set<ts.ObjectLiteralExpression>()
  const add = (found: ts.ObjectLiteralExpression[]) => {
    for (const object of found) objects.add(object)
  }
  if (ts.isFunctionDeclaration(statement)) add(returnedObjects(statement))
  if (ts.isVariableStatement(statement)) {
    const initializer = statement.declarationList.declarations[0]?.initializer
    const value = initializer && unwrap(initializer)
    if (value && ts.isObjectLiteralExpression(value)) objects.add(value)
    if (
      value &&
      (ts.isArrowFunction(value) || ts.isFunctionExpression(value))
    ) {
      add(returnedObjects(value))
    }
    if (
      value &&
      ts.isCallExpression(value) &&
      ts.isIdentifier(value.expression)
    ) {
      const factory = declarations.get(value.expression.text)
      if (factory) add(storyObjects(factory, declarations, seen))
    }
  }
  for (const object of [...objects]) {
    for (const property of object.properties) {
      if (!ts.isSpreadAssignment(property)) continue
      const spread = unwrap(property.expression)
      const base = ts.isIdentifier(spread) && declarations.get(spread.text)
      if (base) {
        for (const inherited of storyObjects(base, declarations, seen)) {
          objects.add(inherited)
        }
      }
    }
  }
  return [...objects]
}

export function isStoryExport(statement: ts.Statement) {
  return (
    ts.isVariableStatement(statement) &&
    (statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    ) ??
      false)
  )
}

export function returnedObjects(fn: ts.FunctionLikeDeclaration) {
  if (!fn.body) return []
  if (!ts.isBlock(fn.body)) {
    const value = unwrap(fn.body)
    return ts.isObjectLiteralExpression(value) ? [value] : []
  }
  const objects: ts.ObjectLiteralExpression[] = []
  const visit = (node: ts.Node) => {
    if (ts.isFunctionLike(node)) return
    if (ts.isReturnStatement(node) && node.expression) {
      const value = unwrap(node.expression)
      if (ts.isObjectLiteralExpression(value)) objects.push(value)
    }
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(fn.body, visit)
  return objects
}

export function resolveObject(
  expression: ts.Expression,
  declarations: Map<string, ts.Statement>,
) {
  const value = unwrap(expression)
  if (ts.isObjectLiteralExpression(value)) return value
  if (!ts.isIdentifier(value)) return undefined
  const statement = declarations.get(value.text)
  return statement && objectOf(statement)
}

export function metaObjectOf(
  meta: ts.Statement,
  declarations: Map<string, ts.Statement>,
) {
  if (!ts.isExportAssignment(meta)) return undefined
  return resolveObject(meta.expression, declarations)
}

async function main(argv: string[]) {
  const storyId = argv.find((arg) => !arg.startsWith('--'))
  if (!storyId) {
    console.error('usage: bun run story:source <story-id> [--story]')
    process.exit(1)
  }
  const url = process.env.STORYBOOK_URL ?? 'http://localhost:6006'
  const response = await fetch(`${url}/index.json`).catch(() => undefined)
  if (!response?.ok) {
    console.error(
      `Storybook index not reachable at ${url}; run bun run storybook`,
    )
    process.exit(1)
  }
  const { entries } = (await response.json()) as {
    entries: Record<string, IndexEntry>
  }
  const entry = entries[storyId]
  if (entry?.type !== 'story' || !entry.exportName) {
    console.error(`story not found: ${storyId}`)
    process.exit(1)
  }
  const file = resolve(storybookDir, entry.importPath)
  const text = await readFile(file, 'utf8')
  const { storySnippets } = await import('./story-component.ts')
  const [code] = argv.includes('--story')
    ? [extractStory(text, entry.exportName)]
    : storySnippets(text, [entry.exportName], file)
  console.log(`// ${relative(root, file)} :: ${entry.exportName}\n${code}`)
}

if (import.meta.main) await main(process.argv.slice(2))
