import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2, type Flow2Props } from '@tc96/ui/blocks/application/flow/flow-2'
import { fn } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { withAppShell } from '../../../../templates/fixtures/app-shell'
import {
  collectionsConnections,
  collectionsFailedSteps,
  collectionsIcons,
  collectionsLogs,
  collectionsRunningSteps,
  collectionsStats,
  collectionsSteps,
  collectionsStepTypes,
  collectionsSuggestions,
} from '../fixtures/collections-agent'
import {
  useFlowAssistant,
  useFlowEditorState,
} from '../fixtures/use-flow-editor-state'

const usage = `
// npx @tc96/cli add flow-2
// import '@xyflow/react/dist/base.css' in your global CSS
import { Flow2 } from '@acme/blocks/application/flow/flow-2'

<AppShell1
  actions={<div ref={setActionsContainer} />}
  padded={false}
  breadcrumbs={[{ href: '/agents', label: 'Agentes' }, { label: 'Agente de cobrança' }]}
  {...shell}
>
<Flow2
  actionsContainer={actionsContainer}
  assistant={{ messages, onSend: ask, suggestions }}
  connections={connections}
  icons={{ decide: <img alt="" src={anthropicSrc} /> }}
  name="Agente de cobrança"
  onClearResults={clearResults}
  onRestoreExample={restoreExample}
  onRun={runTest}
  onSelectedStepChange={setSelectedStepId}
  onStepAdd={addStep}
  onStepChange={updateStep}
  onStepDelete={deleteStep}
  onStepsChange={setSteps}
  selectedStepId={selectedStepId}
  stepTypes={stepTypes}
  steps={steps}
/>
</AppShell1>
`

const docs = {
  api: [
    {
      description:
        'Root component. Same page as `Flow1` with a vertical `FlowCanvas` (edge controls and a node menu with Ver, Editar, Adicionar ramo and Excluir), the Organizar árvore button in the canvas controls, and no minimap. The form of a step has Caminho (the label of the incoming connection) in place of Responsável. It keeps only ephemeral state; steps, connections, selection and every result are props.',
      name: 'Flow2',
    },
    {
      description:
        '`onStepsChange(steps)` receives the whole list: on every drag tick (`onStepsChangeEnd(steps)` once when the drag ends, and after Organizar árvore) and, after Organizar árvore, with the positions of `tidyTree` (`flowStepNodeSize` and a 48 by 88 gap) so no two nodes overlap. `onStepAdd(type, options?)` carries `options.after` (the parent) when the step comes from Adicionar ramo, the edge "+" or the create form.',
      name: 'onStepsChange, onStepAdd',
    },
    {
      description:
        'An element in the app header (the `actions` slot of an App Shell). When set, the actions (Atalhos, Pergunte à IA, Adicionar passo, Executar teste and the Ações menu) render there through a portal, the page drops its own header and breadcrumb (the shell carries Agentes › Agente de cobrança) and loses its card frame. `null` while the slot mounts renders no actions; leave it out to keep the in-page header.',
      name: 'actionsContainer',
    },
    {
      description:
        '`onClearResults` (after a confirmation) and `onRestoreExample` add Limpar resultados and Restaurar exemplo to the Ações menu; `onCopyJson` adds Copiar como JSON. The template never copies, clears or restores anything itself.',
      name: 'onClearResults, onRestoreExample, onCopyJson',
    },
    {
      description:
        'The data props (`steps`, `connections`, `stepTypes`, `icons`, `run`, `running`, `loading`, `logs`, `stepStats`, `assistant`, `labels`) are the ones of `Flow1`, with the agent defaults of the labels (Executar teste, Ações do agente).',
      name: 'steps, connections, stepTypes, labels',
    },
  ],
  description: {
    component:
      'A builder for AI agents as a tree of steps, with the anatomy of the Flowly screens: step library, vertical canvas, inspector with Build, Status and Logs, and an AI assistant. Install it with `npx @tc96/cli add flow-2` and import `@xyflow/react/dist/base.css` once in your global CSS.',
  },
  story: { height: '56rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    assistant: {
      description: 'Li o agente, a última execução e o que você anexar.',
      greeting: 'Oi, Marina',
      messages: [],
      onSend: fn(),
      onSuggestion: fn(),
      suggestions: collectionsSuggestions,
    },
    connections: collectionsConnections,
    icons: collectionsIcons,
    logs: collectionsLogs,
    name: 'Agente de cobrança',
    onClearResults: fn(),
    onConnect: fn(),
    onCopyJson: fn(),
    onRestoreExample: fn(),
    onRun: fn(),
    onStepAdd: fn(),
    onStepChange: fn(),
    onStepDelete: fn(),
    onStepDuplicate: fn(),
    onStepsChange: fn(),
    stepStats: collectionsStats,
    stepTypes: collectionsStepTypes,
    steps: collectionsSteps,
  },
  component: Flow2,
  decorators: [
    withAppShell({
      actionsArg: 'actionsContainer',
      breadcrumbs: [
        { href: '/agents', label: 'Agentes' },
        { label: 'Agente de cobrança' },
      ],
      href: '/agents',
      padded: false,
      root: false,
    }),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { docs, layout: 'fullscreen' },
  render: function Builder(args: Flow2Props) {
    const state = useFlowEditorState(args.steps, args.connections, {
      listeners: args,
      offset: { x: 0, y: 188 },
    })
    const assistant = useFlowAssistant(args.assistant)
    return (
      <Flow2
        {...args}
        assistant={assistant}
        connections={state.connections}
        onConnect={state.connect}
        onConnectionsChange={state.setConnections}
        onSelectedStepChange={state.setSelectedStepId}
        onStepAdd={state.add}
        onStepChange={state.change}
        onStepDelete={state.remove}
        onStepDuplicate={state.duplicate}
        onStepsChange={state.setSteps}
        onStepsChangeEnd={state.setStepsEnd}
        selectedStepId={state.selectedStepId}
        steps={state.steps}
      />
    )
  },
  title: 'Blocks/Application/Flow/Flow2',
} satisfies Meta<typeof Flow2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { connections: [], steps: [] },
}

export const Running: Story = {
  args: { running: true, steps: collectionsRunningSteps },
}

export const Failed: Story = {
  args: { steps: collectionsFailedSteps },
}

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
