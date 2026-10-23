import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import ts from 'typescript'
import {
  assertDistributable,
  combineItems,
  defaultConfig,
  type InstallConfig,
  omitInstalled,
  prepareItem,
  type RegistryItem,
  selectItems,
  templateNames,
  templateSources,
  validateConfig,
} from './manifest'

const config: InstallConfig = {
  aliases: {
    ui: '@consumer/visual',
    utils: '@consumer/helpers/cn',
    elements: '@consumer/atoms',
    helpers: '@consumer/toolkit',
    patterns: '@consumer/patterns',
    templates: '@consumer/templates',
  },
  paths: {
    ui: 'packages/visual/src',
    elements: 'packages/atoms/src',
    helpers: 'packages/toolkit/src',
    patterns: 'packages/patterns/src',
    templates: 'apps/web/src/templates',
  },
}
function item(path: string, content: string): RegistryItem {
  return {
    name: 'proof',
    type: 'registry:block',
    files: [{ path, type: 'registry:file', content }],
    dependencies: [],
  }
}

test('selects several patterns once and maps legacy view to collection-views', () => {
  expect(selectItems(['view', 'properties', 'collection-views'])).toEqual([
    'collection-views',
    'properties',
  ])
})
test('accepts the migrated checklist pattern', () => {
  expect(selectItems(['checklist', 'checklist'])).toEqual(['checklist'])
})
test('accepts the state-surface pattern', () => {
  expect(selectItems(['state-surface'])).toEqual(['state-surface'])
})
test('accepts the settings pattern', () => {
  expect(selectItems(['settings'])).toEqual(['settings'])
})
test('accepts the chats-panel pattern', () => {
  expect(selectItems(['chats-panel'])).toEqual(['chats-panel'])
})
test('accepts the wizard pattern', () => {
  expect(selectItems(['wizard'])).toEqual(['wizard'])
})
test('accepts the widgets pattern', () => {
  expect(selectItems(['widgets'])).toEqual(['widgets'])
})
test('accepts templates next to patterns', () => {
  expect(selectItems(['app-shell-1', 'widgets', 'app-shell-1'])).toEqual([
    'app-shell-1',
    'widgets',
  ])
})
test('maps template files and imports to the templates destination', () => {
  const result = prepareItem(
    item(
      'templates/src/application/shell/app-shell-1/app-shell-1.tsx',
      'import { Sidebar } from "@tc96/ui/sidebar"\nimport { ProgressRing } from "@tc96/parttens/widgets/shared/progress-ring"\nimport { NavMain } from "@tc96/templates/application/shell/shared/nav-main"\n',
    ),
    config,
  )
  expect(result.files[0]).toMatchObject({
    target:
      '~/apps/web/src/templates/application/shell/app-shell-1/app-shell-1.tsx',
    content:
      'import { Sidebar } from "@consumer/visual/sidebar"\nimport { ProgressRing } from "@consumer/patterns/widgets/shared/progress-ring"\nimport { NavMain } from "@consumer/templates/application/shell/shared/nav-main"\n',
  })
  const built = prepareItem(
    item(
      'templates/src/application/shell/app-shell-1/app-shell-1.tsx',
      'import { ProgressRing } from "@tc96/parttens/widgets/shared/progress-ring"\n',
    ),
    defaultConfig,
  )
  expect(prepareItem(built, config).files[0]?.content).toBe(
    'import { ProgressRing } from "@consumer/patterns/widgets/shared/progress-ring"\n',
  )
  expect(() =>
    prepareItem(
      item('templates/src/application/shell/app-shell-1/index.ts', ''),
      { ...config, paths: { ...config.paths, templates: undefined } },
    ),
  ).toThrow('Invalid registry path')
})
test('rejects unknown or excluded patterns', () => {
  expect(() => selectItems(['filter-builder'])).toThrow(
    'Unknown pattern or template',
  )
  expect(() => selectItems(['detail-sheet'])).toThrow('Unknown pattern')
  expect(() => selectItems([])).toThrow('Choose')
})
test('maps destinations and imports without corrupting arbitrary string contents', () => {
  const result = prepareItem(
    {
      name: 'proof',
      type: 'registry:block',
      files: [
        {
          path: 'parttens/src/collection-views/proof.ts',
          type: 'registry:file',
          content:
            'import { Button } from "@tc96/ui/button"\nconst text = "@tc96/ui/button"\n',
        },
      ],
      dependencies: [],
    },
    config,
  )
  expect(result.files[0]?.target).toBe(
    '~/packages/patterns/src/collection-views/proof.ts',
  )
  expect(result.files[0]?.content).toContain('from "@consumer/visual/button"')
  expect(result.files[0]?.content).toContain('const text = "@tc96/ui/button"')
})
test('maps elements files and imports to the elements destination', () => {
  const result = prepareItem(
    {
      name: 'proof',
      type: 'registry:block',
      files: [
        {
          path: 'elements/src/text.tsx',
          type: 'registry:file',
          content: 'export const text = 1\n',
        },
        {
          path: 'parttens/src/shared/toolbar.tsx',
          type: 'registry:file',
          content: 'import { Text } from "@tc96/elements/text"\n',
        },
      ],
      dependencies: [],
    },
    config,
  )
  expect(result.files[0]?.target).toBe('~/packages/atoms/src/text.tsx')
  expect(result.files[1]?.content).toContain('from "@consumer/atoms/text"')
})
test('maps helpers files and imports to the helpers destination', () => {
  const result = prepareItem(
    {
      name: 'proof',
      type: 'registry:block',
      files: [
        {
          path: 'helpers/src/format.ts',
          type: 'registry:file',
          content: 'export const formatAmount = 1\n',
        },
        {
          path: 'parttens/src/widgets/index.ts',
          type: 'registry:file',
          content: 'export { formatAmount } from "@tc96/helpers/format"\n',
        },
      ],
      dependencies: [],
    },
    config,
  )
  expect(result.files[0]?.target).toBe('~/packages/toolkit/src/format.ts')
  expect(result.files[1]?.content).toContain('from "@consumer/toolkit/format"')
})
test('rewrites ui and utils imports to the consumer aliases', () => {
  const result = prepareItem(
    item(
      'parttens/src/shared/toolbar.tsx',
      'import { Button } from "@tc96/ui/button"\nimport { cn } from "@tc96/utils"\n',
    ),
    config,
  )
  expect(result.files[0]?.content).toBe(
    'import { Button } from "@consumer/visual/button"\nimport { cn } from "@consumer/helpers/cn"\n',
  )
})
test('refuses to distribute ui or utils files', () => {
  for (const path of ['ui/src/button.tsx', 'utils/src/index.ts'])
    expect(() => prepareItem(item(path, 'export {}\n'), config)).toThrow(
      'belongs to the consumer and is not distributed',
    )
})
test('refuses to distribute a theme', () => {
  for (const token of [
    ':root {}',
    '.dark {}',
    '@theme inline {}',
    '@utility x {}',
  ])
    expect(() =>
      assertDistributable(item('parttens/src/views/global.css', token)),
    ).toThrow('redefines the theme')
  expect(() =>
    assertDistributable(
      item('parttens/src/views/list.tsx', 'const c = "dark:bg-muted"\n'),
    ),
  ).not.toThrow()
})
test('requires every alias and both destination paths', () => {
  expect(() =>
    validateConfig({
      ...config,
      aliases: { ...config.aliases, elements: undefined },
    } as unknown as InstallConfig),
  ).toThrow('Invalid elements alias')
  expect(() =>
    validateConfig({
      ...config,
      paths: { ...config.paths, elements: '../outside' },
    }),
  ).toThrow('elements path must be inside the consumer workspace')
})
test('combines COSS dependencies and leaves out the installed ones', () => {
  const combined = combineItems([
    {
      ...item('parttens/src/a.ts', ''),
      registryDependencies: ['@coss/menu', '@coss/button'],
    },
    {
      ...item('parttens/src/b.ts', ''),
      registryDependencies: ['@coss/button', '@coss/empty'],
    },
  ])
  expect(combined.registryDependencies).toEqual([
    '@coss/button',
    '@coss/empty',
    '@coss/menu',
  ])
  const installed = new Set(['button', 'menu'])
  expect(
    omitInstalled(combined, (component) => installed.has(component))
      .registryDependencies,
  ).toEqual(['@coss/empty'])
})

