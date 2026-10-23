import { afterEach, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { FlowCanvas } = await import('./flow-canvas')
const { FlowShortcutsPopover } = await import(
  '../../components/flow-shortcuts-popover'
)
const { FLOW_STEP_TRANSFER_TYPE, serializeStepTransfer } = await import(
  '../../core'
)

afterEach(cleanup)

const steps = [
  {
    id: 'form',
    kind: 'trigger' as const,
    name: 'Novo lead',
    position: { x: 0, y: 0 },
    type: 'form',
  },
  {
    id: 'mail',
    name: 'Enviar e-mail',
    position: { x: 300, y: 0 },
    type: 'mail',
  },
]
const connections = [{ id: 'form-mail', source: 'form', target: 'mail' }]
const stepTypes = [
  { group: 'g', id: 'form', kind: 'trigger' as const, label: 'Formulário' },
  { group: 'g', id: 'mail', label: 'E-mail' },
]

function dataTransfer(payload: Record<string, string>) {
  return {
    dropEffect: 'none',
    getData: (type: string) => payload[type] ?? '',
    types: Object.keys(payload),
  }
}

test('mounts a region named by labels.canvas with aria-busy while loading', () => {
  const { container } = render(
    <FlowCanvas connections={[]} loading steps={[]} />,
  )
  const region = screen.getByRole('region', { name: 'Canvas do fluxo' })
  expect(region.getAttribute('aria-busy')).toBe('true')
  expect(container.querySelector('[data-slot="flow-canvas-empty"]')).toBeNull()
})

test('shows the empty state without steps', () => {
  render(<FlowCanvas connections={[]} steps={[]} />)
  expect(screen.getByText('Nenhum passo ainda')).toBeTruthy()
})

test('renders one group per step named by name, type and state', () => {
  render(
    <FlowCanvas
      connections={connections}
      stepTypes={stepTypes}
      steps={steps}
    />,
  )
  const node = screen.getByRole('group', {
    name: 'Enviar e-mail, E-mail, Não executado',
  })
  expect(node.getAttribute('aria-roledescription')).toBe('passo')
})

test('calls onStepDrop with the parsed type and the flow position', () => {
  const onStepDrop = mock()
  const { container } = render(
    <FlowCanvas
      connections={connections}
      onStepDrop={onStepDrop}
      steps={steps}
    />,
  )
  const type = { group: 'g', id: 'mail', label: 'E-mail' }
  const event = new window.MouseEvent('drop', {
    bubbles: true,
    clientX: 120,
    clientY: 80,
  })
  Object.defineProperty(event, 'dataTransfer', {
    value: dataTransfer({
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(type),
    }),
  })
  fireEvent(container.querySelector('.react-flow') as Element, event)
  expect(onStepDrop).toHaveBeenCalledTimes(1)
  expect(onStepDrop.mock.calls[0]?.[0]).toEqual(type)
  const position = onStepDrop.mock.calls[0]?.[1] as { x: number; y: number }
  expect(Number.isFinite(position.x)).toBe(true)
  expect(Number.isFinite(position.y)).toBe(true)
})

test('ignores a drop without a valid payload and a drop while locked', () => {
  const onStepDrop = mock()
  const { container, rerender } = render(
    <FlowCanvas
      connections={connections}
      onStepDrop={onStepDrop}
      steps={steps}
    />,
  )
  const pane = container.querySelector('.react-flow') as Element
  fireEvent.drop(pane, { dataTransfer: dataTransfer({ 'text/plain': 'x' }) })
  fireEvent.drop(pane, {
    dataTransfer: dataTransfer({ [FLOW_STEP_TRANSFER_TYPE]: 'not json' }),
  })
  rerender(
    <FlowCanvas
      connections={connections}
      locked
      onStepDrop={onStepDrop}
      steps={steps}
    />,
  )
  fireEvent.drop(pane, {
    dataTransfer: dataTransfer({
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer({
        group: 'g',
        id: 'mail',
        label: 'E-mail',
      }),
    }),
  })
  expect(onStepDrop).not.toHaveBeenCalled()
})

test('Backspace deletes the selected step, except the trigger and inside a text field', () => {
  const onStepAction = mock()
  const { rerender } = render(
    <FlowCanvas
      connections={connections}
      onStepAction={onStepAction}
      selectedStepId="mail"
      stepTypes={stepTypes}
      steps={steps}
    />,
  )
  const region = screen.getByRole('region', { name: 'Canvas do fluxo' })
  const input = document.createElement('input')
  region.append(input)
  fireEvent.keyDown(input, { key: 'Backspace' })
  expect(onStepAction).not.toHaveBeenCalled()
  fireEvent.keyDown(region, { key: 'Backspace' })
  expect(onStepAction).toHaveBeenCalledWith('delete', 'mail')

  onStepAction.mockClear()
  rerender(
    <FlowCanvas
      connections={connections}
      onStepAction={onStepAction}
      selectedStepId="form"
      stepTypes={stepTypes}
      steps={steps}
    />,
  )
  fireEvent.keyDown(region, { key: 'Backspace' })
  expect(onStepAction).not.toHaveBeenCalled()
})

test('V and H switch the mode and are ignored inside a textarea', () => {
  render(<FlowCanvas connections={connections} steps={steps} />)
  const region = screen.getByRole('region', { name: 'Canvas do fluxo' })
  const textarea = document.createElement('textarea')
  region.append(textarea)
  fireEvent.keyDown(textarea, { key: 'h' })
  expect(region.getAttribute('data-mode')).toBe('select')
  fireEvent.keyDown(region, { key: 'h' })
  expect(region.getAttribute('data-mode')).toBe('pan')
  fireEvent.keyDown(region, { key: 'v' })
  expect(region.getAttribute('data-mode')).toBe('select')
})

test('the shortcuts popover trigger is a named button', () => {
  render(<FlowShortcutsPopover />)
  expect(
    screen.getByRole('button', { name: 'Atalhos de teclado' }),
  ).toBeTruthy()
})

test('locked disables the mutating controls and keeps view and edit', () => {
  render(
    <FlowCanvas
      connections={connections}
      direction="vertical"
      locked
      selectedStepId="mail"
      stepTypes={stepTypes}
      steps={steps}
    />,
  )
  const disabled = (name: string) =>
    (screen.getAllByRole('button', { name })[0] as HTMLButtonElement).disabled
  expect(disabled('Excluir Enviar e-mail')).toBe(true)
  expect(disabled('Duplicar Enviar e-mail')).toBe(true)
  expect(disabled('Adicionar um passo depois de Enviar e-mail')).toBe(true)
  expect(disabled('Editar Enviar e-mail')).toBe(false)
  expect(disabled('Ver Enviar e-mail')).toBe(false)
  expect(disabled('Adicionar um passo aqui')).toBe(true)
  expect(disabled('Remover esta conexão')).toBe(true)
})

test('a locked canvas shows the select mode even after switching to pan', () => {
  const { rerender } = render(
    <FlowCanvas connections={connections} steps={steps} />,
  )
  const region = screen.getByRole('region', { name: 'Canvas do fluxo' })
  fireEvent.keyDown(region, { key: 'h' })
  expect(region.getAttribute('data-mode')).toBe('pan')
  rerender(<FlowCanvas connections={connections} locked steps={steps} />)
  expect(region.getAttribute('data-mode')).toBe('select')
})

test('shortcuts ignore key events whose target is outside the canvas', () => {
  render(<FlowCanvas connections={connections} steps={steps} />)
  const region = screen.getByRole('region', { name: 'Canvas do fluxo' })
  const outside = document.createElement('button')
  document.body.append(outside)
  const event = new window.KeyboardEvent('keydown', { key: 'h' })
  Object.defineProperty(event, 'target', { value: outside })
  fireEvent(region, event)
  expect(region.getAttribute('data-mode')).toBe('select')
  outside.remove()
})
