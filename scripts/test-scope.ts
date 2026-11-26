import { type ChildProcess, spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

export interface Scope {
  bun: string[]
  stories: string[]
  biome: string[]
  dependents: string[]
  watch?: { story?: string; source?: string; lib?: string }
}

export interface Counts {
  files?: number
  tests?: number
  passed?: number
  failed?: number
  skipped?: number
}

export interface StepResult extends Counts {
  scenario: string
  step: string
  ms: number
  ok: boolean
  note?: string
}

const root = path.resolve(import.meta.dir, '..')
const storybook = path.join(root, 'apps/storybook')
const tmp =
  process.env.TC96_TEST_SCOPE_DIR ?? path.join(tmpdir(), 'tc96-test-scope')

export function readScopes(): Record<string, Partial<Scope>> {
  return JSON.parse(
    readFileSync(path.join(import.meta.dir, 'scopes.json'), 'utf8'),
  )
}

export function resolveScope(
  scopes: Record<string, Partial<Scope>>,
  name: string,
): Scope {
  const declared = scopes[name]
  const folder = name.startsWith('blocks/') ? name : `patterns/${name}`
  const source = `packages/ui/src/${folder}`
  const stories = `apps/storybook/src/${folder}`
  if (!declared && !existsSync(path.join(root, source)))
    throw new Error(`Unknown scope: ${name} (no ${source})`)
  const hasStories = existsSync(path.join(root, stories))
  return {
    bun: [source],
    stories: hasStories ? [`src/${folder}/`] : [],
    biome: hasStories ? [source, stories] : [source],
    dependents: [],
    ...declared,
  }
}

export function isScope(
  scopes: Record<string, Partial<Scope>>,
  name: string,
): boolean {
  try {
    resolveScope(scopes, name)
    return true
  } catch {
    return false
  }
}

export function hasBunTests(dirs: string[]): boolean {
  const glob = new Bun.Glob('**/*.test.{ts,tsx}')
  return dirs.some(
    (dir) =>
      existsSync(path.join(root, dir)) &&
      glob.scanSync({ cwd: path.join(root, dir) }).next().done === false,
  )
}

export function storyDirs(
  scopes: Record<string, Partial<Scope>>,
  name: string,
  deps: boolean,
): string[] {
  const dirs: string[] = []
  const queue = [name]
  const seen = new Set<string>()
  while (queue.length > 0) {
    const current = queue.shift() as string
    if (seen.has(current)) continue
    seen.add(current)
    const scope = resolveScope(scopes, current)
    dirs.push(...scope.stories)
    if (deps) queue.push(...scope.dependents)
  }
  return [...new Set(dirs)]
}

export function parseBunTest(output: string): Counts {
  const ran = output.match(/Ran (\d+) tests? across (\d+) files?/)
  return {
    tests: ran ? Number(ran[1]) : 0,
    files: ran ? Number(ran[2]) : 0,
    passed: Number(output.match(/^\s*(\d+) pass/m)?.[1] ?? 0),
    failed: Number(output.match(/^\s*(\d+) fail/m)?.[1] ?? 0),
    skipped: Number(output.match(/^\s*(\d+) skip/m)?.[1] ?? 0),
  }
}

export function parseVitestSummary(output: string): Counts {
  const count = (line: string, word: string) =>
    Number(
      output.match(new RegExp(`${line}\\s+[^\\n]*?(\\d+) ${word}`))?.[1] ?? 0,
    )
  const total = (line: string) =>
    Number(output.match(new RegExp(`${line}\\s+[^\\n]*\\((\\d+)\\)`))?.[1] ?? 0)
  return {
    files: total('Test Files'),
    tests: total('Tests'),
    passed: count('Tests', 'passed'),
    failed: count('Tests', 'failed'),
    skipped: count('Tests', 'skipped'),
  }
}

function parseVitestJson(file: string): Counts {
  if (!existsSync(file)) return {}
  const report = JSON.parse(readFileSync(file, 'utf8'))
  return {
    files: report.testResults?.length ?? 0,
    tests: report.numTotalTests,
    passed: report.numPassedTests,
    failed: report.numFailedTests,
    skipped: (report.numPendingTests ?? 0) + (report.numTodoTests ?? 0),
  }
}

function run(
  cmd: string[],
  cwd = root,
): Promise<{ code: number; output: string; ms: number }> {
  const start = performance.now()
  return new Promise((resolve) => {
    const child = spawn(cmd[0] as string, cmd.slice(1), {
      cwd,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    })
    let output = ''
    child.stdout.on('data', (chunk) => {
      output += chunk
    })
    child.stderr.on('data', (chunk) => {
      output += chunk
    })
    child.on('close', (code) =>
      resolve({ code: code ?? 1, output, ms: performance.now() - start }),
    )
  })
}

async function step(
  scenario: string,
  name: string,
  cmd: string[],
  options: {
    cwd?: string
    parse?: (output: string) => Counts
    okCodes?: number[]
  } = {},
): Promise<StepResult> {
  process.stdout.write(`  [${scenario}] ${name} ... `)
  const { code, output, ms } = await run(cmd, options.cwd)
  const ok = (options.okCodes ?? [0]).includes(code)
  const counts = options.parse?.(output) ?? {}
  console.log(`${ok ? 'ok' : `FAIL (exit ${code})`} ${(ms / 1000).toFixed(1)}s`)
  if (!ok) console.log(output.split('\n').slice(-25).join('\n'))
  return { scenario, step: name, ms, ok, ...counts }
}

function vitestRun(
  scenario: string,
  name: string,
  args: string[],
): Promise<StepResult> {
  const json = path.join(tmp, `${scenario}-${name.replace(/\W+/g, '-')}.json`)
  return step(
    scenario,
    name,
    [
      'bunx',
      'vitest',
      'run',
      '--project=storybook',
      '--maxWorkers=2',
      '--passWithNoTests',
      '--reporter=dot',
      '--reporter=json',
      `--outputFile.json=${json}`,
      ...args,
    ],
    { cwd: storybook, parse: () => parseVitestJson(json) },
  )
}

function biomeCount(output: string): Counts {
  return { files: Number(output.match(/Checked (\d+) files?/)?.[1] ?? 0) }
}

async function declared(
  scopes: Record<string, Partial<Scope>>,
  name: string,
  deps: boolean,
): Promise<StepResult[]> {
  const scope = resolveScope(scopes, name)
  const id = deps ? 'declared+deps' : 'declared'
  const stories = storyDirs(scopes, name, deps)
  return [
    await step(id, 'biome', ['bunx', 'biome', 'check', ...scope.biome], {
      parse: biomeCount,
    }),
    hasBunTests(scope.bun)
      ? await step(id, 'bun test', ['bun', 'test', '--isolate', ...scope.bun], {
          parse: parseBunTest,
        })
      : skipped(id, 'bun test', 'no bun tests in scope'),
    await step(id, 'boundaries', ['bun', 'scripts/check-boundaries.ts']),
    await step(id, 'overrides', ['bun', 'scripts/check-overrides.ts']),
    stories.length > 0
      ? await vitestRun(id, 'plays', stories)
      : skipped(id, 'plays', 'no story folder in scope'),
  ]
}

function skipped(scenario: string, step: string, note: string): StepResult {
  console.log(`  [${scenario}] ${step} ... skipped (${note})`)
  return { scenario, step, ms: 0, ok: true, note }
}

interface Watched {
  child: ChildProcess
  output: () => string
  exited: () => boolean
}

function watchProcess(cmd: string[], cwd: string, poll: boolean): Watched {
  const child = spawn(cmd[0] as string, cmd.slice(1), {
    cwd,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      FORCE_COLOR: '0',
      NO_COLOR: '1',
      ...(poll ? { CHOKIDAR_USEPOLLING: '1' } : {}),
    },
  })
  let buffer = ''
  let done = false
  child.stdout?.on('data', (chunk) => {
    buffer += chunk
  })
  child.stderr?.on('data', (chunk) => {
    buffer += chunk
  })
  child.on('exit', () => {
    done = true
  })
  return { child, output: () => buffer, exited: () => done }
}

