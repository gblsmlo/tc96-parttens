'use client'

import { FlowCanvas } from '@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas'
import { FlowCanvasControls } from '@tc96/parttens/flow/canvas/composition/flow-canvas-controls/flow-canvas-controls'
import { flowRunSummary } from '@tc96/parttens/flow/canvas/core'
import { FlowRunCard } from '@tc96/parttens/flow/step-library/composition/flow-run-card/flow-run-card'
import { FlowStepLibrary } from '@tc96/parttens/flow/step-library/composition/step-library/step-library'
import { groupStepTypes } from '@tc96/parttens/flow/step-library/core'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { NetworkIcon } from 'lucide-react'
import { type ReactElement, useMemo } from 'react'
import { createFlowEditorHandlers } from '../shared/create-flow-editor-handlers'
import { FlowAssistant } from '../shared/flow-assistant'
import { FlowConfirmDialog } from '../shared/flow-confirm-dialog'
import { FlowDeleteDialog } from '../shared/flow-delete-dialog'
import { FlowPageHeader } from '../shared/flow-page-header'
import { FlowPageLayout } from '../shared/flow-page-layout'
import { FlowStepInspector } from '../shared/flow-step-inspector'
import { FlowToolButton } from '../shared/flow-tool-button'
import { agentPageLabels, resolveFlowPageLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import type { FlowEditorProps } from '../shared/types'
import { useFlowPageState } from '../shared/use-flow-page-state'

export interface AgentBuilderProps extends FlowEditorProps {
  onClearResults?: () => void
  onRestoreExample?: () => void
}

export function AgentBuilder(props: Readonly<AgentBuilderProps>): ReactElement {
  const {
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
  const groups = useMemo(() => groupStepTypes(stepTypes), [stepTypes])

  return (
    <>
      <FlowPageLayout
        canvas={
          <FlowCanvas
            connections={connections}
            direction="vertical"
            icons={icons}
            labels={labels.canvas}
            loading={loading}
            onConnect={onConnect}
            onConnectionsChange={onConnectionsChange}
            onSelect={onSelectedStepChange}
            onStepAction={editor.onStepAction}
            onStepDrop={editor.onStepDrop}
            onStepsChange={onStepsChange}
            onStepsChangeEnd={onStepsChangeEnd}
            selectedStepId={selectedStepId}
            stepTypes={stepTypes}
            steps={steps}
          >
            <FlowCanvasControls>
              <FlowToolButton
                disabled={state.locked}
                label={labels.organizeTree}
                onClick={() => editor.tidy('vertical')}
                size="sm"
              >
                <NetworkIcon aria-hidden="true" />
                {labels.organizeTree}
              </FlowToolButton>
            </FlowCanvasControls>
          </FlowCanvas>
        }
        className={className}
        header={
          <FlowPageHeader
            breadcrumbs={breadcrumbs}
            labels={labels}
            name={name}
            addStepDisabled={state.locked}
            onAddStep={() => state.openInspector('create')}
            onAskAi={assistant ? () => state.setAssistantOpen(true) : undefined}
            onRun={onRun}
            renderLink={renderLink}
            running={running}
          >
            {onClearResults ? (
              <MenuItem onClick={() => state.setConfirmingClear(true)}>
                {labels.clearResults}
              </MenuItem>
            ) : null}
            {onRestoreExample ? (
              <MenuItem onClick={onRestoreExample}>
                {labels.restoreExample}
              </MenuItem>
            ) : null}
            {onCopyJson ? (
              <>
                {onClearResults || onRestoreExample ? <MenuSeparator /> : null}
                <MenuItem onClick={onCopyJson}>{labels.copyJson}</MenuItem>
              </>
            ) : null}
          </FlowPageHeader>
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
          <FlowStepLibrary
            collapsed={collapsed}
            groups={groups}
            icons={icons}
            labels={labels.library}
            loading={loading}
            disabled={state.locked}
            onAdd={editor.onLibraryAdd}
          >
            {steps.length > 0 ? (
              <FlowRunCard labels={labels.runCard} run={summary} />
            ) : null}
          </FlowStepLibrary>
        )}
      />
      <FlowConfirmDialog
        cancelLabel={labels.cancel}
        confirmLabel={labels.clearResults}
        description={labels.clearDialogDescription}
        onConfirm={() => onClearResults?.()}
        onOpenChange={state.setConfirmingClear}
        open={state.confirmingClear}
        title={labels.clearDialogTitle}
      />
      <FlowDeleteDialog
        connections={connections}
        labels={labels}
        onDelete={editor.deleteStep}
        state={state}
        stepName={editor.pendingDeleteName}
      />
    </>
  )
}
