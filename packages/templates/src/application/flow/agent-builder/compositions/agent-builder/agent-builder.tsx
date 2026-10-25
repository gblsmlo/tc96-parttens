'use client'

import { flowRunSummary } from '@tc96/parttens/flow/canvas/core'
import { type ReactElement, useMemo } from 'react'
import { createFlowEditorHandlers } from '../../../shared/create-flow-editor-handlers'
import { FlowAssistant } from '../../../shared/flow-assistant'
import { FlowPageLayout } from '../../../shared/flow-page-layout'
import { FlowStepInspector } from '../../../shared/flow-step-inspector'
import { agentPageLabels, resolveFlowPageLabels } from '../../../shared/labels'
import { renderAnchor } from '../../../shared/render-link'
import type { FlowEditorProps } from '../../../shared/types'
import { useFlowPageState } from '../../../shared/use-flow-page-state'
import {
  AgentBuilderActions,
  AgentBuilderCanvas,
  AgentBuilderDialogs,
  AgentBuilderLibrary,
  AgentBuilderMenu,
} from '../../partials'

export interface AgentBuilderProps extends FlowEditorProps {
  actionsContainer?: Element | null
  onClearResults?: () => void
  onRestoreExample?: () => void
}

export function AgentBuilder(props: Readonly<AgentBuilderProps>): ReactElement {
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
          <AgentBuilderCanvas
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
          <AgentBuilderActions
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
            <AgentBuilderMenu
              labels={labels}
              onClearResults={
                onClearResults
                  ? () => state.setConfirmingClear(true)
                  : undefined
              }
              onCopyJson={onCopyJson}
              onRestoreExample={onRestoreExample}
            />
          </AgentBuilderActions>
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
          <AgentBuilderLibrary
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
      <AgentBuilderDialogs
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
