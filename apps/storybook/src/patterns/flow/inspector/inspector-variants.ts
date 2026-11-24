import type { FlowInspectorTab, FlowRunStatus } from '@tc96/ui/patterns'

export const inspectorTabNames = [
  'build',
  'status',
  'logs',
] as const satisfies readonly FlowInspectorTab[]

export const inspectorRunStatusNames = [
  'failed',
  'success',
  'running',
  'skipped',
  'idle',
  'not-run',
] as const satisfies readonly FlowRunStatus[]

export const inspectorLogSetNames = ['entries', 'empty'] as const

export type InspectorLogSetName = (typeof inspectorLogSetNames)[number]
