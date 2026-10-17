import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { RecordPreviewBody } = await import('./record-preview-body')

afterEach(cleanup)

test('stacks its children in a column with a 4px gap', () => {
  render(
    <RecordPreviewBody>
      <p>First</p>
      <p>Second</p>
    </RecordPreviewBody>,
  )

  const body = document.querySelector(
    '[data-slot="record-preview-body"]',
  ) as HTMLElement

  expect(body.className.split(' ')).toEqual(['flex', 'flex-col', 'gap-4'])
  expect([...body.children].map((child) => child.textContent)).toEqual([
    'First',
    'Second',
  ])
})

test('merges the consumer className', () => {
  render(<RecordPreviewBody className="extra">Body</RecordPreviewBody>)

  const body = document.querySelector(
    '[data-slot="record-preview-body"]',
  ) as HTMLElement

  expect(body.className.split(' ')).toContain('extra')
  expect(body.className.split(' ')).toContain('gap-4')
})
