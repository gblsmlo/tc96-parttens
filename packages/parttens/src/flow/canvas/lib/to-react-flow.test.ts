import { expect, test } from 'bun:test'
import { Position } from '@xyflow/react'
import type { FlowConnection, FlowStep } from '../core'
import {
  connectionFromReactFlow,
  connectionsFromEdges,
  measuredFromChanges,
  moveSteps,
  selectionFromChanges,
  stepsFromNodes,
  toEdges,
  toNodes,
} from './to-react-flow'

const steps: FlowStep[] = [
  { id: 'a', name: 'A', position: { x: 0, y: 0 }, type: 'form' },
  { id: 'b', name: 'B', position: { x: 100, y: 40 }, type: 'mail' },
]
const connections: FlowConnection[] = [
  { id: 'a-b', label: 'Sim', source: 'a', target: 'b', taken: true },
]
const options = {
  connections,
  describe: (step: FlowStep) => step.name,
  direction: 'horizontal' as const,
  roleDescription: 'passo',
  selectedStepId: 'b',
}

test('toNodes maps steps to nodes with selection, leaf and handle sides', () => {
  const nodes = toNodes(steps, options)
  expect(nodes.map((node) => node.id)).toEqual(['a', 'b'])
  expect(nodes[1]?.selected).toBe(true)
  expect(nodes[0]?.selected).toBe(false)
  expect(nodes[0]?.data.leaf).toBe(false)
  expect(nodes[1]?.data.leaf).toBe(true)
  expect(nodes[0]?.sourcePosition).toBe(Position.Right)
  expect(nodes[0]?.targetPosition).toBe(Position.Left)
  expect(nodes[1]?.position).toEqual({ x: 100, y: 40 })
  expect(nodes[1]?.ariaLabel).toBe('B')
  expect(nodes[1]?.ariaRole).toBe('group')
})

test('toNodes puts the handles on top and bottom when vertical', () => {
  const [node] = toNodes(steps, { ...options, direction: 'vertical' })
  expect(node?.sourcePosition).toBe(Position.Bottom)
  expect(node?.targetPosition).toBe(Position.Top)
})

test('toEdges animates taken connections and keeps the connection in data', () => {
  const [edge] = toEdges([
    ...connections,
    { id: 'b-a', source: 'b', target: 'a' },
  ])
  expect(edge?.animated).toBe(true)
  expect(edge?.data?.connection).toBe(connections[0])
  expect(toEdges([{ id: 'x', source: 'a', target: 'b' }])[0]?.animated).toBe(
    false,
  )
})

test('stepsFromNodes returns the steps with the positions of the nodes', () => {
  const nodes = toNodes(steps, options).map((node) =>
    node.id === 'a' ? { ...node, position: { x: 7, y: 9 } } : node,
  )
  const next = stepsFromNodes(nodes, steps)
  expect(next[0]?.position).toEqual({ x: 7, y: 9 })
  expect(next[1]?.position).toEqual({ x: 100, y: 40 })
  expect(steps[0]?.position).toEqual({ x: 0, y: 0 })
})

test('connectionsFromEdges keeps only the connections that still have an edge', () => {
  const edges = toEdges(connections)
  expect(connectionsFromEdges(edges, connections)).toEqual(connections)
  expect(connectionsFromEdges([], connections)).toEqual([])
})

test('connectionFromReactFlow drops a null sourceHandle', () => {
  expect(
    connectionFromReactFlow({ source: 'a', sourceHandle: null, target: 'b' }),
  ).toEqual({ source: 'a', target: 'b' })
  expect(
    connectionFromReactFlow({ source: 'a', sourceHandle: 'yes', target: 'b' }),
  ).toEqual({ source: 'a', sourceHandle: 'yes', target: 'b' })
})

test('moveSteps applies position changes and ignores the rest', () => {
  expect(
    moveSteps(steps, [
      { dragging: true, id: 'a', position: { x: 5, y: 6 }, type: 'position' },
    ])?.[0]?.position,
  ).toEqual({ x: 5, y: 6 })
  expect(
    moveSteps(steps, [{ id: 'a', selected: true, type: 'select' }]),
  ).toBeNull()
})

test('selectionFromChanges reports a new selection or a deselection of the current one', () => {
  expect(
    selectionFromChanges(
      [
        { id: 'a', selected: false, type: 'select' },
        { id: 'b', selected: true, type: 'select' },
      ],
      'a',
    ),
  ).toEqual({ changed: true, id: 'b' })
  expect(
    selectionFromChanges([{ id: 'a', selected: false, type: 'select' }], 'a'),
  ).toEqual({ changed: true, id: null })
  expect(
    selectionFromChanges([{ id: 'b', selected: false, type: 'select' }], 'a'),
  ).toEqual({ changed: false, id: 'a' })
  expect(
    selectionFromChanges([{ id: 'a', selected: true, type: 'select' }], 'a')
      .changed,
  ).toBe(false)
})

test('measuredFromChanges records new sizes and keeps the reference when nothing changed', () => {
  const first = measuredFromChanges({}, [
    { dimensions: { height: 90, width: 256 }, id: 'a', type: 'dimensions' },
  ])
  expect(first).toEqual({ a: { height: 90, width: 256 } })
  expect(
    measuredFromChanges(first, [
      { dimensions: { height: 90, width: 256 }, id: 'a', type: 'dimensions' },
    ]),
  ).toBe(first)
})
