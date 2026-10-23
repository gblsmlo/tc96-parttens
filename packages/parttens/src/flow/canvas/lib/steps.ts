import {
  BoxIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  CopyIcon,
  EyeIcon,
  GitBranchIcon,
  GitBranchPlusIcon,
  type LucideIcon,
  MinusCircleIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
  ZapIcon,
} from 'lucide-react'
import type {
  FlowRunStatus,
  FlowStep,
  FlowStepAction,
  FlowStepKind,
  FlowStepType,
} from '../core'

export const flowKindIcons: Record<FlowStepKind, LucideIcon> = {
  action: PlayIcon,
  condition: GitBranchIcon,
  trigger: ZapIcon,
}

export const flowFallbackIcon: LucideIcon = BoxIcon

export const flowStatusIcons: Record<FlowRunStatus, LucideIcon> = {
  failed: CircleXIcon,
  idle: CircleDashedIcon,
  'not-run': CircleDashedIcon,
  running: PlayIcon,
  skipped: MinusCircleIcon,
  success: CircleCheckIcon,
}

export const flowActionIcons: Record<FlowStepAction, LucideIcon> = {
  'add-after': PlusIcon,
  'add-branch': GitBranchPlusIcon,
  delete: Trash2Icon,
  duplicate: CopyIcon,
  edit: PencilIcon,
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
const triggerHidden: readonly FlowStepAction[] = ['duplicate', 'delete']

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
