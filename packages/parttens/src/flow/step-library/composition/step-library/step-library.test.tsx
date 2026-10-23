import { afterEach, expect, mock, test } from 'bun:test'
import type { FlowStepType } from '../../../canvas/core'
import type { FlowStepGroup } from '../../core'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen, within } = await import(
  '@testing-library/react'
)
const { FlowStepLibrary } = await import('./step-library')
const { FLOW_STEP_TRANSFER_TYPE, parseStepTransfer } = await import(
  '../../../canvas/core'
)

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const sendEmail: FlowStepType = {
  description: 'Envia uma mensagem por e-mail',
  group: 'Mensagens',
  id: 'send-email',
  kind: 'action',
  label: 'Enviar e-mail',
}
const readRecord: FlowStepType = {
  group: 'Dados',
  id: 'read-record',
  kind: 'trigger',
  label: 'Ler registro',
}

const groups: FlowStepGroup[] = [
  { label: 'Mensagens', types: [sendEmail] },
  { label: 'Dados', types: [readRecord] },
]

function mount(props: Partial<Parameters<typeof FlowStepLibrary>[0]> = {}) {
  return render(<FlowStepLibrary groups={groups} onAdd={() => {}} {...props} />)
}

test('lists each group with its label and each step as a draggable button', () => {
  mount()

  const messages = screen.getByRole('group', { name: 'Mensagens' })
  const item = within(messages).getByRole('button', { name: 'Enviar e-mail' })

  expect(item.getAttribute('draggable')).toBe('true')
  expect(screen.getByRole('group', { name: 'Dados' })).toBeTruthy()
  expect(item.getAttribute('aria-describedby')).toBeTruthy()
})

test('calls onAdd with the step type when the item is clicked', () => {
  const onAdd = mock(() => {})
  mount({ onAdd })

  fireEvent.click(screen.getByRole('button', { name: 'Ler registro' }))

  expect(onAdd).toHaveBeenCalledWith(readRecord)
})

test('writes the step type under the flow transfer type on drag start', () => {
  mount()
  const data: Record<string, string> = {}
  const dataTransfer = {
    effectAllowed: 'all',
    setData: (format: string, value: string) => {
      data[format] = value
    },
  }

  fireEvent.dragStart(screen.getByRole('button', { name: 'Enviar e-mail' }), {
    dataTransfer,
  })

  expect(parseStepTransfer(data[FLOW_STEP_TRANSFER_TYPE])).toEqual(sendEmail)
  expect(dataTransfer.effectAllowed).toBe('copy')
})

test('shows skeletons and aria-busy while loading', () => {
  const { container } = mount({ groups: [], loading: true })
  const section = screen.getByRole('region', { name: 'Passos' })

  expect(section.getAttribute('aria-busy')).toBe('true')
  expect(
    container.querySelectorAll('[data-slot="skeleton"]').length,
  ).toBeGreaterThan(0)
  expect(screen.queryByRole('button')).toBeNull()
})

test('shows the empty description when there are no groups', () => {
  mount({ groups: [] })

  expect(screen.getByText('Nenhum passo disponível')).toBeTruthy()
  expect(screen.queryByRole('group')).toBeNull()
})

test('renders children in the footer and the title and hint from labels', () => {
  mount({
    children: <p>Última execução</p>,
    labels: { hint: 'Dica', title: 'Biblioteca' },
  })

  expect(screen.getByRole('heading', { name: 'Biblioteca' })).toBeTruthy()
  expect(screen.getByText('Dica', { selector: 'p' }).id).toBeTruthy()
  expect(
    document.querySelector('[data-slot="flow-step-library-footer"]')
      ?.textContent,
  ).toBe('Última execução')
})
