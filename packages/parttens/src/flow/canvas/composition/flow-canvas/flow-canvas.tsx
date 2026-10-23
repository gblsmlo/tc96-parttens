'use client'

import { cn } from '@tc96/utils'
import {
  Background,
  BackgroundVariant,
  type NodeChange,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FlowCanvasEmpty } from '../../components/flow-canvas-empty'
import { FlowStepEdge } from '../../components/flow-step-edge'
import { FlowStepNode } from '../../components/flow-step-node'
import type { FlowConnection, FlowStepAction, FlowStepType } from '../../core'
import { useFlowDrop } from '../../hooks/use-flow-drop'
import { useFlowShortcuts } from '../../hooks/use-flow-shortcuts'
import { resolveFlowCanvasLabels } from '../../lib/labels'
import { resolveStepKind, resolveStepTypeLabel } from '../../lib/steps'
import {
  connectionFromReactFlow,
  endsDrag,
  type MeasuredSizes,
  measuredFromChanges,
  moveSteps,
  selectionFromChanges,
  toEdges,
  toNodes,
} from '../../lib/to-react-flow'
import {
  flowCanvasClassName,
  flowCanvasFlowClassName,
} from '../../lib/variants'
import {
  FlowCanvasContext,
  type FlowCanvasContextValue,
} from '../../store/flow-canvas-context'
import type {
  FlowCanvasMode,
  FlowCanvasProps,
  FlowNodeType,
  FlowPosition,
} from '../../types'

const nodeTypes = { step: FlowStepNode }
const edgeTypes = { step: FlowStepEdge }
const gridSize: [number, number] = [16, 16]
const fitViewOptions = { padding: 0.2 }
const panOnDragButtons = [1, 2]
const emptyStepTypes: readonly FlowStepType[] = []
const emptyIcons: Record<string, ReactNode> = {}

