import { afterEach, expect, mock, test } from 'bun:test'
import type { ComponentProps } from 'react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { AssistantPanel } = await import('./assistant-panel')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const suggestions = [
  { id: 'failed', label: 'Por que o passo falhou?' },
  { id: 'skipped', label: 'Quais passos foram pulados?' },
]

function mount(props: Partial<ComponentProps<typeof AssistantPanel>> = {}) {
  return render(<AssistantPanel messages={[]} onSend={() => {}} {...props} />)
}

const panel = () => screen.getByRole('region', { name: 'Assistente' })

test('is a region named Assistente, docked by default', () => {
  mount()

  expect(panel().getAttribute('data-placement')).toBe('docked')
  expect(panel().querySelector('h2')?.textContent).toBe('Assistente')
})

test('floating placement and expanded state reach the root', () => {
  mount({ expanded: true, placement: 'floating' })

  expect(panel().getAttribute('data-placement')).toBe('floating')
  expect(panel().getAttribute('data-expanded')).toBe('true')
  expect(panel().className).toContain('absolute')
})

test('empty shows greeting, description and suggestions, no conversation', () => {
  const onSuggestion = mock()
  mount({
    description: 'Li o fluxo.',
    greeting: 'Oi, Gabriel',
    onSuggestion,
    suggestions,
  })

  expect(screen.getByText('Oi, Gabriel')).toBeTruthy()
  expect(screen.getByText('Li o fluxo.')).toBeTruthy()
  expect(screen.queryByRole('log')).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /pulados/ }))

  expect(onSuggestion).toHaveBeenCalledWith(suggestions[1])
})

test('without suggestions the block is hidden', () => {
  mount({ greeting: 'Oi' })

  expect(screen.queryByText('Experimente perguntar')).toBeNull()
})

test('messages replace the empty state with a log', () => {
  mount({
    greeting: 'Oi, Gabriel',
    messages: [
      { id: '1', role: 'user', text: 'Por que falhou?' },
      { id: '2', role: 'assistant', text: 'Timeout no passo.' },
    ],
    suggestions,
  })

  expect(screen.queryByText('Oi, Gabriel')).toBeNull()
  expect(
    screen.getByRole('log', { name: 'Mensagens do assistente' }),
  ).toBeTruthy()
  expect(screen.getByText('Timeout no passo.')).toBeTruthy()
})

test('typing shows a status with an accessible name', () => {
  mount({ typing: true })

  expect(
    screen
      .getAllByRole('status')
      .some((node) => node.textContent === 'O assistente está digitando'),
  ).toBe(true)
})

test('an errored assistant message offers retry through onRetry', () => {
  const onRetry = mock()
  mount({
    messages: [
      {
        error: true,
        id: 'e1',
        role: 'assistant',
        text: 'Falhou ao responder.',
      },
    ],
    onRetry,
  })

  expect(screen.getByRole('alert').textContent).toContain(
    'Falhou ao responder.',
  )

  fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))

  expect(onRetry).toHaveBeenCalledWith('e1')
})

test('header actions render only with their callback and call it', () => {
  const onNewChat = mock()
  const onExpandedChange = mock()
  const onEnd = mock()
  const { rerender } = mount()

  expect(screen.queryByRole('button', { name: 'Nova conversa' })).toBeNull()

  rerender(
    <AssistantPanel
      expanded={false}
      messages={[]}
      onEnd={onEnd}
      onExpandedChange={onExpandedChange}
      onNewChat={onNewChat}
      onSend={() => {}}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Nova conversa' }))
  fireEvent.click(screen.getByRole('button', { name: 'Expandir' }))
  fireEvent.click(screen.getByRole('button', { name: 'Encerrar' }))

  expect(onNewChat).toHaveBeenCalledTimes(1)
  expect(onExpandedChange).toHaveBeenCalledWith(true)
  expect(onEnd).toHaveBeenCalledTimes(1)
})

test('expanded names the toggle Minimizar and reports false', () => {
  const onExpandedChange = mock()
  mount({ expanded: true, onExpandedChange })

  fireEvent.click(screen.getByRole('button', { name: 'Minimizar' }))

  expect(onExpandedChange).toHaveBeenCalledWith(false)
})

test('badge is optional and the disclaimer is fixed', () => {
  const { rerender } = mount()

  expect(screen.getByText('Beta')).toBeTruthy()
  expect(
    screen.getByText(
      'As respostas podem estar erradas. Confira antes de publicar.',
    ),
  ).toBeTruthy()

  rerender(<AssistantPanel badge={false} messages={[]} onSend={() => {}} />)

  expect(screen.queryByText('Beta')).toBeNull()
})

test('labels override the defaults', () => {
  mount({ labels: { title: 'Copiloto' } })

  expect(screen.getByRole('region', { name: 'Copiloto' })).toBeTruthy()
})
