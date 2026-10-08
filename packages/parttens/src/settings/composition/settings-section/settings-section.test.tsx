import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { SettingsRow } = await import('../settings-row/settings-row')
const { SettingsSection } = await import('./settings-section')

afterEach(cleanup)

test('with title it is a region named by the h2 above the card', () => {
  const { container } = render(
    <SettingsSection title="General">
      <SettingsRow title="Display names" />
      <SettingsRow title="Theme" />
    </SettingsSection>,
  )

  const region = screen.getByRole('region', { name: 'General' })
  const heading = screen.getByRole('heading', { level: 2, name: 'General' })

  expect(region.dataset.slot).toBe('settings-section')
  expect(region.getAttribute('aria-labelledby')).toBe(heading.id)
  expect(heading.nextElementSibling?.getAttribute('data-slot')).toBe(
    'settings-section-card',
  )
  expect(
    container.querySelectorAll(
      '[data-slot="settings-section-card"] > [data-slot="settings-row"]',
    ),
  ).toHaveLength(2)
})

test('without title it is only the card, with no heading or landmark', () => {
  const { container } = render(
    <SettingsSection>
      <SettingsRow title="Email" />
    </SettingsSection>,
  )

  expect(screen.queryByRole('region')).toBeNull()
  expect(screen.queryByRole('heading')).toBeNull()
  expect(
    container.querySelector(
      '[data-slot="settings-section"] > [data-slot="settings-section-card"]',
    ),
  ).not.toBeNull()
})

test('two titled sections get distinct heading ids', () => {
  render(
    <>
      <SettingsSection title="General" />
      <SettingsSection title="Interface and theme" />
    </>,
  )

  const [first, second] = screen.getAllByRole('heading', { level: 2 })

  expect(first?.id).not.toBe(second?.id)
  expect(
    screen.getByRole('region', { name: 'Interface and theme' }),
  ).toBeTruthy()
})
