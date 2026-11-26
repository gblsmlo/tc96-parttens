import { existsSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { workspacePackages } from './workspace'

const uiPackage = 'packages/ui'
const utilsPackage = 'packages/utils'
const stylesheet = 'packages/ui/src/styles/globals.css'

/** The exports the ui package needs so each layer resolves without tsconfig paths. */
export const layerExports: Record<string, string> = {
  './*': './src/components/*.tsx',
  './hooks/*': './src/hooks/*.ts',
  './lib/*': './src/lib/*.ts',
  './helpers/*': './src/helpers/*.ts',
  './patterns': './src/patterns/index.ts',
  './patterns/*/core': './src/patterns/*/core.ts',
  './patterns/data-grid/hooks/*': './src/patterns/data-grid/hooks/*.ts',
  './patterns/data-grid/lib/create-select-column':
    './src/patterns/data-grid/lib/create-select-column.tsx',
  './patterns/data-grid/lib/*': './src/patterns/data-grid/lib/*.ts',
  './patterns/data-grid/types': './src/patterns/data-grid/types.ts',
  './patterns/data-table/data-table-aggregation':
    './src/patterns/data-table/data-table-aggregation.ts',
  './patterns/data-table/data-table-features':
    './src/patterns/data-table/data-table-features.ts',
  './patterns/data-table/data-table-types':
    './src/patterns/data-table/data-table-types.ts',
  './patterns/data-table/use-data-table':
    './src/patterns/data-table/use-data-table.ts',
  './patterns/*': './src/patterns/*.tsx',
  './blocks/*': './src/blocks/*/index.ts',
}

function packageName(root: string, directory: string) {
  const path = join(root, directory, 'package.json')
  if (!existsSync(path)) return undefined
  const name = JSON.parse(readFileSync(path, 'utf8')).name
  return typeof name === 'string' ? name : undefined
}

export function defaultComponents(root: string, ui: string, utils: string) {
  return {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: true,
    tailwind: {
      config: '',
      css: existsSync(join(root, stylesheet)) ? stylesheet : '',
      baseColor: 'neutral',
      cssVariables: true,
    },
    aliases: {
      components: ui,
      ui,
      utils,
      lib: `${ui}/lib`,
      hooks: `${ui}/hooks`,
      helpers: `${ui}/helpers`,
      patterns: `${ui}/patterns`,
      blocks: `${ui}/blocks`,
    },
  }
}

export interface InitResult {
  components: 'created' | 'kept'
  exportsAdded: string[]
  warnings: string[]
}

/**
 * Prepares a tc96 monorepo: writes components.json with the tc96-mono layout
 * (every layer in packages/ui, cn in packages/utils) when it is missing, and
 * adds the layer exports the ui package lacks.
 */
export async function init(root: string): Promise<InitResult> {
  const ui = packageName(root, uiPackage)
  const utils = packageName(root, utilsPackage)
  const missing = [
    !ui && `${uiPackage}/package.json`,
    !utils && `${utilsPackage}/package.json`,
  ].filter(Boolean)
  if (missing.length)
    throw new Error(
      `tc96 init expects the tc96-mono layout and cannot find ${missing.join(' and ')}. Create the ${uiPackage} package (@tc96/ui) and the ${utilsPackage} package (@tc96/utils, exporting cn), or write components.json yourself to install elsewhere.`,
    )
  const warnings: string[] = []
  const componentsPath = join(root, 'components.json')
  const created = !existsSync(componentsPath)
  if (created)
    await writeFile(
      componentsPath,
      `${JSON.stringify(defaultComponents(root, ui as string, utils as string), null, 2)}\n`,
    )
  const configuredUi = JSON.parse(readFileSync(componentsPath, 'utf8'))?.aliases
    ?.ui
  const exportsAdded: string[] = []
  if (configuredUi === ui) {
    const manifestPath = join(root, uiPackage, 'package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const exports: Record<string, unknown> =
      manifest.exports && typeof manifest.exports === 'object'
        ? manifest.exports
        : {}
    for (const [key, target] of Object.entries(layerExports))
      if (!(key in exports)) {
        exports[key] = target
        exportsAdded.push(key)
      }
    if (exportsAdded.length)
      await writeFile(
        manifestPath,
        `${JSON.stringify({ ...manifest, exports }, null, 2)}\n`,
      )
  } else
    warnings.push(
      `components.json points ui to ${configuredUi}, not to ${uiPackage} (${ui}); its exports were left alone. Make each alias resolve through tsconfig paths or package exports.`,
    )
  const listed = new Set(
    workspacePackages(root).map(({ directory }) => directory),
  )
  for (const directory of [uiPackage, utilsPackage])
    if (!listed.has(directory))
      warnings.push(
        `${directory} is not in the root package.json workspaces; add it so the aliases resolve.`,
      )
  return {
    components: created ? 'created' : 'kept',
    exportsAdded,
    warnings,
  }
}
