import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  WorkflowEditor,
  type WorkflowEditorProps,
} from '@tc96/templates/application/flow/workflow-editor'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { withAppShell } from '../../templates/fixtures/app-shell'
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
} from './fixtures/lead-routing'
import {
  useFlowAssistant,
  useFlowEditorState,
} from './fixtures/use-flow-editor-state'

const usage = `
// npx @tc96/parttens add workflow-editor
// import '@xyflow/react/dist/base.css' in your global CSS
import { WorkflowEditor } from '@acme/templates/application/flow/workflow-editor'

<WorkflowEditor
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
      name: 'WorkflowEditor',
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
      'An editor for automation workflows with the anatomy of the Flowly screens: step library, horizontal canvas, inspector with Build, Status and Logs, and an AI assistant. Install it with `npx @tc96/parttens add workflow-editor` and import `@xyflow/react/dist/base.css` once in your global CSS.',
  },
  story: { height: '48rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const screen = () => within(document.body)

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
  component: WorkflowEditor,
  decorators: [
    withAppShell({
      breadcrumbs: [{ label: 'Workflows' }],
      href: '/workflows',
    }),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { docs, layout: 'fullscreen' },
  render: function Editor(args: WorkflowEditorProps) {
    const state = useFlowEditorState(args.steps, args.connections, {
      listeners: args,
      offset: { x: 320, y: 0 },
      owners: leadRoutingOwners,
    })
    const assistant = useFlowAssistant(args.assistant)
    return (
      <WorkflowEditor
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
  title: 'Application/Flow/WorkflowEditor',
} satisfies Meta<typeof WorkflowEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Enviar e-mail' }))
    await expect(args.onStepAdd).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'email' }),
      {},
    )

    await userEvent.click(canvas.getByText('Novo lead'))
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Editar Novo lead' }),
    )
    const name = await canvas.findByRole('textbox', { name: 'Nome' })
    await userEvent.clear(name)
    await userEvent.type(name, 'Lead recebido')
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar passo' }))
    await waitFor(() =>
      expect(args.onStepChange).toHaveBeenCalledWith(
        'form',
        expect.objectContaining({ name: 'Lead recebido', type: 'form' }),
      ),
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Pergunte à IA' }))
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Por que o passo de Slack falhou?',
      }),
    )
    await expect(args.assistant?.onSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'why' }),
    )
  },
}

export const Locked: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Travar canvas' }))
    await expect(
      canvas.getByRole('button', { name: 'Adicionar passo' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Enviar e-mail' }),
    ).toBeDisabled()
    await userEvent.click(canvas.getByText('Novo lead'))
    await expect(
      await canvas.findByRole('button', { name: 'Editar Novo lead' }),
    ).toBeEnabled()
    await expect(
      canvas.getByRole('button', {
        name: 'Adicionar um passo depois de Novo lead',
      }),
    ).toBeDisabled()
    await expect(args.onStepAdd).not.toHaveBeenCalled()
  },
}

export const Empty: Story = {
  args: { connections: [], steps: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum passo ainda')).toBeVisible()
    await expect(
      canvas.queryByRole('region', { name: 'Última execução' }),
    ).toBeNull()
  },
}

export const Running: Story = {
  args: { running: true, steps: leadRoutingRunningSteps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Executar uma vez' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('region', { name: 'Última execução' }),
    ).toHaveAttribute('data-status', 'running')
  },
}

export const Failed: Story = {
  args: { steps: leadRoutingFailedSteps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('region', { name: 'Última execução' })
    await expect(card).toHaveAttribute('data-status', 'failed')
    await expect(
      within(card).getByText('Canal #vendas não encontrado'),
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
      await screen().findByRole('dialog', { name: 'Assistente' }),
    ).toBeVisible()

    await userEvent.click(
      await screen().findByRole('button', { name: 'Encerrar' }),
    )
    await waitFor(() =>
      expect(screen().queryByRole('dialog', { name: 'Assistente' })).toBeNull(),
    )
    await userEvent.click(canvas.getByText('Novo lead'))
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ver Novo lead' }),
    )
    const sheet = await screen().findByRole('dialog', {
      name: 'Detalhes do passo',
    })
    await waitFor(() => expect(sheet).toBeVisible())
  },
}
