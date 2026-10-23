import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import {
  FLOW_STEP_TRANSFER_TYPE,
  type FlowConnection,
  type FlowRunStatus,
  type FlowStep,
  type FlowStepType,
  flowRunSummary,
  incomingOf,
  outgoingOf,
  parseStepTransfer,
  serializeStepTransfer,
  tidyTree,
} from './core'

const step = (id: string, status?: FlowRunStatus): FlowStep => ({
  id,
  type: 'action',
  name: id,
  position: { x: 0, y: 0 },
  ...(status && { run: { status } }),
})
const link = (source: string, target: string): FlowConnection => ({
  id: `${source}-${target}`,
  source,
  target,
})

const steps = ['root', 'a', 'b', 'c', 'a1', 'a2'].map((id) => step(id))
const connections = [
  link('root', 'a'),
  link('root', 'b'),
  link('root', 'c'),
  link('a', 'a1'),
  link('a', 'a2'),
]
const options = {
  direction: 'vertical',
  nodeSize: [100, 40],
  gap: [20, 30],
} as const

function overlaps(laid: FlowStep[], [width, height]: [number, number]) {
  return laid.some((one, index) =>
    laid
      .slice(index + 1)
      .some(
        (other) =>
          Math.abs(one.position.x - other.position.x) < width &&
          Math.abs(one.position.y - other.position.y) < height,
      ),
  )
}

test('tidyTree places a three-branch tree without overlap', () => {
  const laid = tidyTree(steps, connections, options)
  expect(laid.map((one) => one.id)).toEqual(steps.map((one) => one.id))
  expect(overlaps(laid, [100, 40])).toBe(false)
  const at = (id: string) => laid.find((one) => one.id === id)?.position
  expect(at('root')?.y).toBeLessThan(at('a')?.y ?? 0)
  expect(at('a')?.y).toBe(at('b')?.y)
  expect(at('a')?.y).toBeLessThan(at('a1')?.y ?? 0)
})

test('tidyTree is deterministic and does not mutate its input', () => {
  const before = JSON.stringify(steps)
  expect(tidyTree(steps, connections, options)).toEqual(
    tidyTree(steps, connections, options),
  )
  expect(JSON.stringify(steps)).toBe(before)
})

test('tidyTree respects direction', () => {
  const vertical = tidyTree(steps, connections, options)
  const horizontal = tidyTree(steps, connections, {
    ...options,
    direction: 'horizontal',
  })
  const pick = (laid: FlowStep[], id: string) =>
    laid.find((one) => one.id === id)?.position
  expect(pick(horizontal, 'root')?.x).toBeLessThan(
    pick(horizontal, 'a')?.x ?? 0,
  )
  expect(pick(horizontal, 'a')?.x).toBe(pick(horizontal, 'b')?.x)
  expect(pick(vertical, 'a')?.y).toBe(pick(vertical, 'b')?.y)
  expect(overlaps(horizontal, [100, 40])).toBe(false)
})

test('tidyTree spaces levels and siblings by nodeSize and gap', () => {
  const laid = tidyTree(steps, connections, options)
  const at = (id: string) => laid.find((one) => one.id === id)?.position
  expect((at('a')?.y ?? 0) - (at('root')?.y ?? 0)).toBe(40 + 30)
  expect((at('b')?.x ?? 0) - (at('a')?.x ?? 0)).toBeGreaterThanOrEqual(100 + 20)
  const wider = tidyTree(steps, connections, { ...options, gap: [60, 90] })
  const wide = (id: string) => wider.find((one) => one.id === id)?.position
  expect((wide('a')?.y ?? 0) - (wide('root')?.y ?? 0)).toBe(40 + 90)
  expect((wide('b')?.x ?? 0) - (wide('a')?.x ?? 0)).toBeGreaterThanOrEqual(
    100 + 60,
  )
  const larger = tidyTree(steps, connections, {
    ...options,
    nodeSize: [200, 80],
  })
  const large = (id: string) => larger.find((one) => one.id === id)?.position
  expect((large('a')?.y ?? 0) - (large('root')?.y ?? 0)).toBe(80 + 30)
})

test('tidyTree lays out a forest and keeps unreachable steps in place', () => {
  const cycle = [step('x'), step('y')].map((one, index) => ({
    ...one,
    position: { x: 7 + index, y: 9 },
  }))
  const laid = tidyTree(
    [...steps, ...cycle],
    [...connections, link('x', 'y'), link('y', 'x')],
    options,
  )
  expect(laid.find((one) => one.id === 'x')?.position).toEqual({ x: 7, y: 9 })
  expect(tidyTree([], [], options)).toEqual([])
})

test('transfer round trips and rejects invalid text', () => {
  const type: FlowStepType = {
    id: 'send-email',
    label: 'Enviar e-mail',
    group: 'Ações',
    kind: 'action',
    description: 'Envia uma mensagem',
  }
  expect(FLOW_STEP_TRANSFER_TYPE).toBe('application/x-tc96-flow-step')
  expect(parseStepTransfer(serializeStepTransfer(type))).toEqual(type)
  expect(parseStepTransfer('{"id":"a","label":"A","group":"G"}')).toEqual({
    id: 'a',
    label: 'A',
    group: 'G',
  })
  for (const raw of [
    null,
    undefined,
    '',
    'not json',
    '42',
    'null',
    '{"id":"a"}',
    '{"id":"a","label":"A","group":"G","kind":"other"}',
    '{"id":"a","label":"A","group":"G","description":1}',
  ])
    expect(parseStepTransfer(raw)).toBeNull()
})

test('flowRunSummary counts completed only for success', () => {
  const summary = flowRunSummary(
    [step('a', 'success'), step('b', 'skipped'), step('c', 'running')],
    { id: 'run-1' },
  )
  expect(summary).toMatchObject({
    id: 'run-1',
    status: 'running',
    completed: 1,
    total: 3,
  })
  expect(
    flowRunSummary([step('a', 'success'), step('b', 'skipped')]),
  ).toMatchObject({ status: 'success', completed: 1, total: 2 })
  expect(flowRunSummary([step('a', 'skipped')]).completed).toBe(0)
})

test('flowRunSummary reports failed, not-run and partial runs', () => {
  const failed: FlowStep = {
    ...step('b'),
    run: { status: 'failed', note: 'Timeout' },
  }
  expect(flowRunSummary([step('a', 'success'), failed])).toMatchObject({
    status: 'failed',
    note: 'Timeout',
    completed: 1,
  })
  expect(flowRunSummary([step('a'), step('b', 'not-run')]).status).toBe(
    'not-run',
  )
  expect(flowRunSummary([]).status).toBe('not-run')
  expect(flowRunSummary([step('a', 'success'), step('b')]).status).toBe('idle')
})

test('incomingOf and outgoingOf filter by endpoint', () => {
  expect(incomingOf('a', connections).map((one) => one.id)).toEqual(['root-a'])
  expect(outgoingOf('a', connections).map((one) => one.id)).toEqual([
    'a-a1',
    'a-a2',
  ])
  expect(incomingOf('root', connections)).toEqual([])
  expect(outgoingOf('c', connections)).toEqual([])
})

test('core.ts does not import React or @xyflow/react', () => {
  const source = readFileSync(new URL('./core.ts', import.meta.url), 'utf8')
  expect(source).not.toContain("from 'react'")
  expect(source).not.toContain("from '@xyflow/react'")
})
