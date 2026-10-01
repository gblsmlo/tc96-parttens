import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { files } from './files'

/**
 * Regra de sobrescrita dos patterns sobre componentes COSS: vale layout,
 * dimensao, tipografia, neutralizar (transparent, none, 0), mostrar e esconder
 * (opacity 0 e 100) e o formato do Skeleton. Cor, raio, borda e sombra novos
 * ficam com o tema do consumidor. Excecao so com motivo, em
 * scripts/override-exceptions.json.
 *
 * A regra vale para componentes COSS com estilo. Partes sem estilo (os
 * primitivos do base-ui, MenuTrigger, MenuRadioGroup) nao tem o que
 * sobrescrever: estiliza-las e como estilizar um elemento do proprio pattern.
 */
export interface OverrideException {
  file: string
  component: string
  className: string
  reason: string
}

const roots = ['packages/parttens/src', 'packages/elements/src']
const exceptionsPath = 'scripts/override-exceptions.json'

const neutral =
  /^(?:(?:bg|border|ring|outline|divide|text|fill|stroke|decoration|caret|accent)-transparent|(?:shadow|rounded|bg|ring)-none|border-(?:0|none)|ring-0|outline-(?:none|hidden|0)|opacity-(?:0|100))$/
const textNotColor =
  /^text-(?:xs|sm|base|lg|xl|\d+xl|left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip|\[\d[^\]]*\]|\(length:[^)]*\))$/
const forbidden: [string, RegExp][] = [
  ['raio', /^rounded(?:-|$)/],
  ['sombra', /^(?:inset-)?shadow(?:-|$)/],
  ['borda', /^(?:border|divide|outline|(?:inset-)?ring)(?:-|$)/],
  ['opacidade', /^opacity-/],
  [
    'cor',
    /^(?:bg|text|fill|stroke|from|via|to|decoration|caret|accent|placeholder)-/,
  ],
]

/** Separa variantes (hover:, [&_svg]:) do utilitario, fora de colchetes. */
function utilityOf(token: string) {
  let depth = 0
  let start = 0
  for (const [index, char] of [...token].entries()) {
    if (char === '[' || char === '(') depth += 1
    else if (char === ']' || char === ')') depth -= 1
    else if (char === ':' && depth === 0) start = index + 1
  }
  return token.slice(start).replace(/^!|!$/g, '').replace(/^-/, '')
}

export function classify(component: string, token: string) {
  if (token.startsWith('coss:')) return 'estilo de outro componente'
  const utility = utilityOf(token)
  if (neutral.test(utility) || textNotColor.test(utility)) return undefined
  const category = forbidden.find(([, pattern]) => pattern.test(utility))?.[0]
  if (category === 'raio' && component === 'Skeleton') return undefined
  return category
}

const styledCache = new Map<string, Set<string>>()

/** Exports do item COSS que aplicam classes proprias. */
async function styledExports(uiRoot: string, item: string) {
  const cached = styledCache.get(item)
  if (cached) return cached
  const styled = new Set<string>()
  const path = `${uiRoot}/${item}.tsx`
  if (existsSync(path)) {
    const ast = ts.createSourceFile(
      path,
      await readFile(path, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    )
    const inClassContext = (node: ts.Node) => {
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (ts.isJsxAttribute(parent))
          return parent.name.getText(ast) === 'className'
        if (
          ts.isCallExpression(parent) &&
          ts.isIdentifier(parent.expression) &&
          ['cn', 'cva'].includes(parent.expression.text)
        )
          return true
        if (ts.isFunctionDeclaration(parent)) return false
      }
      return false
    }
    const hasClasses = (node: ts.Node): boolean => {
      if (
        (ts.isStringLiteral(node) ||
          ts.isNoSubstitutionTemplateLiteral(node)) &&
        node.text.trim() &&
        inClassContext(node)
      )
        return true
      return ts.forEachChild(node, hasClasses) ?? false
    }
    for (const statement of ast.statements)
      if (
        ts.isFunctionDeclaration(statement) &&
        statement.name &&
        hasClasses(statement)
      )
        styled.add(statement.name.text)
  }
  styledCache.set(item, styled)
  return styled
}

async function cossBindings(ast: ts.SourceFile, uiRoot: string) {
  const names = new Set<string>()
  for (const statement of ast.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    )
      continue
    const item = statement.moduleSpecifier.text.match(/^@tc96\/ui\/(.+)$/)?.[1]
    const bindings = statement.importClause?.namedBindings
    if (!item || !bindings || !ts.isNamedImports(bindings)) continue
    const styled = await styledExports(uiRoot, item)
    for (const element of bindings.elements)
      if (styled.has((element.propertyName ?? element.name).text))
        names.add(element.name.text)
  }
  return names
}

interface Scope {
  declarations: Map<string, ts.Node>
  imports: Map<string, { name: string; specifier: string }>
  file: string
}

const compilerOptions = ts.parseJsonConfigFileContent(
  ts.readConfigFile('tsconfig.json', ts.sys.readFile).config ?? {},
  ts.sys,
  process.cwd(),
).options
const scopes = new Map<string, Scope>()

