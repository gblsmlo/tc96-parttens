import { afterEach, expect, test } from 'bun:test'

await import('./test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { EditorTitle } = await import('./editor-title')

afterEach(cleanup)

test('names the heading by the empty label until the title has text', () => {
  render(<EditorTitle emptyLabel="Nota sem título" />)
  const heading = screen.getByRole('heading', { level: 1 })
  expect(heading.querySelector('.sr-only')?.textContent).toBe('Nota sem título')

  fireEvent.change(screen.getByRole('textbox', { name: 'Título' }), {
    target: { value: 'Phrasal verbs' },
  })
  expect(heading.querySelector('.sr-only')).toBeNull()
  expect(screen.getByRole('textbox', { name: 'Título' })).toHaveProperty(
    'value',
    'Phrasal verbs',
  )
})

test('flattens pasted line breaks and reports the flat value', () => {
  const changes: string[] = []
  render(
    <EditorTitle
      emptyLabel="Nota sem título"
      onChange={(v) => changes.push(v)}
    />,
  )
  fireEvent.change(screen.getByRole('textbox', { name: 'Título' }), {
    target: { value: 'Phrasal\n\nverbs' },
  })
  expect(changes).toEqual(['Phrasal verbs'])
})

test('shows the counter from counterFrom and hands Enter to the caller', () => {
  let entered = 0
  render(
    <EditorTitle
      counterFrom={5}
      defaultValue="Phrasal"
      emptyLabel="Nota sem título"
      max={80}
      onEnter={() => {
        entered += 1
      }}
    />,
  )
  const field = screen.getByRole('textbox', { name: 'Título' })
  expect(field.getAttribute('aria-describedby')).not.toBeNull()
  expect(screen.getByText('7/80')).toBeDefined()
  fireEvent.keyDown(field, { key: 'Enter' })
  expect(entered).toBe(1)
})