function FlowCanvasContent({
  children,
  className,
  connections,
  direction = 'horizontal',
  edgeControls,
  icons,
  labels: labelsProp,
  loading = false,
  locked = false,
  onConnect,
  onConnectionsChange,
  onSelect,
  onStepAction,
  onStepDrop,
  onStepsChange,
  onStepsChangeEnd,
  selectedStepId = null,
  snapToGrid = false,
  stepMenu,
  stepTypes,
  steps,
}: Readonly<FlowCanvasProps>): ReactElement {
  const [modeState, setMode] = useState<FlowCanvasMode>('select')
  const mode: FlowCanvasMode = locked ? 'select' : modeState
  const [measured, setMeasured] = useState<MeasuredSizes>({})
  const labels = useMemo(
    () => resolveFlowCanvasLabels(labelsProp),
    [labelsProp],
  )
  const types = stepTypes ?? emptyStepTypes
  const vertical = direction === 'vertical'
  const selected = useRef<string | null>(selectedStepId)
  const latest = useRef({
    onConnect,
    onConnectionsChange,
    onSelect,
    onStepAction,
    onStepDrop,
    onStepsChange,
    onStepsChangeEnd,
  })

  useLayoutEffect(() => {
    selected.current = selectedStepId
    latest.current = {
      onConnect,
      onConnectionsChange,
      onSelect,
      onStepAction,
      onStepDrop,
      onStepsChange,
      onStepsChangeEnd,
    }
  })

  const handleConnectionsChange = useCallback(
    (next: FlowConnection[]) => latest.current.onConnectionsChange?.(next),
    [],
  )
  const handleStepAction = useCallback(
    (action: FlowStepAction, stepId: string, connection?: FlowConnection) => {
      const { onStepAction: act } = latest.current
      if (connection) act?.(action, stepId, connection)
      else act?.(action, stepId)
    },
    [],
  )
  const handleStepDrop = useCallback(
    (type: FlowStepType, position: FlowPosition) =>
      latest.current.onStepDrop?.(type, position),
    [],
  )
  const emitSelect = useCallback((id: string | null) => {
    if (id === selected.current) return
    selected.current = id
    latest.current.onSelect?.(id)
  }, [])

  const nodes = useMemo(
    () =>
      loading
        ? []
        : toNodes(steps, {
            connections,
            describe: (step) =>
              labels.stepName(
                step.name,
                resolveStepTypeLabel(step, types),
                labels.statuses[step.run?.status ?? 'not-run'],
              ),
            direction,
            measured,
            roleDescription: labels.stepRoleDescription,
            selectedStepId,
          }),
    [
      connections,
      direction,
      labels,
      loading,
      measured,
      selectedStepId,
      steps,
      types,
    ],
  )
  const edges = useMemo(
    () => (loading ? [] : toEdges(connections)),
    [connections, loading],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange<FlowNodeType>[]) => {
      setMeasured((current) => measuredFromChanges(current, changes))
      const moved = moveSteps(steps, changes)
      if (moved) latest.current.onStepsChange?.(moved)
      if (moved && endsDrag(changes)) latest.current.onStepsChangeEnd?.(moved)
      const selection = selectionFromChanges(changes, selected.current)
      if (selection.changed) emitSelect(selection.id)
    },
    [emitSelect, steps],
  )

  const selectedStep = steps.find((step) => step.id === selectedStepId)
  const onDelete = useCallback(() => {
    if (!selectedStep || locked) return
    if (resolveStepKind(selectedStep, types) === 'trigger') return
    handleStepAction('delete', selectedStep.id)
  }, [handleStepAction, locked, selectedStep, types])

  const onKeyDown = useFlowShortcuts({ onDelete, onMode: setMode })
  const drop = useFlowDrop({
    disabled: locked || loading,
    onStepDrop: handleStepDrop,
    snapToGrid,
  })

  const context = useMemo<FlowCanvasContextValue>(
    () => ({
      connections,
      direction,
      edgeControls: edgeControls ?? vertical,
      icons: icons ?? emptyIcons,
      labels,
      locked,
      mode,
      onConnectionsChange: handleConnectionsChange,
      onStepAction: handleStepAction,
      setMode,
      stepMenu: stepMenu ?? vertical,
      stepTypes: types,
    }),
    [
      connections,
      direction,
      edgeControls,
      icons,
      labels,
      locked,
      mode,
      handleConnectionsChange,
      handleStepAction,
      stepMenu,
      types,
      vertical,
    ],
  )

  return (
    <FlowCanvasContext.Provider value={context}>
      <section
        aria-busy={loading || undefined}
        aria-label={labels.canvas}
        className={cn(flowCanvasClassName, className)}
        data-direction={direction}
        data-locked={locked || undefined}
        data-mode={mode}
        data-slot="flow-canvas"
        onKeyDown={onKeyDown}
        tabIndex={-1}
      >
        <ReactFlow<FlowNodeType>
          attributionPosition="bottom-center"
          className={flowCanvasFlowClassName}
          deleteKeyCode={null}
          edges={edges}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          isValidConnection={(connection) =>
            connection.source !== connection.target
          }
          maxZoom={2}
          minZoom={0.25}
          multiSelectionKeyCode={null}
          nodes={nodes}
          nodesConnectable={!locked}
          nodesDraggable={!locked && mode === 'select'}
          nodeTypes={nodeTypes}
          onConnect={(connection) =>
            latest.current.onConnect?.(connectionFromReactFlow(connection))
          }
          onDragOver={drop.onDragOver}
          onDrop={drop.onDrop}
          onNodeClick={(_, node) => emitSelect(node.id)}
          onNodesChange={onNodesChange}
          onPaneClick={() => emitSelect(null)}
          panOnDrag={mode === 'pan' ? true : panOnDragButtons}
          selectionOnDrag={mode === 'select'}
          snapGrid={gridSize}
          snapToGrid={snapToGrid}
          zoomOnDoubleClick={false}
        >
          <Background gap={16} size={1.5} variant={BackgroundVariant.Dots} />
          {children}
        </ReactFlow>
        {!loading && steps.length === 0 ? <FlowCanvasEmpty /> : null}
      </section>
    </FlowCanvasContext.Provider>
  )
}

export function FlowCanvas(props: Readonly<FlowCanvasProps>): ReactElement {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent {...props} />
    </ReactFlowProvider>
  )
}
