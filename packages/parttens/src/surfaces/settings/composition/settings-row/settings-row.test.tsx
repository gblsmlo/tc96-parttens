import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { SettingsRow } = await import('./settings-row')

afterEach(cleanup)

const slot = (name: string) =>
  document.querySelector(`[data-slot="settings-row-${name}"]`)

test('renders title and description on the left and endSlot on the right', () => {
  render(
    <SettingsRow
      description="How people's names appear across the interface"
      endSlot={<button type="button">Full name</button>}
      title="Display names"
    />,
  )

  expect(slot('title')?.textContent).toBe('Display names')
  expect(slot('description')?.textContent).toBe(
    "How people's names appear across the interface",
  )
  expect(slot('end')?.textContent).toBe('Full name')
  expect(slot('heading')?.nextElementSibling).toBe(slot('end'))
})

test('renders startSlot before the heading only when passed', () => {
  const { unmount } = render(<SettingsRow title="Font size" />)

  expect(slot('start')).toBeNull()

  unmount()
  render(
    <SettingsRow startSlot={<svg data-testid="icon" />} title="Font size" />,
  )

  expect(slot('start')?.querySelector('svg')).not.toBeNull()
  expect(slot('start')?.nextElementSibling).toBe(slot('heading'))
})

test('without description and endSlot only the title is drawn', () => {
  render(<SettingsRow title="Email" />)

  expect(slot('description')).toBeNull()
  expect(slot('end')).toBeNull()
  expect(slot('heading')?.children).toHaveLength(1)
})
