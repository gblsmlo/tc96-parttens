import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FLOW_STEP_TRANSFER_TYPE,
  FlowCanvas,
  FlowCanvasControls,
  type FlowConnection,
  type FlowPosition,
  FlowShortcutsPopover,
  type FlowStepAction,
  type FlowStepType,
  serializeStepTransfer,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CanvasFrame } from './canvas-frame.tsx'
import { LockToggle } from './canvas-layouts.tsx'
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
import {
  twoSteps,
  twoStepsConnections,
  twoStepsTypes,
} from './fixtures/two-steps'

interface BehaviorArgs {
  onConnectionsChange: (connections: FlowConnection[]) => void
  onSelect: (stepId: string | null) => void
  onStepAction: (
    action: FlowStepAction,
    stepId: string,
    connection?: FlowConnection,
  ) => void
  onStepDrop: (type: FlowStepType, position: FlowPosition) => void
}

const meta = {
  args: {
    onConnectionsChange: fn(),
    onSelect: fn(),
    onStepAction: fn(),
    onStepDrop: fn(),
  },
  argTypes: {
    onConnectionsChange: { control: false },
    onSelect: { control: false },
    onStepAction: { control: false },
    onStepDrop: { control: false },
  },
  decorators: [CanvasFrame],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const timeout = 5000

const mail: FlowStepType = { group: 'g', id: 'mail', label: 'E-mail' }

const twoStepsProps = {
  connections: twoStepsConnections,
  stepTypes: twoStepsTypes,
  steps: twoSteps,
}

const leadRoutingProps = {
  connections: leadRoutingConnections,
  icons: leadRoutingIcons,
  stepTypes: leadRoutingStepTypes,
  steps: leadRoutingSteps,
}

const collectionsProps = {
  connections: collectionsConnections,
  direction: 'vertical',
  icons: collectionsIcons,
  stepTypes: collectionsStepTypes,
  steps: collectionsSteps,
} as const

const canvasRegion = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Canvas do fluxo' })

const mailStep = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('group', {
    name: 'Enviar e-mail, E-mail, Não executado',
  })

const pane = async (canvasElement: HTMLElement): Promise<Element> => {
  await mailStep(canvasElement)
  return canvasElement.querySelector('.react-flow') as Element
}

const drop = (target: Element, payload: Record<string, string>) => {
  const dataTransfer = new DataTransfer()
  for (const [format, value] of Object.entries(payload))
    dataTransfer.setData(format, value)
  target.dispatchEvent(
    new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX: 123,
      clientY: 87,
      dataTransfer,
    }),
  )
}

const appendField = <T extends HTMLElement>(parent: HTMLElement, field: T) => {
  field.setAttribute('aria-label', 'Campo de teste')
  parent.append(field)
  return field
}

const tabTo = async (target: Element) => {
  for (let step = 0; step < 10 && document.activeElement !== target; step += 1)
    await userEvent.tab()
  await expect(target).toHaveFocus()
}

const closeTooltips = async (trigger: Element | null) => {
  if (trigger instanceof HTMLElement && trigger.isConnected)
    await userEvent.unhover(trigger)
  await waitFor(
    () =>
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull(),
    { timeout },
  )
}

export const StepNamedByNameTypeAndState: Story = {
  render: () => <FlowCanvas {...twoStepsProps} />,
  play: async ({ canvasElement }) => {
    const step = await mailStep(canvasElement)
    await expect(step).toHaveAttribute('aria-roledescription', 'passo')
  },
}

export const ClickSelectsStep: Story = {
  render: ({ onSelect }) => (
    <FlowCanvas {...leadRoutingProps} onSelect={onSelect} />
  ),
  play: async ({ args, canvasElement }) => {
    const step = await within(canvasElement).findByRole('group', {
      name: 'Lead qualificado?, Condição, Sucesso',
    })
    await userEvent.click(step)
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await expect(args.onSelect).toHaveBeenLastCalledWith('qualified')
  },
}

