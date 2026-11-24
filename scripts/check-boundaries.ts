import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import ts from 'typescript'
import { manifestPaths, readManifest } from './coss'
import { files } from './files'

const allowed: Record<string, string[]> = {
  utils: [],
  helpers: [],
  ui: ['utils'],
  parttens: ['ui', 'utils', 'helpers'],
  blocks: ['parttens', 'ui', 'utils', 'helpers'],
  registry: [],
}
const cossModules = new Set(
  Object.entries((await readManifest()).items).flatMap(([name, item]) =>
    manifestPaths(name, item).map((path) =>
      path.replace(/\.tsx?$/, '').replace(/\/index$/, ''),
    ),
  ),
)
const flatBlockCategories = new Set(['auth', 'records'])
function blockFolder(file: string) {
  const prefix = 'packages/blocks/src/'
  if (!file.startsWith(prefix)) return undefined
  const segments = file.slice(prefix.length).split('/')
  const depth = flatBlockCategories.has(segments[0]) ? 1 : 2
  if (segments.length <= depth + 1) return undefined
  return { group: segments.slice(0, depth).join('/'), folder: segments[depth] }
}
const graph = new Map<string, string[]>()
const violations: string[] = []
const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(
  configuration.config,
  ts.sys,
  process.cwd(),
)

for (const owner of Object.keys(allowed)) {
  for (const file of await files(`packages/${owner}/src`)) {
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
      const dependency = specifier.match(/^@tc96\/([^/]+)/)?.[1]
      if (
        dependency &&
        dependency !== owner &&
        !allowed[owner]?.includes(dependency)
      ) {
        violations.push(`${file}: ${owner} cannot depend on ${dependency}`)
      }
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
        const from = blockFolder(file)
        const to = blockFolder(target)
        if (
          from &&
          to &&
          (from.group !== to.group ||
            (to.folder !== 'shared' && to.folder !== from.folder))
        )
          violations.push(`${file}: a block cannot depend on ${target}`)
      }
    }
    graph.set(file, edges)
    if (owner === 'parttens' && file.includes('/components/ui/')) {
      violations.push(`${file}: UI must live in packages/ui`)
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
