import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
  type FlowCanvasProps,
  FlowShortcutsPopover,
  type FlowStep,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { LockIcon, Redo2Icon, Undo2Icon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import {
  collectionsConnections,
  collectionsSteps,
  collectionsStepTypes,
} from './fixtures/collections-agent'
import { collectionsIcons, leadRoutingIcons } from './fixtures/icons'
import {
  leadRoutingConnections,
  leadRoutingSteps,
  leadRoutingStepTypes,
} from './fixtures/lead-routing'

const usage = `
// global.css (or the entry that loads your theme)
@import '@xyflow/react/dist/base.css';

import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
} from '@acme/patterns'

<FlowCanvas
  connections={connections}
  direction="horizontal"
  icons={icons}
  onConnect={({ source, target }) => connect(source, target)}
  onSelect={setSelectedStepId}
  onStepAction={(action, stepId) => run(action, stepId)}
  onStepDrop={(type, position) => addStep(type, position)}
  onStepsChange={setSteps}
  selectedStepId={selectedStepId}
  stepTypes={stepTypes}
  steps={steps}
>
  <FlowCanvasControls>
    <Button aria-label="Desfazer" onClick={undo} size="icon-sm" variant="outline" />
  </FlowCanvasControls>
  <FlowCanvasMinimap />
</FlowCanvas>
`

const docs = {
  api: [
    {
      description:
        'Controlled graph editor on React Flow, with its own `ReactFlowProvider`. `steps` and `connections` carry the graph and the run (`FlowStep.run`, `FlowConnection.taken`); `direction` picks handles left and right (`horizontal`) or top and bottom (`vertical`). It emits `onStepsChange` (the whole list with the moved step), `onConnect`, `onSelect` (id or `null`), `onStepDrop` (type and flow position of a library item dropped on it), `onConnectionsChange` (a connection removed from the edge controls) and `onStepAction` (`add-after`, `add-branch`, `view`, `edit`, `duplicate`, `delete` with the step id, and the connection when it comes from an edge). It never fetches, persists, orders or computes a run. `locked` blocks dragging and connecting; `snapToGrid` aligns to 16px; `loading` sets `aria-busy` and shows no nodes; no steps shows an `Empty`. `edgeControls` and `stepMenu` default to `true` in `vertical`. `icons` maps `FlowStepType.id` to a node; without one the node shows a Lucide icon by `kind`. `labels` overrides any text; the default is pt-BR.',
      name: 'FlowCanvas',
    },
    {
      description:
        'Bottom-left panel: Selecionar and Mover in a `ToggleGroup`, zoom out, the zoom level as a button that fits the graph, zoom in. `children` go after them (undo, redo, lock, or tidy tree). Must be a child of `FlowCanvas`.',
      name: 'FlowCanvasControls',
    },
    {
      description:
        'React Flow minimap, pannable and zoomable, hidden below `md`. Must be a child of `FlowCanvas`.',
      name: 'FlowCanvasMinimap',
    },
    {
      description:
        'Button that opens a popover with the keyboard shortcuts. It does not need a `FlowCanvas`.',
      name: 'FlowShortcutsPopover',
    },
    {
      description:
        '`flowStepNodeSize`: the node size to pass to `tidyTree` (`nodeSize`).',
      name: 'flowStepNodeSize',
    },
  ],
  description: {
    component:
      'The graph surface of the flow editors. The consumer imports `@xyflow/react/dist/base.css` once, owns the steps, connections, selection, history and execution, and composes the controls and the minimap as children.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function ControlledCanvas({ children, ...args }: Readonly<FlowCanvasProps>) {
  const [steps, setSteps] = useState<readonly FlowStep[]>(args.steps)
  const [selectedStepId, setSelectedStepId] = useState(
    args.selectedStepId ?? null,
  )
  return (
    <FlowCanvas
      {...args}
      className="h-136 rounded-xl border"
      onSelect={(id) => {
        args.onSelect?.(id)
        setSelectedStepId(id)
      }}
      onStepsChange={(next) => {
        args.onStepsChange?.(next)
        setSteps(next)
      }}
      selectedStepId={selectedStepId}
      steps={steps}
    >
      {children ?? (
        <>
          <FlowCanvasControls>
            {args.direction === 'vertical' ? (
              <Button size="sm" variant="outline">
                Organizar árvore
              </Button>
            ) : (
              <>
                <Button aria-label="Desfazer" size="icon-sm" variant="outline">
                  <Undo2Icon aria-hidden="true" />
                </Button>
                <Button aria-label="Refazer" size="icon-sm" variant="outline">
                  <Redo2Icon aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Travar canvas"
                  aria-pressed={args.locked ?? false}
                  size="icon-sm"
                  variant="outline"
                >
                  <LockIcon aria-hidden="true" />
                </Button>
              </>
            )}
          </FlowCanvasControls>
          <FlowCanvasMinimap />
        </>
      )}
    </FlowCanvas>
  )
}

const meta = {
  args: {
    connections: leadRoutingConnections,
    direction: 'horizontal',
    icons: leadRoutingIcons,
    onConnect: fn(),
    onConnectionsChange: fn(),
    onSelect: fn(),
    onStepAction: fn(),
    onStepDrop: fn(),
    onStepsChange: fn(),
    stepTypes: leadRoutingStepTypes,
    steps: leadRoutingSteps,
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    connections: { control: false },
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    icons: { control: false },
    labels: { control: false },
    steps: { control: false },
    stepTypes: { control: false },
  },
  component: FlowCanvas,
  parameters: { docs, layout: 'padded' },
  render: (args) => <ControlledCanvas {...args} />,
  title: 'Patterns/Flow/Canvas',
} satisfies Meta<typeof FlowCanvas>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const HorizontalInteraction: Story = {
  ...Horizontal,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const node = await canvas.findByRole('group', {
      name: 'Lead qualificado?, Condição, Sucesso',
    })
    await expect(node).toHaveAttribute('aria-roledescription', 'passo')

    await userEvent.click(node)
    await expect(args.onSelect).toHaveBeenCalledWith('qualified')
    const toolbar = await canvas.findByRole('group', {
      name: 'Ações de Lead qualificado?',
    })
    for (const name of [
      'Adicionar um passo depois de Lead qualificado?',
      'Ver Lead qualificado?',
      'Editar Lead qualificado?',
      'Duplicar Lead qualificado?',
      'Excluir Lead qualificado?',
    ])
      await expect(within(toolbar).getByRole('button', { name })).toBeVisible()

    const trigger = await canvas.findByRole('group', {
      name: 'Novo lead, Formulário enviado, Sucesso',
    })
    await userEvent.pointer({
      keys: '[MouseRight]',
      target: trigger.querySelector('[data-slot="flow-step-node"]') as Element,
    })
    const menu = within(document.body)
    await expect(menu.queryByRole('menuitem', { name: 'Duplicar' })).toBeNull()
    await userEvent.click(await menu.findByRole('menuitem', { name: 'Editar' }))
    await expect(args.onStepAction).toHaveBeenCalledWith('edit', 'form')
  },
  tags: ['!dev', '!autodocs'],
}

export const Vertical: Story = {
  args: {
    connections: collectionsConnections,
    direction: 'vertical',
    icons: collectionsIcons,
    stepTypes: collectionsStepTypes,
    steps: collectionsSteps,
  },
}

export const VerticalInteraction: Story = {
  ...Vertical,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const add = await canvas.findByRole('button', {
      name: 'Adicionar um passo no caminho Sem resposta',
    })
    add.focus()
    await expect(add).toHaveFocus()
    await userEvent.click(add)
    await expect(args.onStepAction).toHaveBeenCalledWith(
      'add-after',
      'decide',
      expect.objectContaining({ id: 'decide-reminder' }),
    )

    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Remover a conexão do caminho Contestou',
      }),
    )
    await expect(args.onConnectionsChange).toHaveBeenCalledWith(
      collectionsConnections.filter((item) => item.id !== 'decide-dispute'),
    )

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ações de Decidir abordagem' }),
    )
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: 'Adicionar ramo',
      }),
    )
    await expect(args.onStepAction).toHaveBeenCalledWith('add-branch', 'decide')
  },
  tags: ['!dev', '!autodocs'],
}

