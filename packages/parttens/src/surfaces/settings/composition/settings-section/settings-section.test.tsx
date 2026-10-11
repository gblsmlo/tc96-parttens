import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { SettingsRow } = await import('../settings-row/settings-row')
const { SettingsSection } = await import('./settings-section')
const {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} = await import('./settings-section-header')

afterEach(cleanup)

const slot = (name: string) =>
  document.querySelector(`[data-slot="settings-section-${name}"]`)

function header(title: string) {
  return (
    <SettingsSectionHeader>
      <SettingsSectionTitle>{title}</SettingsSectionTitle>
    </SettingsSectionHeader>
  )
}

test('with header it is a region named by the h2 above the card', () => {
  const { container } = render(
    <SettingsSection header={header('General')}>
      <SettingsRow title="Display names" />
      <SettingsRow title="Theme" />
    </SettingsSection>,
  )

  const region = screen.getByRole('region', { name: 'General' })
  const heading = screen.getByRole('heading', { level: 2, name: 'General' })

  expect(region.dataset.slot).toBe('settings-section')
  expect(region.getAttribute('aria-labelledby')).toBe(heading.id)
  expect(slot('header')?.nextElementSibling?.getAttribute('data-slot')).toBe(
    'card',
  )
  expect(
    container.querySelectorAll(
      '[data-slot="card"] > [data-slot="settings-section-rows"] > [data-slot="settings-row"]',
    ),
  ).toHaveLength(2)
})

test('the header draws description and actions only when passed', () => {
  const { unmount } = render(<SettingsSection header={header('General')} />)

  expect(slot('description')).toBeNull()
  expect(slot('actions')).toBeNull()

  unmount()
  render(
    <SettingsSection
      header={
        <SettingsSectionHeader
          actions={<button type="button">New label</button>}
        >
          <SettingsSectionTitle>Labels</SettingsSectionTitle>
          <SettingsSectionDescription>
            Organize leads and tasks
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    />,
  )

  expect(slot('description')?.textContent).toBe('Organize leads and tasks')
  expect(slot('description')?.previousElementSibling).toBe(slot('title'))
  expect(slot('actions')?.textContent).toBe('New label')
})

test('without header it is only the card, with no heading or landmark', () => {
  const { container } = render(
    <SettingsSection>
      <SettingsRow title="Email" />
    </SettingsSection>,
  )

  expect(screen.queryByRole('region')).toBeNull()
  expect(screen.queryByRole('heading')).toBeNull()
  expect(
    container.querySelector(
      '[data-slot="settings-section"] > [data-slot="card"]',
    ),
  ).not.toBeNull()
})

test('two sections with headers get distinct heading ids', () => {
  render(
    <>
      <SettingsSection header={header('General')} />
      <SettingsSection header={header('Interface and theme')} />
    </>,
  )

  const [first, second] = screen.getAllByRole('heading', { level: 2 })

  expect(first?.id).not.toBe(second?.id)
  expect(
    screen.getByRole('region', { name: 'Interface and theme' }),
  ).toBeTruthy()
})
