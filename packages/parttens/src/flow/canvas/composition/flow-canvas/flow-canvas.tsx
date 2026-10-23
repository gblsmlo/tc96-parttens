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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FlowCanvasEmpty } from '../../components/flow-canvas-empty'
import { FlowStepEdge } from '../../components/flow-step-edge'
import { FlowStepNode } from '../../components/flow-step-node'
import { useFlowDrop } from '../../hooks/use-flow-drop'
import { useFlowShortcuts } from '../../hooks/use-flow-shortcuts'
import { resolveFlowCanvasLabels } from '../../lib/labels'
import { resolveStepKind, resolveStepTypeLabel } from '../../lib/steps'
import {
  connectionFromReactFlow,
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
import type { FlowCanvasMode, FlowCanvasProps, FlowNodeType } from '../../types'

const nodeTypes = { step: FlowStepNode }
const edgeTypes = { step: FlowStepEdge }
const gridSize: [number, number] = [16, 16]
const fitViewOptions = { padding: 0.2 }
const panOnDragButtons = [1, 2]

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
  selectedStepId = null,
  snapToGrid = false,
  stepMenu,
  stepTypes,
  steps,
}: Readonly<FlowCanvasProps>): ReactElement {
  const [mode, setMode] = useState<FlowCanvasMode>('select')
  const [measured, setMeasured] = useState<MeasuredSizes>({})
  const labels = useMemo(
    () => resolveFlowCanvasLabels(labelsProp),
    [labelsProp],
  )
  const types = stepTypes ?? []
  const vertical = direction === 'vertical'
  const selected = useRef<string | null>(selectedStepId)
  selected.current = selectedStepId

  const emitSelect = useCallback(
    (id: string | null) => {
      if (id === selected.current) return
      selected.current = id
      onSelect?.(id)
    },
    [onSelect],
  )

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
      if (moved) onStepsChange?.(moved)
      const selection = selectionFromChanges(changes, selected.current)
      if (selection.changed) emitSelect(selection.id)
    },
    [emitSelect, onStepsChange, steps],
  )

  const selectedStep = steps.find((step) => step.id === selectedStepId)
  const onDelete = useCallback(() => {
    if (!selectedStep || locked) return
    if (resolveStepKind(selectedStep, types) === 'trigger') return
    onStepAction?.('delete', selectedStep.id)
  }, [locked, onStepAction, selectedStep, types])

  const onKeyDown = useFlowShortcuts({ onDelete, onMode: setMode })
  const drop = useFlowDrop({
    disabled: locked || loading,
    onStepDrop,
    snapToGrid,
  })

  const context = useMemo<FlowCanvasContextValue>(
    () => ({
      connections,
      direction,
      edgeControls: edgeControls ?? vertical,
      icons: icons ?? {},
      labels,
      locked,
      mode,
      onConnectionsChange,
      onStepAction,
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
      onConnectionsChange,
      onStepAction,
      stepMenu,
      types,
      vertical,
    ],
  )

  useEffect(() => {
    if (locked) setMode('select')
  }, [locked])

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
            onConnect?.(connectionFromReactFlow(connection))
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
