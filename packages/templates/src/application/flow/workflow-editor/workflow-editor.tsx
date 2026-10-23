'use client'

import { FlowCanvas } from '@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas'
import { FlowCanvasControls } from '@tc96/parttens/flow/canvas/composition/flow-canvas-controls/flow-canvas-controls'
import { FlowCanvasMinimap } from '@tc96/parttens/flow/canvas/composition/flow-canvas-minimap/flow-canvas-minimap'
import { flowRunSummary } from '@tc96/parttens/flow/canvas/core'
import { FlowRunCard } from '@tc96/parttens/flow/step-library/composition/flow-run-card/flow-run-card'
import { FlowStepLibrary } from '@tc96/parttens/flow/step-library/composition/step-library/step-library'
import { groupStepTypes } from '@tc96/parttens/flow/step-library/core'
import { Group } from '@tc96/ui/group'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
} from '@tc96/ui/menu'
import { LockIcon, LockOpenIcon, Redo2Icon, Undo2Icon } from 'lucide-react'
import { type ReactElement, useMemo } from 'react'
import { FlowAssistant } from '../shared/flow-assistant'
import { FlowConfirmDialog } from '../shared/flow-confirm-dialog'
import { FlowPageHeader } from '../shared/flow-page-header'
import { FlowPageLayout } from '../shared/flow-page-layout'
import { FlowStepInspector } from '../shared/flow-step-inspector'
import { FlowToolButton } from '../shared/flow-tool-button'
import { resolveFlowPageLabels, workflowPageLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import type { FlowEditorProps } from '../shared/types'
import { useFlowEditor } from '../shared/use-flow-editor'
import { useFlowPageState } from '../shared/use-flow-page-state'

export interface WorkflowEditorProps extends FlowEditorProps {
  canRedo?: boolean
  canUndo?: boolean
  onRedo?: () => void
  onUndo?: () => void
}

export function WorkflowEditor(
  props: Readonly<WorkflowEditorProps>,
): ReactElement {
  const {
    assistant,
    breadcrumbs,
    canRedo = false,
    canUndo = false,
    className,
    connections,
    icons,
    labels: labelsProp,
    loading = false,
    logs,
    name,
    onConnect,
    onConnectionsChange,
    onCopyJson,
    onRedo,
    onRun,
    onSelectedStepChange,
    onStepsChange,
    onUndo,
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
    () => resolveFlowPageLabels(workflowPageLabels, labelsProp),
    [labelsProp],
  )
  const state = useFlowPageState()
  const editor = useFlowEditor(props, state)
  const summary = run ?? flowRunSummary(steps)
  const groups = useMemo(() => groupStepTypes(stepTypes), [stepTypes])

  return (
    <>
      <FlowPageLayout
        canvas={
          <FlowCanvas
            connections={connections}
            direction="horizontal"
            icons={icons}
            labels={labels.canvas}
            loading={loading}
            locked={state.locked}
            onConnect={onConnect}
            onConnectionsChange={onConnectionsChange}
            onSelect={onSelectedStepChange}
            onStepAction={editor.onStepAction}
            onStepDrop={editor.onStepDrop}
            onStepsChange={onStepsChange}
            selectedStepId={selectedStepId}
            snapToGrid={state.snapToGrid}
            stepTypes={stepTypes}
            steps={steps}
          >
            <FlowCanvasControls>
              <Group>
                <FlowToolButton
                  disabled={!canUndo}
                  label={labels.undo}
                  onClick={onUndo}
                >
                  <Undo2Icon aria-hidden="true" />
                </FlowToolButton>
                <FlowToolButton
                  disabled={!canRedo}
                  label={labels.redo}
                  onClick={onRedo}
                >
                  <Redo2Icon aria-hidden="true" />
                </FlowToolButton>
                <FlowToolButton
                  aria-pressed={state.locked}
                  label={labels.lock}
                  onClick={() => state.setLocked(!state.locked)}
                >
                  {state.locked ? (
                    <LockIcon aria-hidden="true" />
                  ) : (
                    <LockOpenIcon aria-hidden="true" />
                  )}
                </FlowToolButton>
              </Group>
            </FlowCanvasControls>
            <FlowCanvasMinimap />
          </FlowCanvas>
        }
        className={className}
        header={
          <FlowPageHeader
            breadcrumbs={breadcrumbs}
            labels={labels}
            name={name}
            onAddStep={() => state.openInspector('create')}
            onAskAi={assistant ? () => state.setAssistantOpen(true) : undefined}
            onRun={onRun}
            renderLink={renderLink}
            running={running}
          >
            <MenuGroup>
              <MenuGroupLabel>{labels.canvasGroup}</MenuGroupLabel>
              <MenuCheckboxItem
                checked={state.snapToGrid}
                onCheckedChange={state.setSnapToGrid}
              >
                {labels.snapToGrid}
              </MenuCheckboxItem>
              <MenuItem onClick={() => editor.tidy('horizontal')}>
                {labels.tidy}
              </MenuItem>
            </MenuGroup>
            {onCopyJson ? (
              <>
                <MenuSeparator />
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
            variant="owner"
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
        confirmLabel={labels.deleteConfirm}
        description={labels.deleteDialogDescription(
          editor.pendingDeleteName,
          connections.filter(
            (connection) =>
              connection.source === state.pendingDelete ||
              connection.target === state.pendingDelete,
          ).length,
        )}
        onConfirm={() => {
          if (state.pendingDelete) editor.deleteStep(state.pendingDelete)
        }}
        onOpenChange={(open) => {
          if (!open) state.setPendingDelete(null)
        }}
        open={state.pendingDelete !== null}
        title={labels.deleteDialogTitle(editor.pendingDeleteName)}
      />
    </>
  )
}