async function waitFor(
  watched: Watched,
  from: number,
  pattern: RegExp,
  timeoutMs: number,
): Promise<string | null> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const slice = watched.output().slice(from)
    if (pattern.test(slice)) return slice
    if (watched.exited()) {
      const tail = watched.output().trim().split('\n').slice(-3).join(' | ')
      console.log(`\n    watcher exited: ${tail}`)
      return null
    }
    await Bun.sleep(100)
  }
  return null
}

function rewrite(file: string): void {
  const absolute = path.join(root, file)
  writeFileSync(absolute, readFileSync(absolute))
}

function stop(child: ChildProcess): void {
  if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {}
  }
}

const vitestCycleEnd =
  /(Waiting for file changes|Watching for file changes|Tests failed)/

async function watch(
  scopes: Record<string, Partial<Scope>>,
  name: string,
  poll: boolean,
): Promise<StepResult[]> {
  const scope = resolveScope(scopes, name)
  const id = 'watch'
  const results: StepResult[] = []
  const timeout = 15 * 60 * 1000

  const vitest = watchProcess(
    [
      'bunx',
      'vitest',
      '--watch',
      '--project=storybook',
      '--maxWorkers=2',
      ...scope.stories,
    ],
    storybook,
    poll,
  )
  try {
    process.stdout.write(`  [${id}] vitest initial run ... `)
    let start = performance.now()
    let slice = await waitFor(vitest, 0, vitestCycleEnd, timeout)
    let ms = performance.now() - start
    console.log(`${slice ? 'ok' : 'timeout'} ${(ms / 1000).toFixed(1)}s`)
    results.push({
      scenario: id,
      step: 'vitest initial',
      ms,
      ok: Boolean(slice),
      ...parseVitestSummary(slice ?? ''),
    })

    for (const [label, file] of [
      ['vitest rerun: story edit', scope.watch?.story],
      ['vitest rerun: source edit', scope.watch?.source],
    ] as const) {
      if (!file || !slice) continue
      await Bun.sleep(1500)
      const from = vitest.output().length
      process.stdout.write(`  [${id}] ${label} ... `)
      start = performance.now()
      rewrite(file)
      slice = await waitFor(vitest, from, vitestCycleEnd, timeout)
      ms = performance.now() - start
      console.log(`${slice ? 'ok' : 'timeout'} ${(ms / 1000).toFixed(1)}s`)
      results.push({
        scenario: id,
        step: label,
        ms,
        ok: Boolean(slice) && !/Tests failed/.test(slice ?? ''),
        note: path.basename(file),
        ...parseVitestSummary(slice ?? ''),
      })
    }
  } finally {
    stop(vitest.child)
  }

  if (scope.watch?.lib) {
    const bun = watchProcess(
      ['bun', 'test', '--watch', '--isolate', ...scope.bun],
      root,
      poll,
    )
    try {
      const ran = /Ran \d+ tests? across \d+ files?/
      let start = performance.now()
      let slice = await waitFor(bun, 0, ran, timeout)
      let ms = performance.now() - start
      results.push({
        scenario: id,
        step: 'bun test initial',
        ms,
        ok: Boolean(slice),
        ...parseBunTest(slice ?? ''),
      })
      await Bun.sleep(1000)
      const from = bun.output().length
      start = performance.now()
      rewrite(scope.watch.lib)
      slice = await waitFor(bun, from, ran, 60_000)
      ms = performance.now() - start
      console.log(
        `  [${id}] bun test rerun: lib edit ... ${slice ? 'ok' : 'timeout'} ${(ms / 1000).toFixed(1)}s`,
      )
      results.push({
        scenario: id,
        step: 'bun test rerun: lib edit',
        ms,
        ok: Boolean(slice),
        note: path.basename(scope.watch.lib),
        ...parseBunTest(slice ?? ''),
      })
    } finally {
      stop(bun.child)
    }
  }
  return results
}

