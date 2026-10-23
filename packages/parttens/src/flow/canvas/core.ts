import { hierarchy, tree } from 'd3-hierarchy'

export type FlowDirection = 'horizontal' | 'vertical'
export type FlowRunStatus =
  | 'idle'
  | 'running'
  | 'success'
  | 'failed'
  | 'skipped'
  | 'not-run'
export type FlowStepKind = 'trigger' | 'action' | 'condition'

export interface FlowStepType {
  id: string
  label: string
  group: string
  kind?: FlowStepKind
  description?: string
}

export interface FlowStepRun {
  status: FlowRunStatus
  durationMs?: number
  metrics?: readonly string[]
  note?: string
}

export interface FlowStep {
  id: string
  type: string
  name: string
  description?: string
  kind?: FlowStepKind
  owner?: { name: string; avatarUrl?: string }
  position: { x: number; y: number }
  run?: FlowStepRun
}

export interface FlowConnection {
  id: string
  source: string
  target: string
  label?: string
  sourceHandle?: string
  taken?: boolean
}

export interface FlowRunSummary {
  status: FlowRunStatus
  id?: string
  note?: string
  completed: number
  total: number
}

export type FlowStepAction =
  | 'add-after'
  | 'add-branch'
  | 'view'
  | 'edit'
  | 'duplicate'
  | 'delete'

export interface TidyTreeOptions {
  direction: FlowDirection
  nodeSize: readonly [number, number]
  gap: readonly [number, number]
}

export const flowStepNodeSize = [256, 100] as const

export const FLOW_STEP_TRANSFER_TYPE = 'application/x-tc96-flow-step'

const stepKinds: readonly string[] = ['trigger', 'action', 'condition']

export function serializeStepTransfer(type: FlowStepType) {
  return JSON.stringify(type)
}

export function parseStepTransfer(
  raw: string | null | undefined,
): FlowStepType | null {
  if (!raw) return null
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof value !== 'object' || value === null) return null
  const { id, label, group, kind, description } = value as Record<
    string,
    unknown
  >
  if (
    typeof id !== 'string' ||
    typeof label !== 'string' ||
    typeof group !== 'string'
  )
    return null
  if (
    kind !== undefined &&
    !(typeof kind === 'string' && stepKinds.includes(kind))
  )
    return null
  if (description !== undefined && typeof description !== 'string') return null
  return {
    id,
    label,
    group,
    ...(kind !== undefined && { kind: kind as FlowStepKind }),
    ...(description !== undefined && { description }),
  }
}

export function incomingOf(
  stepId: string,
  connections: readonly FlowConnection[],
) {
  return connections.filter((connection) => connection.target === stepId)
}

export function outgoingOf(
  stepId: string,
  connections: readonly FlowConnection[],
) {
  return connections.filter((connection) => connection.source === stepId)
}

interface TreeNode {
  id: string | null
  children: TreeNode[]
}

export function tidyTree(
  steps: readonly FlowStep[],
  connections: readonly FlowConnection[],
  options: TidyTreeOptions,
): FlowStep[] {
  const { direction, nodeSize, gap } = options
  const ids = new Set(steps.map((step) => step.id))
  const nodes = new Map<string, TreeNode>(
    steps.map((step) => [step.id, { id: step.id, children: [] }]),
  )
  const placed = new Set<string>()
  const roots = steps.filter(
    (step) =>
      !connections.some(
        (connection) =>
          connection.target === step.id &&
          connection.source !== step.id &&
          ids.has(connection.source),
      ),
  )
  const rootNodes: TreeNode[] = []
  const stack: TreeNode[] = []
  for (const root of roots) {
    const node = nodes.get(root.id)
    if (!node) continue
    rootNodes.push(node)
    placed.add(root.id)
    stack.push(node)
    while (stack.length) {
      const current = stack.pop()
      if (!current?.id) continue
      for (const connection of outgoingOf(current.id, connections)) {
        const child = nodes.get(connection.target)
        if (!child || placed.has(connection.target)) continue
        placed.add(connection.target)
        current.children.push(child)
        stack.push(child)
      }
    }
  }
  if (!rootNodes.length) return steps.map((step) => ({ ...step }))

  const virtualRoot: TreeNode = { id: null, children: rootNodes }
  const [width, height] = nodeSize
  const [gapX, gapY] = gap
  const horizontal = direction === 'horizontal'
  const breadth = horizontal ? height + gapY : width + gapX
  const depth = horizontal ? width + gapX : height + gapY
  const layout = tree<TreeNode>()
    .nodeSize([breadth, depth])
    .separation(() => 1)(hierarchy(virtualRoot, (node) => node.children))

  const positions = new Map<string, { x: number; y: number }>()
  for (const node of layout.descendants()) {
    if (node.data.id === null) continue
    const across = node.x - (horizontal ? height : width) / 2
    const along = node.y - depth
    positions.set(
      node.data.id,
      horizontal ? { x: along, y: across } : { x: across, y: along },
    )
  }
  const values = [...positions.values()]
  const minX = Math.min(...values.map((position) => position.x))
  const minY = Math.min(...values.map((position) => position.y))

  return steps.map((step) => {
    const position = positions.get(step.id)
    if (!position) return { ...step }
    return {
      ...step,
      position: { x: position.x - minX, y: position.y - minY },
    }
  })
}

export function flowRunSummary(
  steps: readonly FlowStep[],
  options: { id?: string } = {},
): FlowRunSummary {
  const total = steps.length
  const completed = steps.filter(
    (step) => step.run?.status === 'success',
  ).length
  const failed = steps.find((step) => step.run?.status === 'failed')
  const summary = { id: options.id, completed, total }
  if (failed) return { ...summary, status: 'failed', note: failed.run?.note }
  if (steps.some((step) => step.run?.status === 'running'))
    return { ...summary, status: 'running' }
  if (
    completed > 0 &&
    steps.every(
      (step) =>
        step.run?.status === 'success' || step.run?.status === 'skipped',
    )
  )
    return { ...summary, status: 'success' }
  if (
    steps.every(
      (step) =>
        !step.run ||
        step.run.status === 'not-run' ||
        step.run.status === 'idle',
    )
  )
    return { ...summary, status: 'not-run' }
  return { ...summary, status: 'idle' }
}
