import type { Meta, StoryObj } from '@storybook/react-vite'
import { flowStepNodeSize } from '@tc96/parttens/flow/canvas/core'
import {
  AgentBuilder,
  type AgentBuilderProps,
  type FlowStep,
} from '@tc96/templates/application/flow/agent-builder'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { withAppShell } from '../../templates/fixtures/app-shell'
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
} from './fixtures/collections-agent'
import {
  useFlowAssistant,
  useFlowEditorState,
} from './fixtures/use-flow-editor-state'

const usage = `
// npx @tc96/parttens add agent-builder
// import '@xyflow/react/dist/base.css' in your global CSS
import { AgentBuilder } from '@acme/templates/application/flow/agent-builder'

<AgentBuilder
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
`

const docs = {
  api: [
    {
      description:
        'Root component. Same page as `WorkflowEditor` with a vertical `FlowCanvas` (edge controls and a node menu with Ver, Editar, Adicionar ramo and Excluir), the Organizar árvore button in the canvas controls, and no minimap. The form of a step has Caminho (the label of the incoming connection) in place of Responsável. It keeps only ephemeral state; steps, connections, selection and every result are props.',
      name: 'AgentBuilder',
    },
    {
      description:
        '`onStepsChange(steps)` receives the whole list: on every drag tick and, after Organizar árvore, with the positions of `tidyTree` (`flowStepNodeSize` and a 48 by 88 gap) so no two nodes overlap. `onStepAdd(type, options?)` carries `options.after` (the parent) when the step comes from Adicionar ramo, the edge "+" or the create form.',
      name: 'onStepsChange, onStepAdd',
    },
    {
      description:
        '`onClearResults` (after a confirmation) and `onRestoreExample` add Limpar resultados and Restaurar exemplo to the Ações menu; `onCopyJson` adds Copiar como JSON. The template never copies, clears or restores anything itself.',
      name: 'onClearResults, onRestoreExample, onCopyJson',
    },
    {
      description:
        'The data props (`steps`, `connections`, `stepTypes`, `icons`, `run`, `running`, `loading`, `logs`, `stepStats`, `assistant`, `labels`) are the ones of `WorkflowEditor`, with the agent defaults of the labels (Executar teste, Ações do agente).',
      name: 'steps, connections, stepTypes, labels',
    },
  ],
  description: {
    component:
      'A builder for AI agents as a tree of steps, with the anatomy of the Flowly screens: step library, vertical canvas, inspector with Build, Status and Logs, and an AI assistant. Install it with `npx @tc96/parttens add agent-builder` and import `@xyflow/react/dist/base.css` once in your global CSS.',
  },
  story: { height: '56rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const overlaps = (steps: readonly FlowStep[]) => {
  const [width, height] = flowStepNodeSize
  return steps.some((first, index) =>
    steps
      .slice(index + 1)
      .some(
        (second) =>
          Math.abs(first.position.x - second.position.x) < width &&
          Math.abs(first.position.y - second.position.y) < height,
      ),
  )
}

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
    breadcrumbs: [{ href: '/agents', label: 'Agentes' }],
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
  component: AgentBuilder,
  decorators: [
    withAppShell({ breadcrumbs: [{ label: 'Agentes' }], href: '/agents' }),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { docs, layout: 'fullscreen' },
  render: function Builder(args: AgentBuilderProps) {
    const state = useFlowEditorState(args.steps, args.connections, {
      listeners: args,
      offset: { x: 0, y: 188 },
    })
    const assistant = useFlowAssistant(args.assistant)
    return (
      <AgentBuilder
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
        selectedStepId={state.selectedStepId}
        steps={state.steps}
      />
    )
  },
  title: 'Application/Flow/AgentBuilder',
} satisfies Meta<typeof AgentBuilder>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Decidir abordagem' }),
    )
    await userEvent.click(
      await screen().findByRole('menuitem', { name: 'Adicionar ramo' }),
    )
    const inspector = await canvas.findByRole('complementary', {
      name: 'Detalhes do passo',
    })
    await userEvent.type(
      within(inspector).getByRole('textbox', { name: 'Nome' }),
      'Ligar para o cliente',
    )
    await userEvent.click(
      within(inspector).getByRole('button', { name: 'Adicionar passo' }),
    )
    await waitFor(() =>
      expect(args.onStepAdd).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'customer' }),
        expect.objectContaining({
          after: 'decide',
          values: expect.objectContaining({ name: 'Ligar para o cliente' }),
        }),
      ),
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Organizar árvore' }),
    )
    await waitFor(() => expect(args.onStepsChange).toHaveBeenCalled())
    const organized = (args.onStepsChange as ReturnType<typeof fn>).mock
      .lastCall?.[0] as FlowStep[]
    await expect(organized.length).toBeGreaterThan(0)
    await expect(overlaps(organized)).toBe(false)
  },
}

export const Empty: Story = {
  args: { connections: [], steps: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum passo ainda')).toBeVisible()
  },
}

export const Running: Story = {
  args: { running: true, steps: collectionsRunningSteps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Executar teste' }),
    ).toBeDisabled()
  },
}

export const Failed: Story = {
  args: { steps: collectionsFailedSteps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('region', { name: 'Última execução' })
    await expect(card).toHaveAttribute('data-status', 'failed')
    await expect(
      within(card).getByText('O Resend recusou o domínio de envio'),
    ).toBeVisible()
  },
}

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="flow-step-library"]'),
    ).toHaveAttribute('data-collapsed')
    await userEvent.click(canvas.getByRole('button', { name: 'Pergunte à IA' }))
    await expect(
      canvasElement.querySelector('[data-slot="flow-assistant-fullscreen"]'),
    ).toBeVisible()
  },
}
