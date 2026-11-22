'use client'

import {
  type FlowConnection,
  type FlowRunSummary,
  type FlowStep,
  type FlowStepType,
  incomingOf,
  outgoingOf,
} from '@tc96/parttens/flow/canvas/core'
import { FlowInspector } from '@tc96/parttens/flow/inspector/composition/flow-inspector/flow-inspector'
import {
  type FlowInspectorDetail,
  FlowInspectorDetails,
} from '@tc96/parttens/flow/inspector/composition/flow-inspector-details/flow-inspector-details'
import { FlowInspectorLogs } from '@tc96/parttens/flow/inspector/composition/flow-inspector-logs/flow-inspector-logs'
import { FlowInspectorStatus } from '@tc96/parttens/flow/inspector/composition/flow-inspector-status/flow-inspector-status'
import type {
  FlowLogEntry,
  FlowStepStats,
} from '@tc96/parttens/flow/inspector/core'
import { defaultFlowRunCardLabels } from '@tc96/parttens/flow/step-library/core'
import { Button } from '@tc96/ui/button'
import { Trash2Icon } from 'lucide-react'
import { type ReactElement, type ReactNode, useId } from 'react'
import { StepForm } from './step-form'
import type { FlowOwner, FlowPageLabels, FlowStepValues } from './types'
import type { FlowPageState } from './use-flow-page-state'

export interface FlowStepInspectorProps {
  connections: readonly FlowConnection[]
  icons?: Record<string, ReactNode>
  labels: FlowPageLabels
  logs?: readonly FlowLogEntry[]
  onDelete: (stepId: string) => void
  onNext: (stepId: string) => void
  onRun?: () => void
  onSubmit: (values: FlowStepValues) => void
  owners?: readonly FlowOwner[]
  run?: FlowRunSummary
  state: FlowPageState
  step?: FlowStep
  stats?: FlowStepStats
  stepTypes: readonly FlowStepType[]
  steps: readonly FlowStep[]
  variant: 'owner' | 'path'
}

export function FlowStepInspector({
  connections,
  icons,
  labels,
  logs = [],
  onDelete,
  onNext,
  onRun,
  onSubmit,
  owners,
  run,
  state,
  step,
  stats,
  stepTypes,
  steps,
  variant,
}: Readonly<FlowStepInspectorProps>): ReactElement {
  const formId = useId()
  const { closeInspector, mode, setMode } = state
  const creating = mode === 'create'
  const open = state.inspectorOpen && (creating || step !== undefined)
  const type = stepTypes.find((item) => item.id === step?.type)
  const kind = step?.kind ?? type?.kind
  const typeLabel = type?.label ?? step?.type ?? ''
  const incoming = step ? incomingOf(step.id, connections) : []
  const outgoing = step ? outgoingOf(step.id, connections) : []
  const nameOf = (id: string) =>
    steps.find((item) => item.id === id)?.name ?? id

  const owner = owners?.find((item) => item.name === step?.owner?.name)
  const values: FlowStepValues =
    creating || !step
      ? {
          description: '',
          name: '',
          ownerId: undefined,
          path: '',
          type:
            (stepTypes.find((item) => item.kind !== 'trigger') ?? stepTypes[0])
              ?.id ?? '',
        }
      : {
          description: step.description ?? '',
          name: step.name,
          ownerId: owner?.id,
          path: incoming[0]?.label ?? '',
          type: step.type,
        }

  const runStatuses = {
    ...defaultFlowRunCardLabels.statuses,
    ...labels.runCard?.statuses,
  }
  const details: FlowInspectorDetail[] = [
    { id: 'type', label: labels.detailType, value: typeLabel },
    { id: 'name', label: labels.detailName, value: step?.name },
    {
      id: 'description',
      label: labels.detailDescription,
      value: step?.description,
    },
  ]
  if (variant === 'owner') {
    details.push(
      { id: 'owner', label: labels.detailOwner, owner: step?.owner },
      {
        id: 'inputs',
        label: labels.detailInputs,
        value: labels.stepCount(incoming.length),
      },
      {
        id: 'outputs',
        label: labels.detailOutputs,
        value: labels.stepCount(outgoing.length),
      },
    )
  } else {
    details.push(
      { id: 'path', label: labels.detailPath, value: incoming[0]?.label },
      {
        id: 'next',
        label: labels.detailNext,
        value: outgoing
          .map((connection) => nameOf(connection.target))
          .join(', '),
      },
      {
        id: 'last-run',
        label: labels.detailLastRun,
        value: step?.run ? runStatuses[step.run.status] : undefined,
      },
      { id: 'id', label: labels.detailId, value: step?.id },
    )
  }

  const entries =
    state.logFilter === 'step' && step
      ? logs.filter((entry) => entry.stepId === step.id)
      : logs

  const footer = (() => {
    if (mode === 'view')
      return (
        <>
          <Button onClick={() => setMode('edit')} variant="outline">
            {labels.edit}
          </Button>
          {outgoing[0] ? (
            <Button onClick={() => onNext(outgoing[0].target)}>
              {labels.next}
            </Button>
          ) : null}
        </>
      )
    return (
      <>
        <Button
          onClick={() => (creating ? closeInspector() : setMode('view'))}
          variant="outline"
        >
          {labels.cancel}
        </Button>
        <Button disabled={creating && state.locked} form={formId} type="submit">
          {creating ? labels.add : labels.save}
        </Button>
      </>
    )
  })()

  const build =
    mode === 'view' ? (
      <FlowInspectorDetails items={details} />
    ) : (
      <StepForm
        autoFocus
        formId={formId}
        icons={icons}
        key={`${mode}-${step?.id ?? 'new'}`}
        labels={labels}
        onSubmit={onSubmit}
        owners={owners}
        stepTypes={stepTypes}
        values={values}
        variant={variant}
      />
    )

  const badge = (() => {
    if (creating) return labels.notAdded
    if (mode === 'edit') return `${typeLabel} · ${step?.id}`
    return labels.viewing
  })()

  return (
    <FlowInspector
      badge={badge}
      build={build}
      disabledTabs={creating ? ['status', 'logs'] : []}
      headerActions={
        step && !creating && kind !== 'trigger' ? (
          <Button
            aria-label={labels.delete}
            disabled={state.locked}
            onClick={() => onDelete(step.id)}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2Icon aria-hidden="true" />
          </Button>
        ) : undefined
      }
      icon={step && !creating ? icons?.[step.type] : undefined}
      labels={labels.inspector}
      logs={
        <FlowInspectorLogs
          emptyActionLabel={labels.runEmptyAction}
          entries={entries}
          filter={state.logFilter}
          onEmptyAction={onRun}
          onFilterChange={state.setLogFilter}
        />
      }
      onClose={closeInspector}
      onTabChange={state.setTab}
      open={open}
      status={
        <FlowInspectorStatus
          durationMs={step?.run?.durationMs}
          runId={run?.id}
          stats={stats}
          status={step?.run?.status}
        />
      }
      tab={creating ? 'build' : state.tab}
      title={creating ? labels.newStep : (step?.name ?? '')}
      unconnected={
        mode !== 'create' &&
        step !== undefined &&
        kind !== 'trigger' &&
        incoming.length === 0
      }
    >
      {footer}
    </FlowInspector>
  )
}
