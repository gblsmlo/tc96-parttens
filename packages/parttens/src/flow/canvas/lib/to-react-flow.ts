import { MarkerType, type NodeChange, Position } from '@xyflow/react'
import type { FlowConnection, FlowDirection, FlowStep } from '../core'
import type { FlowConnectInput, FlowEdgeType, FlowNodeType } from '../types'

export type MeasuredSizes = Readonly<
  Record<string, { width: number; height: number }>
>

export interface ToNodesOptions {
  connections: readonly FlowConnection[]
  describe: (step: FlowStep) => string
  direction: FlowDirection
  measured?: MeasuredSizes
  roleDescription: string
  selectedStepId?: string | null
}

export function handlePositions(direction: FlowDirection) {
  return direction === 'vertical'
    ? { source: Position.Bottom, target: Position.Top }
    : { source: Position.Right, target: Position.Left }
}

export function toNodes(
  steps: readonly FlowStep[],
  options: ToNodesOptions,
): FlowNodeType[] {
  const {
    connections,
    describe,
    direction,
    measured,
    roleDescription,
    selectedStepId,
  } = options
  const { source, target } = handlePositions(direction)
  const parents = new Set(connections.map((connection) => connection.source))
  return steps.map((step) => ({
    ariaLabel: describe(step),
    ariaRole: 'group',
    className: 'group/step outline-none',
    data: { leaf: !parents.has(step.id), step },
    deletable: false,
    domAttributes: { 'aria-roledescription': roleDescription },
    id: step.id,
    measured: measured?.[step.id],
    position: { x: step.position.x, y: step.position.y },
    selected: step.id === selectedStepId,
    sourcePosition: source,
    targetPosition: target,
    type: 'step',
  }))
}

export function toEdges(
  connections: readonly FlowConnection[],
): FlowEdgeType[] {
  return connections.map((connection) => ({
    animated: connection.taken === true,
    data: { connection },
    focusable: false,
    id: connection.id,
    markerEnd: { height: 16, type: MarkerType.ArrowClosed, width: 16 },
    selectable: false,
    source: connection.source,
    target: connection.target,
    type: 'step',
  }))
}

export function stepsFromNodes(
  nodes: readonly FlowNodeType[],
  steps: readonly FlowStep[],
): FlowStep[] {
  const positions = new Map(nodes.map((node) => [node.id, node.position]))
  return steps.map((step) => {
    const position = positions.get(step.id)
    if (!position) return { ...step }
    return { ...step, position: { x: position.x, y: position.y } }
  })
}

export function connectionsFromEdges(
  edges: readonly FlowEdgeType[],
  connections: readonly FlowConnection[],
): FlowConnection[] {
  const ids = new Set(edges.map((edge) => edge.id))
  return connections.filter((connection) => ids.has(connection.id))
}

export function connectionFromReactFlow(connection: {
  source: string
  target: string
  sourceHandle?: string | null
}): FlowConnectInput {
  return {
    source: connection.source,
    target: connection.target,
    ...(connection.sourceHandle
      ? { sourceHandle: connection.sourceHandle }
      : {}),
  }
}

export function moveSteps(
  steps: readonly FlowStep[],
  changes: readonly NodeChange<FlowNodeType>[],
): FlowStep[] | null {
  const moves = new Map<string, { x: number; y: number }>()
  for (const change of changes) {
    if (change.type === 'position' && change.position)
      moves.set(change.id, change.position)
  }
  if (!moves.size) return null
  return steps.map((step) => {
    const position = moves.get(step.id)
    return position ? { ...step, position: { ...position } } : { ...step }
  })
}

export function measuredFromChanges(
  current: MeasuredSizes,
  changes: readonly NodeChange<FlowNodeType>[],
): MeasuredSizes {
  let next: Record<string, { width: number; height: number }> | undefined
  for (const change of changes) {
    if (change.type !== 'dimensions' || !change.dimensions) continue
    const { width, height } = change.dimensions
    const known = current[change.id]
    if (known?.width === width && known.height === height) continue
    next ??= { ...current }
    next[change.id] = { height, width }
  }
  return next ?? current
}

export function selectionFromChanges(
  changes: readonly NodeChange<FlowNodeType>[],
  current: string | null,
): { changed: boolean; id: string | null } {
  const selected = changes.find(
    (change) => change.type === 'select' && change.selected,
  )
  if (selected && 'id' in selected)
    return { changed: selected.id !== current, id: selected.id }
  const deselected = changes.some(
    (change) =>
      change.type === 'select' && !change.selected && change.id === current,
  )
  return deselected
    ? { changed: true, id: null }
    : { changed: false, id: current }
}
