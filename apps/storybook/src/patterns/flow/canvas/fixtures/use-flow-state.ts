import type { FlowConnection, FlowStep, FlowStepType } from '@tc96/parttens'
import { useState } from 'react'

export function useFlowState(
  initialSteps: readonly FlowStep[],
  initialConnections: readonly FlowConnection[],
) {
  const [steps, setSteps] = useState<FlowStep[]>([...initialSteps])
  const [connections, setConnections] = useState<FlowConnection[]>([
    ...initialConnections,
  ])
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)

  const addStep = (type: FlowStepType, position: { x: number; y: number }) => {
    const id = `${type.id}-${steps.length + 1}`
    setSteps([
      ...steps,
      { id, kind: type.kind, name: type.label, position, type: type.id },
    ])
    setSelectedStepId(id)
  }

  const connect = (source: string, target: string) => {
    if (
      connections.some(
        (item) => item.source === source && item.target === target,
      )
    )
      return
    setConnections([
      ...connections,
      { id: `${source}-${target}`, source, target },
    ])
  }

  const remove = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId))
    setConnections(
      connections.filter(
        (item) => item.source !== stepId && item.target !== stepId,
      ),
    )
    setSelectedStepId(null)
  }

  return {
    addStep,
    connect,
    connections,
    remove,
    selectedStepId,
    setConnections,
    setSelectedStepId,
    setSteps,
    steps,
  }
}
