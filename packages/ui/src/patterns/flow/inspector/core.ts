import type { FlowRunStatus } from '../canvas/core'

export type FlowInspectorTab = 'build' | 'status' | 'logs'
export type FlowLogFilter = 'step' | 'all'

export const flowInspectorTabs: readonly FlowInspectorTab[] = [
  'build',
  'status',
  'logs',
]

export interface FlowLogEntry {
  id: string
  stepId: string
  stepName: string
  status: FlowRunStatus
  sequence: number
  description?: string
}

export interface FlowStepStats {
  entered: number
  completed: number
}

export function flowStepAbandonment(stats: FlowStepStats): number | null {
  if (stats.entered <= 0) return null
  const abandoned = Math.max(stats.entered - stats.completed, 0)
  return Math.round((abandoned / stats.entered) * 100)
}

export function formatFlowDuration(durationMs: number | undefined) {
  if (durationMs === undefined || durationMs < 0) return null
  if (durationMs < 1000) return `${Math.round(durationMs)} ms`
  const seconds = durationMs / 1000
  if (seconds < 60)
    return `${seconds.toFixed(seconds < 10 ? 1 : 0).replace('.', ',')} s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min ${Math.round(seconds - minutes * 60)} s`
}
