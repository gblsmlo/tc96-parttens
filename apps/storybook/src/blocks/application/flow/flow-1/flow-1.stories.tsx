import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow1, type Flow1Props } from '@tc96/ui/blocks/application/flow/flow-1'
import { fn } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { withAppShell } from '../../../../templates/fixtures/app-shell'
import {
  leadRoutingConnections,
  leadRoutingFailedSteps,
  leadRoutingIcons,
  leadRoutingLogs,
  leadRoutingOwners,
  leadRoutingRunningSteps,
  leadRoutingStats,
  leadRoutingSteps,
  leadRoutingStepTypes,
  leadRoutingSuggestions,
} from '../fixtures/lead-routing'
import {
  useFlowAssistant,
  useFlowEditorState,
} from '../fixtures/use-flow-editor-state'

const usage = `
// npx @tc96/cli add flow-1
// import '@xyflow/react/dist/base.css' in your global CSS
import { Flow1 } from '@acme/blocks/application/flow/flow-1'

<Flow1
  assistant={{ messages, onSend: ask, suggestions }}
  canRedo={history.canRedo}
  canUndo={history.canUndo}
  connections={connections}
  icons={{ slack: <MessageSquareIcon /> }}
  name="Roteamento de leads"
  onConnect={connect}
  onRedo={history.redo}
  onRun={runOnce}
  onSelectedStepChange={setSelectedStepId}
  onStepAdd={addStep}
  onStepChange={updateStep}
  onStepDelete={deleteStep}
  onStepsChange={setSteps}
  onUndo={history.undo}
  owners={owners}
  selectedStepId={selectedStepId}
  stepTypes={stepTypes}
  steps={steps}
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. A page header (breadcrumb, Atalhos, Pergunte à IA, Adicionar passo, Executar uma vez, Ações), the step library on the left, a horizontal `FlowCanvas` with controls and minimap, the inspector docked on the right and the assistant card over the canvas. It keeps only ephemeral state (inspector open, mode, tab, log filter, assistant, grid snapping, lock); steps, connections, selection and every result are props.',
      name: 'Flow1',
    },
    {
      description:
        '`steps`, `connections` and `stepTypes` are the graph and the library; `icons` maps a step type id to a node; `run` is the last run summary shown in the library card (computed from the steps when omitted), `running` disables Executar and shows a spinner, `loading` shows the skeletons and `aria-busy`.',
      name: 'steps, connections, stepTypes',
    },
    {
      description:
        '`onStepAdd(type, options?)` runs when a library item is clicked, a type is dropped on the canvas (`options.position`) or the create form is submitted (`options.after`, `options.connection`, `options.values`). `onStepChange(stepId, values)` runs when the edit form is saved, `onStepDelete(stepId)` after the confirmation (asked only when the step has connections), `onStepDuplicate(stepId)`, `onStepsChange(steps)` on every drag tick and on Reorganizar, `onStepsChangeEnd(steps)` once per drag and once per Reorganizar (one undo entry), `onConnect`, `onConnectionsChange`, `onSelectedStepChange`, `onRun`, `onCopyJson`, `onUndo` and `onRedo` (with `canUndo` and `canRedo`).',
      name: 'callbacks',
    },
    {
      description:
        '`owners` fill the Responsável select of the form, `logs` and `stepStats` fill the Logs and Status tabs of the inspector, and `assistant` (`messages`, `suggestions`, `typing`, `onSend`, `onSuggestion`) mounts the assistant; without it the Pergunte à IA button is not drawn.',
      name: 'owners, logs, stepStats, assistant',
    },
    {
      description:
        'Every visible text, pt-BR by default. `labels` is partial and merged over the defaults; the keys `canvas`, `library`, `runCard`, `inspector`, `assistant` and `shortcuts` pass partial labels to each pattern.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'An editor for automation workflows with the anatomy of the Flowly screens: step library, horizontal canvas, inspector with Build, Status and Logs, and an AI assistant. Install it with `npx @tc96/cli add flow-1` and import `@xyflow/react/dist/base.css` once in your global CSS.',
  },
  story: { height: '48rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    assistant: {
      description: 'Li o workflow, a última execução e o que você anexar.',
      greeting: 'Oi, Marina',
      messages: [],
      onSend: fn(),
      onSuggestion: fn(),
      suggestions: leadRoutingSuggestions,
    },
    breadcrumbs: [{ href: '/workflows', label: 'Workflows' }],
    connections: leadRoutingConnections,
    icons: leadRoutingIcons,
    logs: leadRoutingLogs,
    name: 'Roteamento de leads',
    onConnect: fn(),
    onCopyJson: fn(),
    onRun: fn(),
    onStepAdd: fn(),
    onStepChange: fn(),
    onStepDelete: fn(),
    onStepDuplicate: fn(),
    onStepsChange: fn(),
    onUndo: fn(),
    owners: leadRoutingOwners,
    stepStats: leadRoutingStats,
    stepTypes: leadRoutingStepTypes,
    steps: leadRoutingSteps,
  },
  component: Flow1,
  decorators: [
    withAppShell({
      breadcrumbs: [{ label: 'Workflows' }],
      href: '/workflows',
    }),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { docs, layout: 'fullscreen' },
  render: function Editor(args: Flow1Props) {
    const state = useFlowEditorState(args.steps, args.connections, {
      listeners: args,
      offset: { x: 320, y: 0 },
      owners: leadRoutingOwners,
    })
    const assistant = useFlowAssistant(args.assistant)
    return (
      <Flow1
        {...args}
        assistant={assistant}
        canRedo={state.canRedo}
        canUndo={state.canUndo}
        connections={state.connections}
        onConnect={state.connect}
        onConnectionsChange={state.setConnections}
        onRedo={state.redo}
        onSelectedStepChange={state.setSelectedStepId}
        onStepAdd={state.add}
        onStepChange={state.change}
        onStepDelete={state.remove}
        onStepDuplicate={state.duplicate}
        onStepsChange={state.setSteps}
        onStepsChangeEnd={state.setStepsEnd}
        onUndo={state.undo}
        selectedStepId={state.selectedStepId}
        steps={state.steps}
      />
    )
  },
  title: 'Blocks/Application/Flow/Flow1',
} satisfies Meta<typeof Flow1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Locked: Story = {}

export const Empty: Story = {
  args: { connections: [], steps: [] },
}

export const Running: Story = {
  args: { running: true, steps: leadRoutingRunningSteps },
}

export const Failed: Story = {
  args: { steps: leadRoutingFailedSteps },
}

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
