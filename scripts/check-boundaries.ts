import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import ts from 'typescript'
import { manifestPaths, readManifest } from './coss'
import { files } from './files'

const allowed: Record<string, string[]> = {
  utils: [],
  helpers: [],
  ui: ['utils'],
  patterns: ['ui', 'utils', 'helpers'],
  blocks: ['patterns', 'ui', 'utils', 'helpers'],
  registry: [],
}
const layerRoots: Record<string, string[]> = {
  utils: ['packages/utils/src'],
  helpers: ['packages/ui/src/helpers'],
  ui: [
    'packages/ui/src/components',
    'packages/ui/src/hooks',
    'packages/ui/src/lib',
  ],
  patterns: ['packages/ui/src/patterns'],
  blocks: ['packages/ui/src/blocks'],
  registry: ['packages/registry/src'],
}
function layerOfFile(file: string) {
  return Object.entries(layerRoots).find(([, roots]) =>
    roots.some((root) => file.startsWith(`${root}/`)),
  )?.[0]
}
function layerOfSpecifier(specifier: string) {
  const [, scope, rest = ''] =
    specifier.match(/^@tc96\/([^/]+)(?:\/(.*))?$/) ?? []
  if (!scope) return undefined
  if (scope !== 'ui') return scope
  const segment = rest.split('/')[0]
  return segment === 'patterns' || segment === 'blocks' || segment === 'helpers'
    ? segment
    : 'ui'
}
const cossModules = new Set(
  Object.entries((await readManifest()).items).flatMap(([name, item]) =>
    manifestPaths(name, item).map((path) =>
      path.replace(/\.tsx?$/, '').replace(/\/index$/, ''),
    ),
  ),
)
const flatBlockCategories = new Set(['auth'])
function blockFolder(file: string) {
  const prefix = 'packages/ui/src/blocks/'
  if (!file.startsWith(prefix)) return undefined
  const segments = file.slice(prefix.length).split('/')
  const depth = flatBlockCategories.has(segments[0]) ? 1 : 2
  if (segments.length <= depth + 1) return undefined
  return { group: segments.slice(0, depth).join('/'), folder: segments[depth] }
}
function categorySharedOf(file: string) {
  const [category, folder] = file
    .slice('packages/ui/src/blocks/'.length)
    .split('/')
  return folder === 'shared' && !flatBlockCategories.has(category)
    ? category
    : undefined
}
const graph = new Map<string, string[]>()
const violations: string[] = []
const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(
  configuration.config,
  ts.sys,
  process.cwd(),
)

for (const [owner, roots] of Object.entries(layerRoots)) {
  const owned = (
    await Promise.all(
      roots.map((root) => (existsSync(root) ? files(root) : [])),
    )
  ).flat()
  for (const file of owned) {
    if (!/\.(ts|tsx)$/.test(file) || file.endsWith('.d.ts')) continue
    const source = await readFile(file, 'utf8')
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
    const imports = ast.statements.flatMap((statement) => {
      if (
        (ts.isImportDeclaration(statement) ||
          ts.isExportDeclaration(statement)) &&
        statement.moduleSpecifier &&
        ts.isStringLiteral(statement.moduleSpecifier)
      )
        return [statement.moduleSpecifier.text]
      return []
    })
    const edges: string[] = []
    for (const specifier of imports) {
      const dependency = layerOfSpecifier(specifier)
      const crosses = (layer: string | undefined) =>
        layer && layer !== owner && !allowed[owner]?.includes(layer)
      if (crosses(dependency))
        violations.push(`${file}: ${owner} cannot depend on ${dependency}`)
      if (dependency === 'ui') {
        const module = specifier.match(/^@tc96\/ui\/(.+)$/)?.[1]
        if (!module || !cossModules.has(module))
          violations.push(`${file}: ${specifier} is not in the ui manifest`)
      }
      if (
        (owner === 'utils' || owner === 'helpers') &&
        /^(react|@base-ui)/.test(specifier)
      ) {
        violations.push(`${file}: ${owner} cannot depend on React or UI`)
      }
      if (specifier.startsWith('@/'))
        violations.push(`${file}: unresolved legacy alias ${specifier}`)
      const resolved = ts.resolveModuleName(
        specifier,
        file,
        options,
        ts.sys,
      ).resolvedModule
      if (resolved) {
        const target = relative(process.cwd(), resolved.resolvedFileName)
        if (target.startsWith('packages/')) edges.push(target)
        const targetLayer = layerOfFile(target)
        if (specifier.startsWith('.') && crosses(targetLayer))
          violations.push(`${file}: ${owner} cannot depend on ${targetLayer}`)
        const from = blockFolder(file)
        const to = blockFolder(target)
        if (
          from &&
          to &&
          categorySharedOf(target) !== from.group.split('/')[0] &&
          (from.group !== to.group ||
            (to.folder !== 'shared' && to.folder !== from.folder))
        )
          violations.push(`${file}: a block cannot depend on ${target}`)
      }
    }
    graph.set(file, edges)
    if (owner === 'patterns' && file.includes('/components/ui/')) {
      violations.push(`${file}: UI must live in packages/ui/src/components`)
    }
  }
}
const visited = new Set<string>()
function visit(file: string, stack: string[]) {
  if (stack.includes(file)) {
    violations.push(
      `Cycle: ${[...stack.slice(stack.indexOf(file)), file].join(' -> ')}`,
    )
    return
  }
  if (visited.has(file)) return
  visited.add(file)
  for (const dependency of graph.get(file) ?? [])
    visit(dependency, [...stack, file])
}
for (const file of graph.keys()) visit(file, [])
if (violations.length) throw new Error(violations.join('\n'))
console.log(`Boundaries verified across ${graph.size} modules.`)
