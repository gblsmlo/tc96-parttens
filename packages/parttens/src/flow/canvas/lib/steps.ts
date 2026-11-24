import {
  CheckCircleIcon,
  CircleDashedIcon,
  CopyIcon,
  CubeIcon,
  EyeIcon,
  GitBranchIcon,
  GitDiffIcon,
  LightningIcon,
  MinusCircleIcon,
  PencilSimpleIcon,
  type Icon as PhosphorIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type {
  FlowRunStatus,
  FlowStep,
  FlowStepAction,
  FlowStepKind,
  FlowStepType,
} from '../core'

export const flowKindIcons: Record<FlowStepKind, PhosphorIcon> = {
  action: PlayIcon,
  condition: GitBranchIcon,
  trigger: LightningIcon,
}

export const flowFallbackIcon: PhosphorIcon = CubeIcon

export const flowStatusIcons: Record<FlowRunStatus, PhosphorIcon> = {
  failed: XCircleIcon,
  idle: CircleDashedIcon,
  'not-run': CircleDashedIcon,
  running: PlayIcon,
  skipped: MinusCircleIcon,
  success: CheckCircleIcon,
}

export const flowActionIcons: Record<FlowStepAction, PhosphorIcon> = {
  'add-after': PlusIcon,
  'add-branch': GitDiffIcon,
  delete: TrashIcon,
  duplicate: CopyIcon,
  edit: PencilSimpleIcon,
  view: EyeIcon,
}

const toolbarActions: readonly FlowStepAction[] = [
  'add-after',
  'view',
  'edit',
  'duplicate',
  'delete',
]
const menuActions: readonly FlowStepAction[] = [
  'view',
  'edit',
  'add-branch',
  'delete',
]
const mutatingActions: readonly FlowStepAction[] = [
  'add-after',
  'add-branch',
  'duplicate',
  'delete',
]
const triggerHidden: readonly FlowStepAction[] = ['duplicate', 'delete']

export function isMutatingAction(action: FlowStepAction): boolean {
  return mutatingActions.includes(action)
}

export function resolveStepKind(
  step: FlowStep,
  stepTypes: readonly FlowStepType[] | undefined,
): FlowStepKind {
  return (
    step.kind ??
    stepTypes?.find((type) => type.id === step.type)?.kind ??
    'action'
  )
}

export function resolveStepTypeLabel(
  step: FlowStep,
  stepTypes: readonly FlowStepType[] | undefined,
): string {
  return stepTypes?.find((type) => type.id === step.type)?.label ?? step.type
}

export function stepActionsFor(
  kind: FlowStepKind,
  variant: 'toolbar' | 'menu',
): FlowStepAction[] {
  const actions = variant === 'toolbar' ? toolbarActions : menuActions
  return actions.filter(
    (action) => kind !== 'trigger' || !triggerHidden.includes(action),
  )
}

export function formatStepDuration(durationMs: number): string {
  if (durationMs < 1000) return `${Math.round(durationMs)}ms`
  return `${(durationMs / 1000).toFixed(1)}s`
}
