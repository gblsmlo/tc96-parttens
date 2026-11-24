import type { FlowRunSummary } from '@tc96/ui/patterns'
import { failedRun, notRunRun, passedRun } from './fixtures/runs'

export const stepLibraryRunNames = ['failed', 'success', 'not-run'] as const

export type StepLibraryRunName = (typeof stepLibraryRunNames)[number]

export const stepLibraryRuns: Record<StepLibraryRunName, FlowRunSummary> = {
  failed: failedRun,
  'not-run': notRunRun,
  success: passedRun,
}