test('builds the record-preview item with COSS-only dependencies and no test files', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/record-preview.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('record-preview')
  expect(item.registryDependencies?.length).toBeGreaterThan(0)
  for (const dependency of item.registryDependencies ?? [])
    expect(dependency.startsWith('@coss/')).toBe(true)
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
  expect(() =>
    readFileSync(join(root, 'dist/registry/detail-sheet.json'), 'utf8'),
  ).toThrow()
})

test('builds the record-group item shipping the properties catalog it imports by path', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/record-group.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('record-group')
  expect(paths).toContain('parttens/src/properties/shared/property-catalog.ts')
  expect(paths).not.toContain('elements/src/card-surface.tsx')
  expect(item.registryDependencies).toContain('@coss/card')
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
  expect(
    item.registryDependencies?.every((dependency) =>
      dependency.startsWith('@coss/'),
    ),
  ).toBe(true)
})

test('builds the state-surface item with COSS-only dependencies and no test files', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/state-surface.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('state-surface')
  expect(item.registryDependencies?.length).toBeGreaterThan(0)
  expect(
    item.registryDependencies?.every((dependency) =>
      dependency.startsWith('@coss/'),
    ),
  ).toBe(true)
  expect(paths).toContain('elements/src/icon-frame.tsx')
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('builds the settings item shipping Text and no test files', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/settings.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('settings')
  expect(item.registryDependencies).toEqual(['@coss/card', '@coss/collapsible'])
  expect(paths).toContain('elements/src/text.tsx')
  expect(paths).not.toContain('elements/src/card-surface.tsx')
  expect(paths).toContain('parttens/src/surfaces/settings/index.ts')
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('builds the chats-panel item from the chat folder with COSS-only dependencies', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/chats-panel.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('chats-panel')
  expect(item.registryDependencies).toEqual([
    '@coss/badge',
    '@coss/card',
    '@coss/scroll-area',
    '@coss/skeleton',
  ])
  expect(item.dependencies).toContain('@thesvg/icons@3.4.1')
  expect(paths).toContain('parttens/src/chat/chats-panel/index.ts')
  expect(paths.every((path) => path.startsWith('parttens/src/chat/'))).toBe(
    true,
  )
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('builds the chat-assistant item with the COSS chat and composer dependencies', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/chat-assistant.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('chat-assistant')
  expect(item.registryDependencies).toEqual([
    '@coss/badge',
    '@coss/button',
    '@coss/card',
    '@coss/chat',
    '@coss/composer',
    '@coss/tooltip',
  ])
  expect(paths).toContain('parttens/src/chat/assistant/index.ts')
  expect(paths.every((path) => path.startsWith('parttens/src/chat/'))).toBe(
    true,
  )
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('builds the wizard item from its folder with IconFrame and COSS dependencies', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/wizard.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('wizard')
  expect(item.registryDependencies).toEqual(['@coss/button', '@coss/card'])
  expect(paths).toContain('parttens/src/wizard/index.ts')
  expect(paths).toContain('elements/src/icon-frame.tsx')
  expect(
    paths.every(
      (path) =>
        path.startsWith('parttens/src/wizard/') ||
        path === 'elements/src/icon-frame.tsx',
    ),
  ).toBe(true)
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('lists every template folder in templateSources', () => {
  const root = resolve(import.meta.dir, '../../..')
  const folders = [
    ...new Bun.Glob('*/*/*/index.ts').scanSync(
      join(root, 'packages/templates/src'),
    ),
  ]
    .map((path) => path.replace(/\/index\.ts$/, ''))
    .sort()
  expect(folders).toEqual(Object.values(templateSources).sort())
  expect(Object.keys(templateSources).sort()).toEqual([...templateNames].sort())
})

test('builds flow-canvas with the d3-hierarchy version of parttens and no React Flow in the other flow items', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const read = (name: string): RegistryItem =>
    JSON.parse(readFileSync(join(root, `dist/registry/${name}.json`), 'utf8'))
  const canvas = read('flow-canvas')
  expect(canvas.dependencies).toContain('d3-hierarchy@3.1.2')
  for (const name of ['flow-step-library', 'flow-inspector', 'chat-assistant'])
    expect(
      read(name).dependencies.some((dependency) =>
        dependency.startsWith('@xyflow/react@'),
      ),
    ).toBe(false)
})

test('builds flow-canvas with @xyflow/react@12.12.0 now that the pattern imports React Flow', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const canvas: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/flow-canvas.json'), 'utf8'),
  )
  expect(canvas.dependencies).toContain('@xyflow/react@12.12.0')
})

test('resolves the core entry of a pattern from a template import', () => {
  const root = resolve(import.meta.dir, '../../..')
  const configuration = ts.readConfigFile(
    join(root, 'tsconfig.json'),
    ts.sys.readFile,
  )
  const parsed = ts.parseJsonConfigFileContent(
    configuration.config,
    ts.sys,
    root,
  )
  const resolved = ts.resolveModuleName(
    '@tc96/parttens/flow/canvas/core',
    join(root, 'packages/templates/src/application/flow/shared/types.ts'),
    parsed.options,
    ts.sys,
  ).resolvedModule
  expect(resolved?.resolvedFileName).toBe(
    join(root, 'packages/parttens/src/flow/canvas/core.ts'),
  )
})

test('builds the app-shell-1 item with the shell shared files and the sidebar from COSS', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  const item: RegistryItem = JSON.parse(
    readFileSync(join(root, 'dist/registry/app-shell-1.json'), 'utf8'),
  )
  const paths = item.files.map((file) => file.path)

  expect(item.name).toBe('app-shell-1')
  expect(item.registryDependencies).toContain('@coss/sidebar')
  expect(item.registryDependencies).toContain('@coss/breadcrumb')
  expect(paths).toContain(
    'templates/src/application/shell/app-shell-1/index.ts',
  )
  expect(paths).toContain(
    'templates/src/application/shell/shared/shell-nav.tsx',
  )
  expect(
    paths.every(
      (path) =>
        path.startsWith('templates/src/application/shell/') ||
        path.startsWith('elements/src/') ||
        path.startsWith('helpers/src/'),
    ),
  ).toBe(true)
  expect(paths.some((path) => path.startsWith('parttens/'))).toBe(false)
  expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
})

test('builds the flow templates from application/flow, the flow patterns, the assistant, elements and helpers only', () => {
  const root = resolve(import.meta.dir, '../../..')
  const build = spawnSync(
    process.execPath,
    ['packages/registry/src/build-registry.ts'],
    { cwd: root },
  )
  expect(build.status).toBe(0)
  for (const name of ['workflow-editor', 'agent-builder']) {
    const item: RegistryItem = JSON.parse(
      readFileSync(join(root, `dist/registry/${name}.json`), 'utf8'),
    )
    const paths = item.files.map((file) => file.path)

    expect(item.name).toBe(name)
    expect(item.dependencies).toContain('@xyflow/react@12.12.0')
    expect(item.dependencies).toContain('d3-hierarchy@3.1.2')
    expect(paths).toContain(`templates/src/application/flow/${name}/index.ts`)
    expect(
      paths.every(
        (path) =>
          path.startsWith('templates/src/application/flow/') ||
          path.startsWith('parttens/src/flow/') ||
          path.startsWith('parttens/src/chat/assistant/') ||
          path.startsWith('elements/src/') ||
          path.startsWith('helpers/src/'),
      ),
    ).toBe(true)
    expect(paths.some((path) => /\.test\.(ts|tsx)$/.test(path))).toBe(false)
    expect(paths.some((path) => path.includes('application/shell'))).toBe(false)
  }
})
