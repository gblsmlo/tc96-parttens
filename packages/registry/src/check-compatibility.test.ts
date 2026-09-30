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
