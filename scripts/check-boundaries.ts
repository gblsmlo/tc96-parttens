import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import ts from 'typescript'
import { files } from './files'

const allowed: Record<string, string[]> = {
  utils: [],
  ui: ['utils'],
  parttens: ['ui', 'utils'],
  registry: [],
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
      if (owner === 'utils' && /^(react|@base-ui)/.test(specifier)) {
        violations.push(`${file}: utils cannot depend on React or UI`)
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
