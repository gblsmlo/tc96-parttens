import { expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkCompatibility } from './check-compatibility'
import type { RegistryItem } from './manifest'

test('checks actual consumer props and missing exports before overwriting UI', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-types-'))
  try {
    await mkdir(join(root, 'src/ui'), { recursive: true })
    await writeFile(
      join(root, 'src/ui/button.ts'),
      'export function Button(props: { variant: "outline" }) { return props }',
    )
    await writeFile(
      join(root, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          paths: { '@consumer/ui/*': ['./src/ui/*'] },
        },
      }),
    )
    const item: RegistryItem = {
      name: 'proof',
      type: 'registry:block',
      dependencies: [],
      files: [
        {
          path: 'parttens/src/proof.ts',
          target: '~/src/proof.ts',
          type: 'registry:file',
          content:
            'import { Button } from "@consumer/ui/button"; Button({ variant: "primary" })',
        },
      ],
    }
    expect((await checkCompatibility(root, item)).status).toBe('incompatible')
    const proofFile = item.files[0]
    if (!proofFile) throw new Error('Fixture file missing')
    proofFile.content =
      'import { Button } from "@consumer/ui/button"; Button({ variant: "outline" })'
    expect((await checkCompatibility(root, item)).status).toBe('compatible')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('reports unavailable dependencies as inconclusive rather than compatible', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-types-'))
  try {
    await writeFile(
      join(root, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: { moduleResolution: 'Bundler', module: 'ESNext' },
      }),
    )
    const item: RegistryItem = {
      name: 'proof',
      type: 'registry:block',
      dependencies: [],
      files: [
        {
          path: 'parttens/src/proof.ts',
          target: '~/proof.ts',
          type: 'registry:file',
          content:
            'import { Missing } from "dependency-not-installed"; export { Missing }',
        },
      ],
    }
    expect((await checkCompatibility(root, item)).status).toBe('inconclusive')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

async function consumerWith(dependency?: { version: string; types: string }) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-types-'))
  await writeFile(
    join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
      },
    }),
  )
  if (dependency) {
    const directory = join(root, 'node_modules/dep')
    await mkdir(directory, { recursive: true })
    await writeFile(
      join(directory, 'package.json'),
      JSON.stringify({ name: 'dep', version: dependency.version }),
    )
    await writeFile(join(directory, 'index.d.ts'), dependency.types)
  }
  return root
}
function itemUsingDep(content: string): RegistryItem {
  return {
    name: 'proof',
    type: 'registry:block',
    dependencies: ['dep@4.4.3'],
    files: [
      {
        path: 'parttens/src/proof.ts',
        target: '~/src/proof.ts',
        type: 'registry:file',
        content,
      },
    ],
  }
}

test('does not check against another major of a dependency installed later', async () => {
  // shadcn brings zod 3 into node_modules; the patterns declare zod 4.
  const root = await consumerWith({
    version: '3.25.0',
    types: 'export declare const legacy: number',
  })
  try {
    const item = itemUsingDep(
      'import { email } from "dep"; export const value = email((input) => input)',
    )
    const before = await checkCompatibility(root, item)
    expect(before.status).toBe('inconclusive')
    expect(before.diagnostics[0]).toBe(
      'dep@4.4.3 is not installed yet (found 3.25.0); its types are checked after installation.',
    )

    const file = item.files[0]
    if (!file) throw new Error('Fixture file missing')
    await mkdir(join(root, 'src'), { recursive: true })
    await writeFile(join(root, 'src/proof.ts'), file.content)
    expect((await checkCompatibility(root, item, true)).status).toBe(
      'incompatible',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('still checks a dependency already installed in a compatible version', async () => {
  const root = await consumerWith({
    version: '4.0.0',
    types: 'export declare const legacy: number',
  })
  try {
    const result = await checkCompatibility(
      root,
      itemUsingDep('import { email } from "dep"; export { email }'),
    )
    expect(result.status).toBe('incompatible')
    expect(result.diagnostics.join('\n')).toContain('TS2305')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('does not report implicit any caused by a missing module as incompatible', async () => {
  const root = await consumerWith()
  try {
    const result = await checkCompatibility(
      root,
      itemUsingDep(
        'import { email } from "dep"; export const value = email((input) => input)',
      ),
    )
    expect(result.status).toBe('inconclusive')
    expect(result.diagnostics.join('\n')).not.toContain('TS7006')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('separates pending dependencies and their diagnostics from real ones', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-types-'))
  try {
    await writeFile(
      join(root, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: { moduleResolution: 'Bundler', module: 'ESNext' },
      }),
    )
    const report = await checkCompatibility(root, {
      name: 'proof',
      type: 'registry:block',
      dependencies: ['absent-package@1.0.0'],
      files: [
        {
          path: 'parttens/src/proof.ts',
          target: '~/src/proof.ts',
          type: 'registry:file',
          content: 'import "absent-package"; export const value = 1',
        },
      ],
    })
    expect(report.status).toBe('inconclusive')
    expect(report.pending).toHaveLength(1)
    expect(report.deferred).toHaveLength(1)
    expect(report.deferred[0]).toContain('TS2882')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