export const KeyboardSelectsStep: Story = {
  render: function KeyboardCanvas({ onSelect }) {
    const [selected, setSelected] = useState<string | null>(null)
    return (
      <FlowCanvas
        {...twoStepsProps}
        onSelect={(id) => {
          onSelect(id)
          setSelected(id)
        }}
        selectedStepId={selected}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const mail = await mailStep(canvasElement)
    const trigger = canvas.getByRole('group', {
      name: 'Novo lead, Formulário, Não executado',
    })
    canvasRegion(canvasElement).focus()

    await tabTo(trigger)
    await userEvent.keyboard(' ')
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await expect(args.onSelect).toHaveBeenLastCalledWith('form')

    await tabTo(mail)
    await userEvent.keyboard('{Enter}')
    await expect(args.onSelect).toHaveBeenCalledTimes(2)
    await expect(args.onSelect).toHaveBeenLastCalledWith('mail')
    await expect(
      await canvas.findByRole('group', { name: 'Ações de Enviar e-mail' }),
    ).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await expect(args.onSelect).toHaveBeenCalledTimes(3)
    await expect(args.onSelect).toHaveBeenLastCalledWith(null)
  },
}

export const SelectedStepToolbar: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas
      {...leadRoutingProps}
      onStepAction={onStepAction}
      selectedStepId="qualified"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const toolbar = await within(canvasElement).findByRole('group', {
      name: 'Ações de Lead qualificado?',
    })
    await expect(
      within(toolbar)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      'Adicionar um passo depois de Lead qualificado?',
      'Ver Lead qualificado?',
      'Editar Lead qualificado?',
      'Duplicar Lead qualificado?',
      'Excluir Lead qualificado?',
    ])
    const view = within(toolbar).getByRole('button', {
      name: 'Ver Lead qualificado?',
    })
    await userEvent.click(view)
    await closeTooltips(view)
    await expect(args.onStepAction).toHaveBeenCalledOnce()
    await expect(args.onStepAction).toHaveBeenLastCalledWith(
      'view',
      'qualified',
    )
  },
}

export const ContextMenuOfTrigger: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas {...leadRoutingProps} onStepAction={onStepAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = await within(canvasElement).findByRole('group', {
      name: 'Novo lead, Formulário enviado, Sucesso',
    })
    await userEvent.pointer({
      keys: '[MouseRight]',
      target: trigger.querySelector('[data-slot="flow-step-node"]') as Element,
    })
    const menu = await screen.findByRole('menu')
    await expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Adicionar passo depois', 'Ver', 'Editar'])
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Editar' }),
    )
    await expect(args.onStepAction).toHaveBeenCalledOnce()
    await expect(args.onStepAction).toHaveBeenLastCalledWith('edit', 'form')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull(), {
      timeout,
    })
  },
}

export const EdgeAddsStepAfterSource: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas {...collectionsProps} onStepAction={onStepAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const add = await within(canvasElement).findByRole('button', {
      name: 'Adicionar um passo no caminho Sem resposta',
    })
    add.focus()
    await expect(add).toHaveFocus()
    await userEvent.click(add)
    await closeTooltips(add)
    await expect(args.onStepAction).toHaveBeenCalledOnce()
    await expect(args.onStepAction).toHaveBeenLastCalledWith(
      'add-after',
      'decide',
      expect.objectContaining({ id: 'decide-reminder' }),
    )
  },
}

export const EdgeRemovesConnection: Story = {
  render: ({ onConnectionsChange }) => (
    <FlowCanvas
      {...collectionsProps}
      onConnectionsChange={onConnectionsChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const remove = await within(canvasElement).findByRole('button', {
      name: 'Remover a conexão do caminho Contestou',
    })
    await userEvent.click(remove)
    await closeTooltips(remove)
    await expect(args.onConnectionsChange).toHaveBeenCalledOnce()
    await expect(args.onConnectionsChange).toHaveBeenLastCalledWith(
      collectionsConnections.filter((item) => item.id !== 'decide-dispute'),
    )
  },
}

export const StepMenuAddsBranch: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas {...collectionsProps} onStepAction={onStepAction} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      await within(canvasElement).findByRole('button', {
        name: 'Ações de Decidir abordagem',
      }),
    )
    const menu = await screen.findByRole('menu')
    await expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Ver', 'Editar', 'Adicionar ramo', 'Excluir'])
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Adicionar ramo' }),
    )
    await expect(args.onStepAction).toHaveBeenCalledOnce()
    await expect(args.onStepAction).toHaveBeenLastCalledWith(
      'add-branch',
      'decide',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull(), {
      timeout,
    })
  },
}