export const WithRunSuccess: Story = {
  args: {
    steps: leadRoutingSteps.map((step) => ({
      ...step,
      run: { durationMs: 300, status: 'success' as const },
    })),
  },
}

export const Selected: Story = {
  args: { selectedStepId: 'slack' },
}

export const Locked: Story = {
  args: { locked: true, snapToGrid: true },
}

export const LockedInteraction: Story = {
  ...Locked,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole('group', {
      name: 'Lead qualificado?, Condição, Sucesso',
    })
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="flow-canvas"]'),
      ).toHaveAttribute('data-locked', 'true'),
    )
    await expect(
      canvasElement.querySelectorAll('.react-flow__node.draggable'),
    ).toHaveLength(0)
  },
  tags: ['!dev', '!autodocs'],
}

export const Empty: Story = {
  args: { connections: [], steps: [] },
}

export const Loading: Story = {
  args: { loading: true },
}

export const LoadingInteraction: Story = {
  ...Loading,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Canvas do fluxo' }),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelectorAll('.react-flow__node'),
    ).toHaveLength(0)
  },
  tags: ['!dev', '!autodocs'],
}

const statuses = [
  'idle',
  'running',
  'success',
  'failed',
  'skipped',
  'not-run',
] as const

export const StepStates: Story = {
  args: {
    connections: [],
    steps: statuses.map((status, index) => ({
      description: `Estado ${status}`,
      id: status,
      name: `Passo ${status}`,
      position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 140 },
      run: { durationMs: 1200, metrics: ['1.842 tokens'], status },
      type: 'email',
    })),
  },
}

export const Shortcuts: Story = {
  render: () => <FlowShortcutsPopover />,
}
