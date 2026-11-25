'use client'

import { flowRunSummary } from '@tc96/ui/patterns/flow/canvas/core'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useMemo } from 'react'
import { createFlowEditorHandlers } from '../../../shared/create-flow-editor-handlers'
import { FlowAssistant } from '../../../shared/flow-assistant'
import { FlowPageLayout } from '../../../shared/flow-page-layout'
import { FlowStepInspector } from '../../../shared/flow-step-inspector'
import { agentPageLabels, resolveFlowPageLabels } from '../../../shared/labels'
import type { FlowEditorProps } from '../../../shared/types'
import { useFlowPageState } from '../../../shared/use-flow-page-state'
import {
  Flow2Actions,
  Flow2Canvas,
  Flow2Dialogs,
  Flow2Library,
  Flow2Menu,
} from '../../partials'

export interface Flow2Props extends FlowEditorProps {
  actionsContainer?: Element | null
  onClearResults?: () => void
  onRestoreExample?: () => void
}

export function Flow2(props: Readonly<Flow2Props>): ReactElement {
  const {
    actionsContainer,
    assistant,
    breadcrumbs,
    className,
    connections,
    icons,
    labels: labelsProp,
    loading = false,
    logs,
    name,
    onConnect,
    onConnectionsChange,
    onClearResults,
    onCopyJson,
    onRestoreExample,
    onRun,
    onSelectedStepChange,
    onStepsChange,
    onStepsChangeEnd,
    owners,
    renderLink = renderAnchor,
    run,
    running = false,
    selectedStepId,
    stepStats,
    stepTypes,
    steps,
  } = props
  const labels = useMemo(
    () => resolveFlowPageLabels(agentPageLabels, labelsProp),
    [labelsProp],
  )
  const state = useFlowPageState()
  const editor = createFlowEditorHandlers(props, state)
  const summary = run ?? flowRunSummary(steps)

  return (
    <>
      <FlowPageLayout
        canvas={
          <Flow2Canvas
            connections={connections}
            icons={icons}
            labels={labels}
            loading={loading}
            locked={state.locked}
            onConnect={onConnect}
            onConnectionsChange={onConnectionsChange}
            onSelect={onSelectedStepChange}
            onStepAction={editor.onStepAction}
            onStepDrop={editor.onStepDrop}
            onStepsChange={onStepsChange}
            onStepsChangeEnd={onStepsChangeEnd}
            onTidy={() => editor.tidy('vertical')}
            selectedStepId={selectedStepId}
            stepTypes={stepTypes}
            steps={steps}
          />
        }
        className={className}
        framed={actionsContainer === undefined}
        header={
          <Flow2Actions
            actionsContainer={actionsContainer}
            addStepDisabled={state.locked}
            breadcrumbs={breadcrumbs}
            labels={labels}
            name={name}
            onAddStep={() => state.openInspector('create')}
            onAskAi={assistant ? () => state.setAssistantOpen(true) : undefined}
            onRun={onRun}
            renderLink={renderLink}
            running={running}
          >
            <Flow2Menu
              labels={labels}
              onClearResults={
                onClearResults
                  ? () => state.setConfirmingClear(true)
                  : undefined
              }
              onCopyJson={onCopyJson}
              onRestoreExample={onRestoreExample}
            />
          </Flow2Actions>
        }
        inspector={
          <FlowStepInspector
            connections={connections}
            icons={icons}
            labels={labels}
            logs={logs}
            onDelete={editor.requestDelete}
            onNext={(stepId) => onSelectedStepChange?.(stepId)}
            onRun={onRun}
            onSubmit={editor.onSubmit}
            owners={owners}
            run={summary}
            state={state}
            stats={editor.selectedStep && stepStats?.[editor.selectedStep.id]}
            step={editor.selectedStep}
            stepTypes={stepTypes}
            steps={steps}
            variant="path"
          />
        }
        overlay={
          assistant ? (
            <FlowAssistant
              assistant={assistant}
              labels={labels}
              state={state}
            />
          ) : null
        }
        renderLibrary={(collapsed) => (
          <Flow2Library
            collapsed={collapsed}
            disabled={state.locked}
            icons={icons}
            labels={labels}
            loading={loading}
            onAdd={editor.onLibraryAdd}
            run={steps.length > 0 ? summary : undefined}
            stepTypes={stepTypes}
          />
        )}
      />
      <Flow2Dialogs
        clearOpen={state.confirmingClear}
        connections={connections}
        labels={labels}
        onClearOpenChange={state.setConfirmingClear}
        onClearResults={onClearResults}
        onDelete={editor.deleteStep}
        onPendingDeleteChange={state.setPendingDelete}
        pendingDelete={state.pendingDelete}
        pendingDeleteName={editor.pendingDeleteName}
      />
    </>
  )
}
