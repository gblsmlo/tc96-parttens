import type { FlowRunStatus } from '../../canvas/core'
import type { FlowInspectorTab } from '../core'

export interface FlowInspectorLabels {
  title: string
  close: string
  tabsLabel: string
  tabs: Record<FlowInspectorTab, string>
  details: string
  lastRun: string
  state: string
  duration: string
  run: string
  testRuns: string
  entered: string
  completed: string
  abandonment: string
  noRunNote: string
  statuses: Record<FlowRunStatus, string>
  logFilter: string
  logThisStep: string
  logAllSteps: string
  logCount: (count: number) => string
  logsEmptyTitle: string
  logsEmptyDescription: string
  unconnectedTitle: string
  unconnectedDescription: string
  empty: string
}
