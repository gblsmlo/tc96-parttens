import { Avatar, AvatarFallback, AvatarImage } from '@tc96/elements/avatar'
import { Badge, type BadgeProps } from '@tc96/ui/badge'
import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { Handle, type NodeProps } from '@xyflow/react'
import { PlusIcon } from 'lucide-react'
import { memo, type ReactElement } from 'react'
import type { FlowRunStatus } from '../core'
import { formatStepDuration, resolveStepKind } from '../lib/steps'
import { handlePositions } from '../lib/to-react-flow'
import {
  flowHandleClassName,
  flowNodeAddLeafClassName,
  flowStatusTextVariants,
  flowStepNodeDescriptionClassName,
  flowStepNodeFooterClassName,
  flowStepNodeHeaderClassName,
  flowStepNodeTextClassName,
  flowStepNodeTitleClassName,
  flowStepNodeVariants,
} from '../lib/variants'
import { useFlowCanvasContext } from '../store/flow-canvas-context'
import type { FlowNodeType } from '../types'
import { FlowControlButton } from './flow-control-button'
import { FlowStatusIcon } from './flow-status-icon'
import { FlowStepContextMenu } from './flow-step-context-menu'
import { FlowStepIcon } from './flow-step-icon'
import { FlowStepMenu } from './flow-step-menu'
import { FlowStepToolbar } from './flow-step-toolbar'

const statusBadgeVariants: Record<FlowRunStatus, BadgeProps['variant']> = {
  failed: 'destructive',
  idle: 'outline',
  'not-run': 'outline',
  running: 'outline',
  skipped: 'secondary',
  success: 'outline',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function FlowStepNodeView({
  data,
  selected,
}: Readonly<NodeProps<FlowNodeType>>): ReactElement {
  const { step, leaf } = data
  const { direction, labels, locked, onStepAction, stepMenu, stepTypes } =
    useFlowCanvasContext('FlowStepNode')
  const kind = resolveStepKind(step, stepTypes)
  const status: FlowRunStatus = step.run?.status ?? 'not-run'
  const positions = handlePositions(direction)
  const vertical = direction === 'vertical'
  const metrics = step.run?.metrics?.join(' · ')
  const duration =
    step.run?.durationMs === undefined
      ? undefined
      : formatStepDuration(step.run.durationMs)
  const showFooter = vertical
    ? Boolean(step.run)
    : Boolean(step.owner) || duration !== undefined

  return (
    <>
      <FlowStepToolbar step={step} visible={selected} />
      <FlowStepContextMenu
        className="w-64"
        data-kind={kind}
        data-slot="flow-step-node"
        data-status={status}
        step={step}
      >
        <Card className={cn(flowStepNodeVariants({ selected }))}>
          <div className={flowStepNodeHeaderClassName}>
            <FlowStepIcon kind={kind} step={step} />
            <div className={flowStepNodeTextClassName}>
              <span className={flowStepNodeTitleClassName}>{step.name}</span>
              {step.description ? (
                <span className={flowStepNodeDescriptionClassName}>
                  {step.description}
                </span>
              ) : null}
            </div>
            {stepMenu ? (
              <FlowStepMenu step={step} />
            ) : (
              <Badge variant={statusBadgeVariants[status]}>
                {labels.statuses[status]}
              </Badge>
            )}
          </div>
          {showFooter ? (
            <div className={flowStepNodeFooterClassName}>
              {vertical ? (
                <>
                  <span className={flowStatusTextVariants({ status })}>
                    <FlowStatusIcon status={status} />
                    <span className="truncate">
                      {metrics ?? labels.statuses[status]}
                    </span>
                  </span>
                  <Badge
                    className="ms-auto"
                    variant={statusBadgeVariants[status]}
                  >
                    {labels.statuses[status]}
                  </Badge>
                </>
              ) : (
                <>
                  {step.owner ? (
                    <Avatar size="xs">
                      {step.owner.avatarUrl ? (
                        <AvatarImage alt="" src={step.owner.avatarUrl} />
                      ) : null}
                      <AvatarFallback className="text-foreground">
                        {initials(step.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  {duration ? (
                    <span className="ms-auto tabular-nums">{duration}</span>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </Card>
      </FlowStepContextMenu>
      {kind === 'trigger' ? null : (
        <Handle
          role="button"
          aria-label={labels.targetHandle(step.name)}
          className={flowHandleClassName}
          position={positions.target}
          type="target"
        />
      )}
      <Handle
        role="button"
        aria-label={labels.sourceHandle(step.name)}
        className={flowHandleClassName}
        position={positions.source}
        type="source"
      />
      {vertical && leaf ? (
        <div className={flowNodeAddLeafClassName}>
          <FlowControlButton
            disabled={locked}
            label={labels.addAfterLeaf(step.name)}
            onClick={() => onStepAction?.('add-after', step.id)}
            size="icon-xs"
            tooltip={labels.menuActions['add-after']}
            variant="outline"
          >
            <PlusIcon aria-hidden="true" />
          </FlowControlButton>
        </div>
      ) : null}
    </>
  )
}

export const FlowStepNode = memo(FlowStepNodeView)
