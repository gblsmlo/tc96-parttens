import { afterEach, expect, test } from 'bun:test'
import type { SVGProps } from 'react'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { RecordGroupAction } = await import('./record-group-action')

afterEach(cleanup)

function Icon(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} />
}

test('is a button whose accessible name is the label and nothing else', () => {
  render(<RecordGroupAction icon={Icon} label="Add property" />)

  const button = screen.getByRole('button', { name: 'Add property' })

  expect(button.getAttribute('aria-label')).toBe('Add property')
  expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  expect(button.textContent).toBe('')
})

test('calls onClick and ignores clicks while disabled', () => {
  let clicks = 0
  const { rerender } = render(
    <RecordGroupAction
      icon={Icon}
      label="Add property"
      onClick={() => {
        clicks += 1
      }}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Add property' }))
  rerender(
    <RecordGroupAction
      disabled
      icon={Icon}
      label="Add property"
      onClick={() => {
        clicks += 1
      }}
    />,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Add property' }))

  expect(clicks).toBe(1)
})
