import { afterEach, expect, test } from 'bun:test'

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
const { RecordPreviewAction } = await import('./record-preview-action')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

test('is a button named by the label that calls onClick', () => {
  let clicks = 0
  render(
    <RecordPreviewAction
      label="Open as page"
      onClick={() => {
        clicks += 1
      }}
    >
      <svg aria-hidden="true" />
    </RecordPreviewAction>,
  )

  const button = screen.getByRole('button', { name: 'Open as page' })
  fireEvent.click(button)

  expect(button.getAttribute('aria-label')).toBe('Open as page')
  expect(clicks).toBe(1)
})

test('shows the label as the tooltip text', async () => {
  render(
    <RecordPreviewAction label="Open as page">
      <svg aria-hidden="true" />
    </RecordPreviewAction>,
  )

  const button = screen.getByRole('button', { name: 'Open as page' })
  await act(async () => {
    button.focus()
    fireEvent.focus(button)
  })

  await waitFor(() =>
    expect(
      document.querySelector('[data-slot="tooltip-popup"]')?.textContent,
    ).toBe('Open as page'),
  )
})

test('does not call onClick while disabled', () => {
  let clicks = 0
  render(
    <RecordPreviewAction
      disabled
      label="Open as page"
      onClick={() => {
        clicks += 1
      }}
    >
      <svg aria-hidden="true" />
    </RecordPreviewAction>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Open as page' }))

  expect(clicks).toBe(0)
})
