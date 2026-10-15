import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import {
  extractStory,
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

const root = fileURLToPath(new URL('..', import.meta.url))
const biome = resolve(root, 'node_modules/.bin/biome')
const separator = '// @@story-component@@'
const identifier = /^[A-Za-z_$][\w$]*$/
const jsxAttribute = /^[A-Za-z_$][\w$-]*$/

export function storyComponent(text: string, exportName: string) {
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
  const valueText = (expression: ts.Expression) => {
    const text = expression.getText(source)
    return usesStorybookFn ? text.replace(/\bfn\(\)/g, '() => {}') : text
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
          edits.push([
            node.getStart(source),
            node.getEnd(),
            expressionOf(node.name.text),
          ])
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
      const inlined = inlineArgs(renderer, args ?? [])
      const declaration =
        parameter && args && inlined === undefined
          ? `const ${parameter.name.getText(source)} = ${argsLiteral(args)}\n`
          : ''
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
        : `{${valueText(childValue)}}`)
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

  const locals = generated.statements
    .filter((statement) => included.has(statement))
    .map((statement) => statement.getText(generated))
  return [
    printImports(usedImports, generatedIndex.imports).join('\n'),
    ...locals,
    component,
  ]
    .filter(Boolean)
    .join('\n\n')
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

export function storySnippets(text: string, names: string[]) {
  const components = names.map((name) => storyComponent(text, name))
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