export function table(results: StepResult[]): string {
  const rows = [
    [
      'scenario',
      'step',
      'time',
      'ok',
      'files',
      'tests',
      'passed',
      'failed',
      'skipped',
    ],
  ]
  for (const r of results)
    rows.push([
      r.scenario,
      r.note ? `${r.step} (${r.note})` : r.step,
      `${(r.ms / 1000).toFixed(1)}s`,
      r.ok ? 'yes' : 'NO',
      String(r.files ?? ''),
      String(r.tests ?? ''),
      String(r.passed ?? ''),
      String(r.failed ?? ''),
      String(r.skipped ?? ''),
    ])
  const totals = new Map<string, number>()
  for (const r of results)
    totals.set(r.scenario, (totals.get(r.scenario) ?? 0) + r.ms)
  for (const [scenario, ms] of totals)
    rows.push([
      scenario,
      'TOTAL',
      `${(ms / 1000).toFixed(1)}s`,
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  const widths =
    rows[0]?.map((_, i) =>
      Math.max(...rows.map((row) => row[i]?.length ?? 0)),
    ) ?? []
  return rows
    .map((row) => row.map((cell, i) => cell.padEnd(widths[i] ?? 0)).join('  '))
    .join('\n')
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const name = args.find((arg) => !arg.startsWith('--'))
  const flag = (key: string) =>
    args.find((arg) => arg.startsWith(`--${key}=`))?.split('=')[1]
  const scenarios = (flag('scenario') ?? 'declared').split(',')
  const deps = args.includes('--deps')
  const poll = args.includes('--poll')
  const scopes = readScopes()
  if (!name || !isScope(scopes, name)) {
    console.error(
      `Usage: bun run test:scope <pattern folder, e.g. collection or records/dialog> [--deps] [--scenario=declared,watch] [--poll]`,
    )
    process.exit(1)
  }
  mkdirSync(tmp, { recursive: true })

  const results: StepResult[] = []
  for (const scenario of scenarios) {
    console.log(
      `\n== ${scenario} (${name}${deps && scenario === 'declared' ? ', deps' : ''}) ==`,
    )
    if (scenario === 'declared')
      results.push(...(await declared(scopes, name, deps)))
    else if (scenario === 'watch')
      results.push(...(await watch(scopes, name, poll)))
    else throw new Error(`Unknown scenario: ${scenario}`)
  }

  console.log(`\n${table(results)}`)
  const out = path.join(tmp, `${name.replace(/\W+/g, '-')}-${Date.now()}.json`)
  writeFileSync(out, JSON.stringify(results, null, 2))
  console.log(`\nresults: ${out}`)
  process.exit(results.every((r) => r.ok) ? 0 : 1)
}

if (import.meta.main) await main()
