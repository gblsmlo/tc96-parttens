import { afterEach, expect, test } from 'bun:test'
import { useState } from 'react'

await import('../../test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, {
  AbortController: window.AbortController,
  AbortSignal: window.AbortSignal,
  ResizeObserver: ResizeObserverStub,
})
Object.assign(window.Element.prototype, { getAnimations: () => [] })

const { act, cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { RecordGroupSubgroup } = await import('./record-group-subgroup')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const trigger = () => screen.getByRole('button', { name: /Versão 2/ })

test('starts closed under an h3 and opens from the title', async () => {
  render(
    <RecordGroupSubgroup title="Versão 2">
      <p>Body</p>
    </RecordGroupSubgroup>,
  )

  const heading = screen.getByRole('heading', { level: 3 })

  expect(heading.contains(trigger())).toBe(true)
  expect(trigger().getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Body')).toBeNull()
  expect(screen.queryByRole('region')).toBeNull()

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('true')
})

test('opens from defaultOpen and reports every toggle', async () => {
  const changes: boolean[] = []
  render(
    <RecordGroupSubgroup
      defaultOpen
      onOpenChange={(next) => changes.push(next)}
      title="Versão 2"
    >
      <p>Body</p>
    </RecordGroupSubgroup>,
  )

  expect(screen.queryByText('Body')).not.toBeNull()

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())
  expect(changes).toEqual([false])
})

test('follows open when controlled', async () => {
  function Controlled() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)} type="button">
          Open outside
        </button>
        <RecordGroupSubgroup open={open} title="Versão 2">
          <p>Body</p>
        </RecordGroupSubgroup>
      </>
    )
  }
  render(<Controlled />)

  expect(screen.queryByText('Body')).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: 'Open outside' }))

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
})

test('puts meta inside the trigger, so it is part of the accessible name', () => {
  render(<RecordGroupSubgroup meta="Rascunho" title="Versão 2" />)

  const meta = document.querySelector(
    '[data-slot="record-group-subgroup-meta"]',
  )

  expect(trigger().contains(meta)).toBe(true)
  expect(screen.getByRole('button', { name: 'Versão 2 Rascunho' })).toBe(
    trigger(),
  )
})
