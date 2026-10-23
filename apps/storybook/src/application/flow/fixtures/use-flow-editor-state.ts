import type {
  AssistantMessage,
  FlowAssistantConfig,
  FlowConnectInput,
  FlowConnection,
  FlowEditorProps,
  FlowOwner,
  FlowPosition,
  FlowStep,
  FlowStepAddOptions,
  FlowStepType,
  FlowStepValues,
} from '@tc96/templates/application/flow/workflow-editor'
import { useState } from 'react'

interface Snapshot {
  connections: FlowConnection[]
  steps: FlowStep[]
}

interface FlowEditorStateOptions {
  listeners?: Partial<FlowEditorProps> & {
    onUndo?: () => void
    onRedo?: () => void
  }
  offset: FlowPosition
  owners?: readonly FlowOwner[]
}

export function useFlowAssistant(
  config: FlowAssistantConfig | undefined,
): FlowAssistantConfig | undefined {
  const [messages, setMessages] = useState<readonly AssistantMessage[]>(
    config?.messages ?? [],
  )
  const ask = (text: string) =>
    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: 'user', text },
    ])
  if (!config) return undefined
  return {
    ...config,
    messages,
    onSend: (text) => {
      config.onSend(text)
      ask(text)
    },
    onSuggestion: (suggestion) => {
      config.onSuggestion?.(suggestion)
      ask(suggestion.label)
    },
  }
}

export function useFlowEditorState(
  initialSteps: readonly FlowStep[],
  initialConnections: readonly FlowConnection[],
  { listeners = {}, offset, owners = [] }: FlowEditorStateOptions,
) {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    connections: [...initialConnections],
    steps: [...initialSteps],
  })
  const [past, setPast] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const { connections, steps } = snapshot

  const commit = (next: Snapshot) => {
    setPast((current) => [...current, snapshot])
    setFuture([])
    setSnapshot(next)
  }

  const add = (type: FlowStepType, options: FlowStepAddOptions = {}) => {
    listeners.onStepAdd?.(type, options)
    const id = `${type.id}-${steps.length + 1}`
    const parent = steps.find((step) => step.id === options.after)
    const position =
      options.position ??
      (parent
        ? { x: parent.position.x + offset.x, y: parent.position.y + offset.y }
        : { x: steps.length * 24, y: steps.length * 24 })
    const created: FlowStep = {
      description: options.values?.description,
      id,
      kind: type.kind,
      name: options.values?.name ?? type.label,
      position,
      type: type.id,
    }
    const link: FlowConnection[] = parent
      ? [
          {
            id: `${parent.id}-${id}`,
            label: options.values?.path || undefined,
            source: parent.id,
            target: id,
          },
        ]
      : []
    commit({
      connections: [...connections, ...link],
      steps: [...steps, created],
    })
    setSelectedStepId(id)
  }

  const change = (stepId: string, values: FlowStepValues) => {
    listeners.onStepChange?.(stepId, values)
    commit({
      connections: connections.map((connection) =>
        connection.target === stepId && values.path !== undefined
          ? { ...connection, label: values.path || undefined }
          : connection,
      ),
      steps: steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              description: values.description,
              name: values.name,
              owner: values.ownerId
                ? owners.find((owner) => owner.id === values.ownerId)
                : step.owner,
              type: values.type,
            }
          : step,
      ),
    })
  }

  const remove = (stepId: string) => {
    listeners.onStepDelete?.(stepId)
    commit({
      connections: connections.filter(
        (connection) =>
          connection.source !== stepId && connection.target !== stepId,
      ),
      steps: steps.filter((step) => step.id !== stepId),
    })
    setSelectedStepId(null)
  }

  const duplicate = (stepId: string) => {
    listeners.onStepDuplicate?.(stepId)
    const source = steps.find((step) => step.id === stepId)
    if (!source) return
    commit({
      connections,
      steps: [
        ...steps,
        {
          ...source,
          id: `${source.id}-copy-${steps.length + 1}`,
          name: `${source.name} (cópia)`,
          position: { x: source.position.x + 32, y: source.position.y + 32 },
          run: undefined,
        },
      ],
    })
  }

  const connect = (connection: FlowConnectInput) => {
    listeners.onConnect?.(connection)
    const { source, target } = connection
    if (
      connections.some(
        (connection) =>
          connection.source === source && connection.target === target,
      )
    )
      return
    commit({
      connections: [
        ...connections,
        { id: `${source}-${target}`, source, target },
      ],
      steps,
    })
  }

  return {
    add,
    canRedo: future.length > 0,
    canUndo: past.length > 0,
    change,
    connect,
    connections,
    duplicate,
    redo: () => {
      listeners.onRedo?.()
      const next = future.at(-1)
      if (!next) return
      setFuture(future.slice(0, -1))
      setPast([...past, snapshot])
      setSnapshot(next)
    },
    remove,
    selectedStepId,
    setConnections: (next: FlowConnection[]) =>
      commit({ connections: next, steps }),
    setSelectedStepId,
    setSteps: (next: FlowStep[]) => {
      listeners.onStepsChange?.(next)
      setSnapshot({ connections, steps: next })
    },
    steps,
    undo: () => {
      listeners.onUndo?.()
      const previous = past.at(-1)
      if (!previous) return
      setPast(past.slice(0, -1))
      setFuture([...future, snapshot])
      setSnapshot(previous)
    },
  }
}
