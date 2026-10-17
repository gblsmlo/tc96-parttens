import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import {
  bindingNames,
  extractStory,
  type ImportBinding,
  indexStatements,
  isMemberName,
  isStoryExport,
  objectOf,
  parseTsx,
  printImports,
  propertyName,
  references,
  returnedObjects,
  unwrap,
} from './story-source.ts'

type Props = Map<string, ts.Expression>
type Arg = { key?: string; value: ts.Expression }
type Read = (path: string) => string
type Module = ReturnType<typeof indexStatements> & {
  path: string
  source: ts.SourceFile
  included: Set<ts.Statement>
  dependencies: Set<Module>
}

const root = fileURLToPath(new URL('..', import.meta.url))
const biome = resolve(root, 'node_modules/.bin/biome')
const separator = '// @@story-component@@'
const identifier = /^[A-Za-z_$][\w$]*$/
const jsxAttribute = /^[A-Za-z_$][\w$-]*$/
const storybookModule = /^(@storybook\/|storybook(\/|$))/
const moduleExtensions = ['', '.tsx', '.ts', '/index.tsx', '/index.ts']
export const inlineLimit = 150

const readText: Read = (path) => readFileSync(path, 'utf8')

export function storyComponent(
  text: string,
  exportName: string,
  file?: string,
  read: Read = readText,
) {
  const source = parseTsx(text)
  const { declarations, imports, meta } = indexStatements(source)
  const story = declarations.get(exportName)
  if (!story) throw new Error(`export not found: ${exportName}`)

  const metaObject =
    meta && ts.isExportAssignment(meta)
      ? resolveLocalObject(meta.expression)
      : undefined
  const metaName =
    meta && ts.isExportAssignment(meta) && ts.isIdentifier(meta.expression)
      ? meta.expression.text
      : undefined

  function resolveLocalObject(expression: ts.Expression) {
    const value = unwrap(expression)
    if (ts.isObjectLiteralExpression(value)) return value
    if (!ts.isIdentifier(value)) return undefined
    const statement = declarations.get(value.text)
    return statement && objectOf(statement)
  }

  function propsOf(object: ts.ObjectLiteralExpression): Props | undefined {
    const props: Props = new Map()
    for (const property of object.properties) {
      if (ts.isSpreadAssignment(property)) {
        const base = propsOfReference(property.expression)
        if (!base) return undefined
        for (const [key, value] of base) props.set(key, value)
      } else if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property)
        if (!name) return undefined
        props.set(name, property.initializer)
      } else if (ts.isShorthandPropertyAssignment(property)) {
        props.set(property.name.text, property.name)
      } else {
        return undefined
      }
    }
    return props
  }

  function propsOfReference(expression: ts.Expression): Props | undefined {
    const value = unwrap(expression)
    if (ts.isIdentifier(value) && value.text === metaName) {
      return metaObject ? propsOf(metaObject) : undefined
    }
    const object = resolveLocalObject(value)
    return object ? propsOf(object) : undefined
  }

  function resolveMember(expression: ts.Expression): ts.Expression {
    const value = unwrap(expression)
    if (ts.isPropertyAccessExpression(value)) {
      const owner = propsOfReference(value.expression)
      const member = owner?.get(value.name.text)
      if (member) return resolveMember(member)
    }
    if (ts.isIdentifier(value)) {
      const statement = declarations.get(value.text)
      const initializer =
        statement &&
        ts.isVariableStatement(statement) &&
        statement.declarationList.declarations[0]?.initializer
      const local = initializer && unwrap(initializer)
      if (
        local &&
        (ts.isArrowFunction(local) || ts.isFunctionExpression(local))
      ) {
        return local
      }
    }
    return value
  }

  function argsOf(expression: ts.Expression | undefined): Arg[] | undefined {
    if (!expression) return []
    const value = resolveMember(expression)
    const object = ts.isObjectLiteralExpression(value)
      ? value
      : resolveLocalObject(value)
    if (!object) return undefined
    const args: Arg[] = []
    for (const property of object.properties) {
      if (ts.isSpreadAssignment(property)) {
        const base = argsOf(property.expression)
        args.push(...(base ?? [{ value: property.expression }]))
      } else if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property)
        if (!name) return undefined
        args.push({ key: name, value: property.initializer })
      } else if (ts.isShorthandPropertyAssignment(property)) {
        args.push({ key: property.name.text, value: property.name })
      } else {
        return undefined
      }
    }
    return args
  }

  function merged(...lists: Arg[][]) {
    const args: Arg[] = []
    for (const arg of lists.flat()) {
      const previous = args.findIndex(
        (entry) => entry.key && entry.key === arg.key,
      )
      if (previous >= 0) args.splice(previous, 1)
      args.push(arg)
    }
    return args
  }

  function factoryProps(statement: ts.Statement) {
    const initializer = ts.isVariableStatement(statement)
      ? statement.declarationList.declarations[0]?.initializer
      : undefined
    const call = initializer && unwrap(initializer)
    if (
      !call ||
      !ts.isCallExpression(call) ||
      !ts.isIdentifier(call.expression)
    ) {
      return undefined
    }
    const factory = declarations.get(call.expression.text)
    if (!factory || !ts.isFunctionDeclaration(factory)) return undefined
    const [returned, ...rest] = returnedObjects(factory)
    const props = returned && rest.length === 0 && propsOf(returned)
    return props &&
      !['args', 'component', 'render'].some((key) => props.has(key))
      ? props
      : undefined
  }

  const storyObject = objectOf(story)
  const storyProps = storyObject ? propsOf(storyObject) : factoryProps(story)
  const metaProps = metaObject ? propsOf(metaObject) : new Map()
  if (!storyProps || !metaProps) return undefined

  const metaArgs = argsOf(metaProps.get('args'))
  const storyArgs = argsOf(storyProps.get('args'))
  const args = metaArgs && storyArgs && merged(metaArgs, storyArgs)

  const usesStorybookFn = imports.get('fn')?.module === 'storybook/test'
  const isFnCall = (node: ts.Node) =>
    usesStorybookFn &&
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'fn'
  const hoisted: string[] = []
  const valueText = (expression: ts.Node): string => {
    const text = expression.getText(source)
    if (!usesStorybookFn) return text
    const offset = expression.getStart(source)
    const edits: [number, number, string][] = []
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'fn'
      ) {
        const [implementation] = node.arguments
        edits.push([
          node.getStart(source) - offset,
          node.getEnd() - offset,
          implementation ? valueText(implementation) : '() => {}',
        ])
        return
      }
      ts.forEachChild(node, visit)
    }
    visit(expression)
    return edits
      .sort((a, b) => b[0] - a[0])
      .reduce(
        (result, [start, end, replacement]) =>
          result.slice(0, start) + replacement + result.slice(end),
        text,
      )
  }
  const argsLiteral = (args: Arg[]) =>
    `{ ${args
      .map(({ key, value }) =>
        key === undefined
          ? `...${valueText(value)}`
          : `${identifier.test(key) ? key : `'${key}'`}: ${valueText(value)}`,
      )
      .join(', ')} }`

  const attributesOf = (args: Arg[]) => {
    const attributes: string[] = []
    for (const { key, value: raw } of args) {
      const value = unwrap(raw)
      if (key === undefined) {
        attributes.push(`{...${valueText(value)}}`)
      } else if (!jsxAttribute.test(key)) {
        return undefined
      } else if (value.kind === ts.SyntaxKind.TrueKeyword) {
        attributes.push(key)
      } else if (ts.isStringLiteral(value) && !/["\\\n]/.test(value.text)) {
        attributes.push(`${key}="${value.text}"`)
      } else {
        attributes.push(`${key}={${valueText(value)}}`)
      }
    }
    return attributes
  }

  const inlineArgs = (
    renderer: ts.ArrowFunction | ts.FunctionExpression,
    args: Arg[],
  ) => {
    const [parameter] = renderer.parameters
    const body = renderer.body
    const offset = body.getStart(source)
    const text = body.getText(source)
    if (!parameter) return text
    if (args.some(({ key }) => key === undefined)) return undefined
    const values = new Map(args.map(({ key, value }) => [key, value]))
    const expressionOf = (key: string) => {
      const value = values.get(key)
      if (!value) return 'undefined'
      return isPrimary(unwrap(value))
        ? valueText(value)
        : `(${valueText(value)})`
    }
    const childOf = (node: ts.Node, value: ts.Expression | undefined) => {
      const jsx = value && unwrap(value)
      if (
        !jsx ||
        !ts.isJsxExpression(node.parent) ||
        !(
          ts.isJsxElement(node.parent.parent) ||
          ts.isJsxFragment(node.parent.parent)
        )
      ) {
        return undefined
      }
      return jsxChildren(jsx, valueText)
    }
    const edits: [number, number, string][] = []
    let inlined = true
    const name = parameter.name

    if (ts.isIdentifier(name)) {
      const visit = (node: ts.Node) => {
        if (
          ts.isJsxSpreadAttribute(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === name.text
        ) {
          const siblings = node.parent.properties
          const index = siblings.indexOf(node)
          const explicit = (from: number, to: number) =>
            new Set(
              siblings
                .slice(from, to)
                .filter(ts.isJsxAttribute)
                .map((attribute) => attribute.name.getText(source)),
            )
          const before = explicit(0, index)
          const after = explicit(index + 1, siblings.length)
          const opening = node.parent.parent
          if (
            ts.isJsxOpeningElement(opening) &&
            ts.isJsxElement(opening.parent) &&
            opening.parent.children.some(
              (child) => !ts.isJsxText(child) || child.text.trim() !== '',
            )
          ) {
            after.add('children')
          }
          const attributes = args.some(({ key }) => key && before.has(key))
            ? undefined
            : attributesOf(args.filter(({ key }) => !key || !after.has(key)))
          if (attributes) {
            edits.push([
              node.getStart(source),
              node.getEnd(),
              attributes.join(' '),
            ])
          } else {
            inlined = false
          }
          return
        }
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === name.text
        ) {
          const child = childOf(node, values.get(node.name.text))
          edits.push(
            child
              ? [node.parent.getStart(source), node.parent.getEnd(), child]
              : [
                  node.getStart(source),
                  node.getEnd(),
                  expressionOf(node.name.text),
                ],
          )
          return
        }
        if (
          ts.isIdentifier(node) &&
          node.text === name.text &&
          !isMemberName(node)
        ) {
          inlined = false
          return
        }
        ts.forEachChild(node, visit)
      }
      visit(body)
    } else if (ts.isObjectBindingPattern(name)) {
      const bound = new Map<string, string>()
      for (const element of name.elements) {
        if (element.dotDotDotToken || !ts.isIdentifier(element.name)) {
          return undefined
        }
        const key = element.propertyName?.getText(source) ?? element.name.text
        const value = values.get(key)
        if (value && isFnCall(unwrap(value))) {
          hoisted.push(`const ${element.name.text} = ${valueText(value)}`)
          continue
        }
        bound.set(
          element.name.text,
          values.has(key) || !element.initializer
            ? expressionOf(key)
            : `(${element.initializer.getText(source)})`,
        )
      }
      const visit = (node: ts.Node) => {
        const replacement = ts.isIdentifier(node) && bound.get(node.text)
        if (
          replacement &&
          !isMemberName(node as ts.Identifier) &&
          !isBinding(node)
        ) {
          edits.push([
            node.getStart(source),
            node.getEnd(),
            ts.isShorthandPropertyAssignment(node.parent)
              ? `${(node as ts.Identifier).text}: ${replacement}`
              : replacement,
          ])
        }
        ts.forEachChild(node, visit)
      }
      visit(body)
    } else {
      return undefined
    }
    if (!inlined) return undefined

    let result = text
    for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) {
      result =
        result.slice(0, start - offset) +
        replacement +
        result.slice(end - offset)
    }
    return result
  }

  const render = storyProps.get('render') ?? metaProps.get('render')
  let body: string | undefined
  if (render) {
    const renderer = resolveMember(render)
    if (ts.isArrowFunction(renderer) || ts.isFunctionExpression(renderer)) {
      if (renderer.parameters.length > 1) return undefined
      const [parameter] = renderer.parameters
      if (parameter && !args) return undefined
      hoisted.length = 0
      const inlined = inlineArgs(renderer, args ?? [])
      const declaration =
        parameter && args && inlined === undefined
          ? `const ${parameter.name.getText(source)} = ${argsLiteral(args)}\n`
          : hoisted.map((line) => `${line}\n`).join('')
      const code = inlined ?? renderer.body.getText(source)
      body = ts.isBlock(renderer.body)
        ? `${declaration}${code.slice(1, -1)}`
        : `${declaration}return (${code})`
    } else if (ts.isIdentifier(renderer) && args) {
      body = `return ${renderer.text}(${argsLiteral(args)})`
    } else {
      return undefined
    }
  } else {
    const component = storyProps.get('component') ?? metaProps.get('component')
    if (!args || !component || !ts.isIdentifier(unwrap(component))) {
      return undefined
    }
    const name = unwrap(component).getText(source)
    const children = args.find(({ key }) => key === 'children')
    const attributes = attributesOf(args.filter((arg) => arg !== children))
    if (!attributes) return undefined
    const childValue = children && unwrap(children.value)
    const content =
      childValue &&
      (ts.isStringLiteral(childValue) && /^[^{}<>]*$/.test(childValue.text)
        ? childValue.text
        : (jsxChildren(childValue, valueText) ?? `{${valueText(childValue)}}`))
    const open = [name, ...attributes].join(' ')
    body =
      content === undefined
        ? `return <${open} />`
        : `return <${open}>${content}</${name}>`
  }

  const component = `export default function ${exportName}() {\n${body}\n}`

  const generated = parseTsx(`${text}\n${component}\n`)
  const seed = generated.statements.at(-1) as ts.Statement
  const generatedIndex = indexStatements(generated)
  const included = new Set<ts.Statement>()
  const usedImports = new Set<string>()
  const queue = [...references(seed, new Set())]
  const seen = new Set<string>()
  while (queue.length > 0) {
    const name = queue.pop() as string
    if (seen.has(name)) continue
    seen.add(name)
    if (generatedIndex.imports.has(name)) usedImports.add(name)
    const local = generatedIndex.declarations.get(name)
    if (!local || local === seed || included.has(local)) continue
    if (isStoryExport(local) || name === metaName) return undefined
    included.add(local)
    queue.push(...references(local, new Set()))
  }

  const locals = generated.statements.filter((statement) =>
    included.has(statement),
  )
  const inlined =
    file &&
    inlineModules(file, read, usedImports, generatedIndex.imports, [
      exportName,
      ...locals.flatMap(declaredNames),
    ])
  const bindings = inlined ? inlined.imports : generatedIndex.imports
  const used = inlined ? new Set(inlined.imports.keys()) : usedImports
  return [
    printImports(sortedImports(used, bindings), bindings).join('\n'),
    ...(inlined ? inlined.statements : []),
    ...locals.map((statement) => statement.getText(generated)),
    component,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function jsxChildren(
  node: ts.Expression,
  text: (expression: ts.Expression) => string,
) {
  if (ts.isJsxFragment(node)) return text(node).slice(2, -3)
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    return text(node)
  }
  return undefined
}