export const LockedBlocksDragging: Story = {
  render: () => <FlowCanvas {...leadRoutingProps} locked snapToGrid />,
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole('group', {
      name: 'Lead qualificado?, Condição, Sucesso',
    })
    await waitFor(() =>
      expect(canvasRegion(canvasElement)).toHaveAttribute(
        'data-locked',
        'true',
      ),
    )
    await expect(
      canvasElement.querySelectorAll('.react-flow__node.draggable'),
    ).toHaveLength(0)
  },
}

export const LockedDisablesMutatingControls: Story = {
  render: () => (
    <FlowCanvas
      {...twoStepsProps}
      direction="vertical"
      locked
      selectedStepId="mail"
    />
  ),
  play: async () => {
    const button = async (name: string) =>
      (await screen.findAllByRole('button', { name }))[0]

    await expect(await button('Excluir Enviar e-mail')).toBeDisabled()
    await expect(await button('Duplicar Enviar e-mail')).toBeDisabled()
    await expect(
      await button('Adicionar um passo depois de Enviar e-mail'),
    ).toBeDisabled()
    await expect(await button('Editar Enviar e-mail')).toBeEnabled()
    await expect(await button('Ver Enviar e-mail')).toBeEnabled()
    await expect(await button('Adicionar um passo aqui')).toBeDisabled()
    await expect(await button('Remover esta conexão')).toBeDisabled()
  },
}

export const LockForcesSelectMode: Story = {
  render: function LockableCanvas() {
    const [locked, setLocked] = useState(false)
    return (
      <FlowCanvas {...twoStepsProps} locked={locked}>
        <FlowCanvasControls>
          <LockToggle locked={locked} onLockedChange={setLocked} />
        </FlowCanvasControls>
      </FlowCanvas>
    )
  },
  play: async ({ canvasElement }) => {
    await mailStep(canvasElement)
    const region = canvasRegion(canvasElement)

    region.focus()
    await userEvent.keyboard('h')
    await expect(region).toHaveAttribute('data-mode', 'pan')

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Travar canvas' }),
    )
    await expect(region).toHaveAttribute('data-mode', 'select')
  },
}

export const ControlsSwitchMode: Story = {
  render: () => (
    <FlowCanvas {...twoStepsProps}>
      <FlowCanvasControls />
    </FlowCanvas>
  ),
  play: async ({ canvasElement }) => {
    await mailStep(canvasElement)
    const region = canvasRegion(canvasElement)
    const mode = within(canvasElement).getByRole('group', {
      name: 'Modo do cursor',
    })
    const select = within(mode).getByRole('button', { name: 'Selecionar' })
    const pan = within(mode).getByRole('button', { name: 'Mover' })
    await expect(select).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(pan)
    await expect(region).toHaveAttribute('data-mode', 'pan')
    await expect(pan).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(select)
    await expect(region).toHaveAttribute('data-mode', 'select')
  },
}

export const LoadingIsBusy: Story = {
  render: () => <FlowCanvas {...twoStepsProps} loading />,
  play: async ({ canvasElement }) => {
    await expect(canvasRegion(canvasElement)).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvasElement.querySelectorAll('.react-flow__node'),
    ).toHaveLength(0)
    await expect(
      canvasElement.querySelector('[data-slot="flow-canvas-empty"]'),
    ).toBeNull()
  },
}

export const EmptyWithoutSteps: Story = {
  render: () => <FlowCanvas connections={[]} steps={[]} />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.react-flow')).not.toBeNull()
    await expect(
      within(canvasElement).getByText('Nenhum passo ainda'),
    ).toBeVisible()
  },
}

export const DropCallsOnStepDrop: Story = {
  render: ({ onStepDrop }) => (
    <FlowCanvas {...twoStepsProps} onStepDrop={onStepDrop} />
  ),
  play: async ({ args, canvasElement }) => {
    drop(await pane(canvasElement), {
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(mail),
    })
    await expect(args.onStepDrop).toHaveBeenCalledOnce()
    await expect(args.onStepDrop).toHaveBeenLastCalledWith(mail, {
      x: expect.any(Number),
      y: expect.any(Number),
    })
    const [, position] = (args.onStepDrop as ReturnType<typeof fn>).mock
      .calls[0] as [FlowStepType, FlowPosition]
    await expect(Number.isFinite(position.x)).toBe(true)
    await expect(Number.isFinite(position.y)).toBe(true)
  },
}

