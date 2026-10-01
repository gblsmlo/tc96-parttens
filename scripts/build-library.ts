import { spawnSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { transform } from 'esbuild'
import { files } from './files'

const output = resolve('dist/library')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const declarations = spawnSync('tsc', ['-p', 'tsconfig.build.json'], {
  stdio: 'inherit',
})
if (declarations.status !== 0) process.exit(declarations.status ?? 1)

function modulePath(specifier: string, file: string, declaration: boolean) {
  let target: string
  if (specifier.startsWith('@tc96/')) {
    const [, pkg, ...suffix] = specifier.split('/')
    target = join(
      output,
      pkg ?? '',
      'src',
      suffix.length ? suffix.join('/') : 'index',
    )
  } else if (specifier.startsWith('.')) {
    target = resolve(dirname(file), specifier)
    if (!/\.(js|css)$/.test(target)) {
      const index = join(target, 'index.d.ts')
      if (require('node:fs').existsSync(index)) target = join(target, 'index')
    }
  } else return specifier
  const extension = declaration ? '.js' : '.js'
  let path = relative(dirname(file), target).replaceAll('\\', '/')
  if (!/\.(js|css)$/.test(path)) path += extension
  return path.startsWith('.') ? path : `./${path}`
}
function rewrite(source: string, file: string, declaration: boolean) {
  return source.replace(
    /(from\s*|import\s*)(['"])([^'"\n]+)\2/g,
    (_match, prefix: string, quote: string, specifier: string) =>
      `${prefix}${quote}${modulePath(specifier, file, declaration)}${quote}`,
  )
}
for (const pkg of ['utils', 'ui', 'elements', 'parttens']) {
  for (const source of await files(`packages/${pkg}/src`)) {
    if (
      !/\.(ts|tsx)$/.test(source) ||
      /\.(test|stories)\.|\/test\/|\.d\.ts$/.test(source)
    )
      continue
    const destination = join(
      output,
      relative('packages', source).replace(/\.tsx?$/, '.js'),
    )
    await mkdir(dirname(destination), { recursive: true })
    const compiled = await transform(await readFile(source, 'utf8'), {
      loader: source.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      jsx: 'automatic',
      target: 'es2022',
      sourcemap: false,
    })
    const client =
      pkg !== 'utils' && !compiled.code.match(/^['"]use client['"]/)
        ? "'use client';\n"
        : ''
    await writeFile(
      destination,
      client + rewrite(compiled.code, destination, false),
    )
  }
}
for (const file of await files(output)) {
  if (file.endsWith('.d.ts'))
    await writeFile(file, rewrite(await readFile(file, 'utf8'), file, true))
}
const dependencies: Record<string, string> = {}
for (const pkg of ['utils', 'ui', 'elements', 'parttens']) {
  const manifest = JSON.parse(
    await readFile(`packages/${pkg}/package.json`, 'utf8'),
  )
  for (const [name, version] of Object.entries(manifest.dependencies ?? {})) {
    if (!name.startsWith('@tc96/')) dependencies[name] = String(version)
  }
}
const entry = (path: string) => ({
  types: `./${path}.d.ts`,
  import: `./${path}.js`,
})
const exports = {
  './ui': entry('ui/src/index'),
  './utils': entry('utils/src/index'),
  './parttens': entry('parttens/src/index'),
  './components': entry('parttens/src/components'),
  './blocks': entry('parttens/src/blocks'),
  './styles.css': './ui/styles.css',
  ...Object.fromEntries(
    ['view', 'properties', 'detail-sheet', 'editable', 'collection-views'].map(
      (name) => [`./registry/${name}`, `./registry/${name}.json`],
    ),
  ),
}
await writeFile(
  join(output, 'package.json'),
  `${JSON.stringify(
    {
      name: 'tc96',
      version: '0.1.0',
      type: 'module',
      license: 'MIT',
      engines: { node: '>=22' },
      sideEffects: ['**/*.css'],
      exports,
      files: ['ui', 'utils', 'parttens', 'registry', 'README.md', 'LICENSE'],
      dependencies,
      peerDependencies: {
        react: '>=19.1.1 <20',
        'react-dom': '>=19.1.1 <20',
        '@base-ui/react': '>=1.6.0 <2',
      },
    },
    null,
    2,
  )}\n`,
)
await writeFile(join(output, 'LICENSE'), await readFile('LICENSE'))
await mkdir(join(output, 'ui'), { recursive: true })
const styles = (await readFile('apps/storybook/src/styles.css', 'utf8'))
  .replace(/^@import.*\n/m, '')
  .replace(/^@source.*\n/gm, '')
await writeFile(join(output, 'ui/styles.css'), styles)
console.log(
  'Library ESM and declarations generated from canonical workspace sources.',
)