function isPrimary(node: ts.Expression) {
  return (
    ts.isIdentifier(node) ||
    ts.isLiteralExpression(node) ||
    ts.isTemplateExpression(node) ||
    ts.isCallExpression(node) ||
    ts.isNewExpression(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isElementAccessExpression(node) ||
    ts.isArrayLiteralExpression(node) ||
    ts.isObjectLiteralExpression(node) ||
    ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword
  )
}

function isBinding(node: ts.Node) {
  const parent = node.parent
  return (
    (ts.isVariableDeclaration(parent) ||
      ts.isParameter(parent) ||
      ts.isBindingElement(parent) ||
      ts.isFunctionDeclaration(parent)) &&
    parent.name === node
  )
}

function sortedImports(used: Set<string>, imports: Map<string, ImportBinding>) {
  const rank = (module: string) => {
    if (module.startsWith('.')) return 2
    return module.startsWith('@tc96/') ? 1 : 0
  }
  const moduleOf = (name: string) => (imports.get(name) as ImportBinding).module
  return new Set(
    [...used].sort(
      (a, b) =>
        rank(moduleOf(a)) - rank(moduleOf(b)) ||
        moduleOf(a).localeCompare(moduleOf(b)),
    ),
  )
}

function inlineModules(
  file: string,
  read: Read,
  used: Set<string>,
  imports: Map<string, ImportBinding>,
  storyNames: string[],
) {
  const external = new Map<string, ImportBinding>()
  const owners = new Map(storyNames.map((name) => [name, file]))
  const modules = new Map<string, Module>()

  const addExternal = (name: string, binding: ImportBinding) => {
    const current = external.get(name)
    if (owners.has(name) || storybookModule.test(binding.module)) return false
    if (
      current &&
      (current.module !== binding.module ||
        current.imported !== binding.imported ||
        current.kind !== binding.kind)
    ) {
      return false
    }
    external.set(name, {
      ...binding,
      typeOnly: binding.typeOnly && (current?.typeOnly ?? true),
    })
    return true
  }

  const load = (from: string, specifier: string) => {
    const base = resolve(dirname(from), specifier)
    const path = moduleExtensions
      .map((extension) => `${base}${extension}`)
      .find(
        (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
      )
    if (!path) return undefined
    const cached = modules.get(path)
    if (cached) return cached
    const source = parseTsx(read(path))
    const module: Module = {
      ...indexStatements(source),
      dependencies: new Set(),
      included: new Set(),
      path,
      source,
    }
    modules.set(path, module)
    return module
  }

  const take = (
    from: string,
    binding: ImportBinding,
    name: string,
  ): Module | undefined => {
    if (binding.kind !== 'named' || binding.imported !== name) return undefined
    const module = load(from, binding.module)
    const statement = module?.declarations.get(name)
    if (!module || !statement || !isExported(statement)) return undefined
    return include(module, statement) ? module : undefined
  }

  const include = (module: Module, statement: ts.Statement): boolean => {
    if (module.included.has(statement)) return true
    module.included.add(statement)
    for (const name of declaredNames(statement)) {
      const owner = owners.get(name)
      if ((owner && owner !== module.path) || external.has(name)) return false
      owners.set(name, module.path)
    }
    for (const name of references(statement, new Set())) {
      const local = module.declarations.get(name)
      if (local) {
        if (!include(module, local)) return false
        continue
      }
      const binding = module.imports.get(name)
      if (!binding) continue
      if (binding.module.startsWith('.')) {
        const dependency = take(module.path, binding, name)
        if (!dependency) return false
        module.dependencies.add(dependency)
      } else if (!addExternal(name, binding)) {
        return false
      }
    }
    return true
  }

  const roots = new Set<Module>()
  for (const name of used) {
    const binding = imports.get(name) as ImportBinding
    if (!binding.module.startsWith('.')) {
      if (!addExternal(name, binding)) return undefined
    }
  }
  for (const name of used) {
    const binding = imports.get(name) as ImportBinding
    if (!binding.module.startsWith('.')) continue
    const module = take(file, binding, name)
    if (!module) return undefined
    roots.add(module)
  }
  if (roots.size === 0) return undefined

  const ordered: Module[] = []
  const visited = new Set<Module>()
  const visit = (module: Module) => {
    if (visited.has(module)) return
    visited.add(module)
    for (const dependency of module.dependencies) visit(dependency)
    ordered.push(module)
  }
  for (const module of roots) visit(module)

  const statements = ordered.flatMap((module) =>
    module.source.statements
      .filter((statement) => module.included.has(statement))
      .map((statement) =>
        statement.getText(module.source).replace(/^export\s+/, ''),
      ),
  )
  const lines = statements.reduce(
    (total, statement) => total + statement.split('\n').length,
    0,
  )
  if (lines > inlineLimit) return undefined
  return { imports: external, statements }
}

function declaredNames(statement: ts.Statement) {
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap((declaration) =>
      bindingNames(declaration.name),
    )
  }
  const name = (statement as { name?: ts.Node }).name
  return name && ts.isIdentifier(name) ? [name.text] : []
}

function isExported(statement: ts.Statement) {
  return (
    ts.canHaveModifiers(statement) &&
    (ts
      .getModifiers(statement)
      ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ??
      false)
  )
}

export function storySnippets(
  text: string,
  names: string[],
  file?: string,
  read?: Read,
) {
  const components = names.map((name) => storyComponent(text, name, file, read))
  const formatted = formatTsx(
    components.filter((component) => component !== undefined),
  )
  let next = 0
  return names.map(
    (name, index) =>
      (components[index] !== undefined && formatted[next++]) ||
      extractStory(text, name),
  )
}

export function formatTsx(sources: string[]): (string | undefined)[] {
  if (sources.length === 0) return []
  const joined = sources.join(`\n${separator}\n`)
  const formatted = format(joined)
  const parts = formatted?.split(`${separator}\n`)
  if (parts && parts.length === sources.length) {
    return parts.map((part) => `${part.trim()}\n`)
  }
  return sources.length === 1 ? [formatted] : sources.map((s) => format(s))
}

function format(code: string) {
  const result = spawnSync(biome, ['format', '--stdin-file-path=story.tsx'], {
    cwd: root,
    encoding: 'utf8',
    input: code,
  })
  return result.status === 0 ? result.stdout : undefined
}