export const DropSnapsToGrid: Story = {
  render: ({ onStepDrop }) => (
    <FlowCanvas {...twoStepsProps} onStepDrop={onStepDrop} snapToGrid />
  ),
  play: async ({ args, canvasElement }) => {
    drop(await pane(canvasElement), {
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(mail),
    })
    await expect(args.onStepDrop).toHaveBeenCalledOnce()
    const [, position] = (args.onStepDrop as ReturnType<typeof fn>).mock
      .calls[0] as [FlowStepType, FlowPosition]
    await expect(Math.abs(position.x % 16)).toBe(0)
    await expect(Math.abs(position.y % 16)).toBe(0)
  },
}

export const DropIgnoresInvalidPayload: Story = {
  render: ({ onStepDrop }) => (
    <FlowCanvas {...twoStepsProps} onStepDrop={onStepDrop} />
  ),
  play: async ({ args, canvasElement }) => {
    const target = await pane(canvasElement)
    drop(target, { 'text/plain': 'x' })
    drop(target, { [FLOW_STEP_TRANSFER_TYPE]: 'not json' })
    await expect(args.onStepDrop).not.toHaveBeenCalled()
  },
}

export const DropIgnoredWhileLocked: Story = {
  render: ({ onStepDrop }) => (
    <FlowCanvas {...twoStepsProps} locked onStepDrop={onStepDrop} />
  ),
  play: async ({ args, canvasElement }) => {
    drop(await pane(canvasElement), {
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(mail),
    })
    await expect(args.onStepDrop).not.toHaveBeenCalled()
  },
}

export const BackspaceDeletesSelectedStep: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas
      {...twoStepsProps}
      onStepAction={onStepAction}
      selectedStepId="mail"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await mailStep(canvasElement)
    const region = canvasRegion(canvasElement)
    const input = appendField(region, document.createElement('input'))

    input.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).not.toHaveBeenCalled()
    input.remove()

    region.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).toHaveBeenCalledOnce()
    await expect(args.onStepAction).toHaveBeenLastCalledWith('delete', 'mail')
  },
}

export const BackspaceKeepsTrigger: Story = {
  render: ({ onStepAction }) => (
    <FlowCanvas
      {...twoStepsProps}
      onStepAction={onStepAction}
      selectedStepId="form"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await mailStep(canvasElement)
    canvasRegion(canvasElement).focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).not.toHaveBeenCalled()
  },
}

export const VAndHSwitchMode: Story = {
  render: () => <FlowCanvas {...twoStepsProps} />,
  play: async ({ canvasElement }) => {
    await mailStep(canvasElement)
    const region = canvasRegion(canvasElement)
    const textarea = appendField(region, document.createElement('textarea'))

    textarea.focus()
    await userEvent.keyboard('h')
    await expect(region).toHaveAttribute('data-mode', 'select')
    textarea.remove()

    region.focus()
    await userEvent.keyboard('h')
    await expect(region).toHaveAttribute('data-mode', 'pan')
    await userEvent.keyboard('v')
    await expect(region).toHaveAttribute('data-mode', 'select')
  },
}

export const IgnoresKeysFromOutsideCanvas: Story = {
  render: () => (
    <FlowCanvas {...twoStepsProps}>
      <FlowCanvasControls>
        <FlowShortcutsPopover />
      </FlowCanvasControls>
    </FlowCanvas>
  ),
  play: async ({ canvasElement }) => {
    await mailStep(canvasElement)
    const region = canvasRegion(canvasElement)
    await userEvent.click(
      within(region).getByRole('button', { name: 'Atalhos de teclado' }),
    )
    const popup = await screen.findByRole('dialog', {
      name: 'Atalhos de teclado',
    })
    await waitFor(() =>
      expect(popup.contains(document.activeElement)).toBe(true),
    )
    await expect(region.contains(document.activeElement)).toBe(false)

    await userEvent.keyboard('h')
    await expect(region).toHaveAttribute('data-mode', 'select')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), {
      timeout,
    })
  },
}

export const ShortcutsListed: Story = {
  render: () => <FlowShortcutsPopover />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Atalhos de teclado',
      }),
    )
    const popup = await screen.findByRole('dialog', {
      name: 'Atalhos de teclado',
    })
    await expect(
      within(popup)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'SelecionarV',
      'MoverH',
      'Aumentar zoom+',
      'Diminuir zoom-',
      'Ajustar à telaShift1',
      'Tamanho realShift0',
      'Excluir passoBackspace',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), {
      timeout,
    })
  },
}