async function scopeOf(file: string, ast?: ts.SourceFile) {
  const cached = scopes.get(file)
  if (cached) return cached
  const source =
    ast ??
    ts.createSourceFile(
      file,
      await readFile(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    )
  const scope: Scope = { declarations: new Map(), file, imports: new Map() }
  const collect = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    )
      scope.declarations.set(node.name.text, node.initializer)
    ts.forEachChild(node, collect)
  }
  collect(source)
  for (const statement of source.statements) {
    const bindings = ts.isImportDeclaration(statement)
      ? statement.importClause?.namedBindings
      : undefined
    if (
      !bindings ||
      !ts.isNamedImports(bindings) ||
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    )
      continue
    for (const element of bindings.elements)
      scope.imports.set(element.name.text, {
        name: (element.propertyName ?? element.name).text,
        specifier: statement.moduleSpecifier.text,
      })
  }
  scopes.set(file, scope)
  return scope
}

// Strings de um className, seguindo constantes do mesmo arquivo e as
// importadas de outro modulo do workspace (cn(base, ...), cva(...)). Estilo de
// um item COSS (badgeVariants) vira o marcador coss:<item>.<nome>.
async function classStrings(
  node: ts.Node,
  scope: Scope,
  seen = new Set<ts.Node>(),
): Promise<string[]> {
  if (seen.has(node)) return []
  seen.add(node)
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return [node.text]
  if (ts.isIdentifier(node)) {
    const local = scope.declarations.get(node.text)
    if (local) return classStrings(local, scope, seen)
    const imported = scope.imports.get(node.text)
    if (!imported) return []
    const item = imported.specifier.match(/^@tc96\/ui\/(.+)$/)?.[1]
    if (item) return [`coss:${item}.${imported.name}`]
    const resolved = ts.resolveModuleName(
      imported.specifier,
      scope.file,
      compilerOptions,
      ts.sys,
    ).resolvedModule?.resolvedFileName
    if (!resolved || resolved.includes('node_modules')) return []
    const target = await scopeOf(resolved)
    const declaration = target.declarations.get(imported.name)
    return declaration ? classStrings(declaration, target, seen) : []
  }
  // Comparacoes (variant === 'ghost') nao sao classes.
  if (
    ts.isBinaryExpression(node) &&
    [
      ts.SyntaxKind.EqualsEqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsEqualsToken,
    ].includes(node.operatorToken.kind)
  )
    return []
  // So o valor de uma propriedade pode ser classe, nunca a chave.
  if (ts.isPropertyAssignment(node))
    return classStrings(node.initializer, scope, seen)
  // cn() e o proprio utilitario; o nome dele nao e estilo de ninguem.
  if (ts.isCallExpression(node)) {
    const strings: string[] = []
    if (!(ts.isIdentifier(node.expression) && node.expression.text === 'cn'))
      strings.push(...(await classStrings(node.expression, scope, seen)))
    for (const argument of node.arguments)
      strings.push(...(await classStrings(argument, scope, seen)))
    return strings
  }
  const strings: string[] = []
  for (const child of node.getChildren())
    strings.push(...(await classStrings(child, scope, seen)))
  return strings
}

export async function findOverrides(paths = roots, uiRoot = 'packages/ui/src') {
  const found: (Omit<OverrideException, 'reason'> & { line: number })[] = []
  for (const root of paths) {
    if (!existsSync(root)) continue
    for (const file of await files(root)) {
      if (!file.endsWith('.tsx') || /\.(test|stories)\.tsx$/.test(file))
        continue
      const ast = ts.createSourceFile(
        file,
        await readFile(file, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      const coss = await cossBindings(ast, uiRoot)
      if (!coss.size) continue
      const scope = await scopeOf(file, ast)
      const elements: (ts.JsxOpeningElement | ts.JsxSelfClosingElement)[] = []
      const visit = (node: ts.Node) => {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          coss.has(node.tagName.getText(ast))
        ) {
          elements.push(node)
        }
        ts.forEachChild(node, visit)
      }
      visit(ast)
      for (const element of elements) {
        const component = element.tagName.getText(ast)
        for (const attribute of element.attributes.properties) {
          if (
            !ts.isJsxAttribute(attribute) ||
            attribute.name.getText(ast) !== 'className' ||
            !attribute.initializer
          )
            continue
          const tokens = (await classStrings(attribute.initializer, scope))
            .join(' ')
            .split(/\s+/)
            .filter(Boolean)
          for (const className of new Set(tokens))
            if (classify(component, className))
              found.push({
                file,
                component,
                className,
                line:
                  ast.getLineAndCharacterOfPosition(attribute.getStart()).line +
                  1,
              })
        }
      }
    }
  }
  return found
}

if (import.meta.main) {
  const exceptions: OverrideException[] = existsSync(exceptionsPath)
    ? JSON.parse(await readFile(exceptionsPath, 'utf8'))
    : []
  const key = (entry: Omit<OverrideException, 'reason'>) =>
    `${entry.file} ${entry.component} ${entry.className}`
  const found = await findOverrides()
  const allowed = new Set(
    exceptions.filter(({ reason }) => reason.trim()).map(key),
  )
  const foundKeys = new Set(found.map(key))
  const problems = [
    ...found
      .filter((entry) => !allowed.has(key(entry)))
      .map(
        (entry) =>
          `${entry.file}:${entry.line}: ${entry.component} sobrescreve ${classify(entry.component, entry.className)} com ${entry.className}`,
      ),
    ...exceptions
      .filter((entry) => !entry.reason.trim())
      .map((entry) => `${exceptionsPath}: excecao sem motivo, ${key(entry)}`),
    ...exceptions
      .filter((entry) => !foundKeys.has(key(entry)))
      .map((entry) => `${exceptionsPath}: excecao sem uso, ${key(entry)}`),
  ]
  if (problems.length) throw new Error(problems.join('\n'))
  console.log(
    `Overrides verified: ${found.length} documented exceptions on COSS components.`,
  )
}
