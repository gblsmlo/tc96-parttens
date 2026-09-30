import { spawnSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export function run(command: string[], cwd = process.cwd(), capture = false) {
  const executable = command[0]
  if (!executable) throw new Error('Command is empty')
  const result = spawnSync(executable, command.slice(1), {
    cwd,
    env: { ...process.env, CI: 'true' },
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  })
  if (result.status !== 0)
    throw new Error(
      `${command.join(' ')} failed (${result.status}): ${result.stderr ?? result.error ?? ''}`,
    )
  return result.stdout ?? ''
}
export async function json(path: string, value: unknown) {
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}
export async function pack(directory: string) {
  const destination = resolve('.test-output/tarballs')
  await mkdir(destination, { recursive: true })
  const result = JSON.parse(
    run(
      [
        'npm',
        'pack',
        '--json',
        '--pack-destination',
        destination,
        '--cache',
        '/private/tmp/tc96-parttens-npm-cache',
      ],
      directory,
      true,
    ),
  )
  return join(destination, result[0].filename)
}
export async function createConsumer(
  name: string,
  extra: Record<string, string> = {},
) {
  const root = resolve(`.test-output/${name}`)
  await rm(root, { recursive: true, force: true })
  await mkdir(join(root, 'src'), { recursive: true })
  const library = await pack(resolve('dist/library'))
  await json(join(root, 'package.json'), {
    name: `tc96-${name}-consumer`,
    private: true,
    type: 'module',
    dependencies: {
      tc96: `file:${library}`,
      react: '19.1.1',
      'react-dom': '19.1.1',
      '@base-ui/react': '1.6.0',
      ...extra,
    },
    devDependencies: {
      typescript: '6.0.3',
      '@types/react': '19.1.11',
      '@types/react-dom': '19.1.7',
      '@types/node': '24.3.0',
      vite: '8.2.1',
      '@vitejs/plugin-react': '6.0.5',
      tailwindcss: '4.3.3',
      '@tailwindcss/vite': '4.3.3',
    },
  })
  await json(join(root, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      types: ['node'],
    },
    include: ['src'],
  })
  run(['bun', 'install'], root)
  return root
}
export async function saveReport(name: string, value: unknown) {
  await json(resolve(`.test-output/${name}.json`), value)
}
export async function libraryManifest() {
  return JSON.parse(await readFile('dist/library/package.json', 'utf8'))
}
