import { afterEach, expect, mock, test } from 'bun:test'
import type { ComponentProps } from 'react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen, within } = await import(
  '@testing-library/react'
)
const { FlowInspector } = await import('./flow-inspector')

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      addEventListener: () => {},
      addListener: () => {},
      dispatchEvent: () => false,
      matches,
      media: query,
      onchange: null,
      removeEventListener: () => {},
      removeListener: () => {},
    }),
  })
}

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function mount(props: Partial<ComponentProps<typeof FlowInspector>> = {}) {
  return render(
    <FlowInspector
      build={<p>Conteúdo do build</p>}
      logs={<p>Conteúdo dos logs</p>}
      onClose={() => {}}
      onTabChange={() => {}}
      open
      status={<p>Conteúdo do status</p>}
      tab="build"
      title="Enviar mensagem"
      {...props}
    >
      <button type="button">Salvar passo</button>
    </FlowInspector>,
  )
}

test('docks an aside named Detalhes do passo from md', () => {
  stubMatchMedia(true)
  mount()
  const aside = screen.getByRole('complementary', { name: 'Detalhes do passo' })
  expect(aside.getAttribute('data-docked')).toBe('true')
  expect(aside.hasAttribute('inert')).toBe(false)
  expect(aside.style.getPropertyValue('--flow-inspector-width')).toBe('24rem')
})

test('closes the aside with zero width and inert', () => {
  stubMatchMedia(true)
  mount({ open: false })
  const aside = document.querySelector('aside') as HTMLElement
  expect(aside.getAttribute('data-docked')).toBe('false')
  expect(aside.hasAttribute('inert')).toBe(true)
  expect(aside.className).toContain('w-0')
})

test('takes the width from the prop', () => {
  stubMatchMedia(true)
  mount({ width: '30rem' })
  const aside = screen.getByRole('complementary', { name: 'Detalhes do passo' })
  expect(aside.style.getPropertyValue('--flow-inspector-width')).toBe('30rem')
})

test('renders the header, the active panel and the footer', () => {
  stubMatchMedia(true)
  mount({ badge: 'Ação · send', icon: <svg data-testid="icon" /> })
  expect(screen.getByRole('heading', { name: 'Enviar mensagem' })).toBeTruthy()
  expect(screen.getByText('Ação · send')).toBeTruthy()
  expect(screen.getByTestId('icon')).toBeTruthy()
  expect(screen.getByText('Conteúdo do build')).toBeTruthy()
  expect(screen.queryByText('Conteúdo dos logs')).toBeNull()
  expect(screen.getByRole('button', { name: 'Salvar passo' })).toBeTruthy()
})

test('calls onClose from the close button', () => {
  stubMatchMedia(true)
  const onClose = mock(() => {})
  mount({ onClose })
  fireEvent.click(
    screen.getByRole('button', { name: 'Fechar detalhes do passo' }),
  )
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('lists Build, Status and Logs as tabs and reports a change', () => {
  stubMatchMedia(true)
  const onTabChange = mock((_tab: string) => {})
  mount({ onTabChange })
  const tabs = screen.getAllByRole('tab')
  expect(tabs.map((tab) => tab.textContent)).toEqual([
    'Build',
    'Status',
    'Logs',
  ])
  expect(
    screen.getByRole('tab', { name: 'Build' }).getAttribute('aria-selected'),
  ).toBe('true')
  fireEvent.click(screen.getByRole('tab', { name: 'Status' }))
  expect(onTabChange).toHaveBeenCalledWith('status')
})

test('shows the panel of the controlled tab', () => {
  stubMatchMedia(true)
  mount({ tab: 'logs' })
  expect(screen.getByText('Conteúdo dos logs')).toBeTruthy()
  expect(screen.queryByText('Conteúdo do build')).toBeNull()
})

test('disables the tabs in disabledTabs and does not report them', () => {
  stubMatchMedia(true)
  const onTabChange = mock((_tab: string) => {})
  mount({ disabledTabs: ['status', 'logs'], onTabChange })
  const status = screen.getByRole('tab', { name: 'Status' })
  expect(
    status.hasAttribute('disabled') ||
      status.getAttribute('aria-disabled') === 'true',
  ).toBe(true)
  fireEvent.click(status)
  expect(onTabChange).not.toHaveBeenCalled()
})

test('shows the unconnected alert only in Build', () => {
  stubMatchMedia(true)
  const { unmount } = mount({ unconnected: true })
  const alert = screen.getByRole('alert')
  expect(within(alert).getByText('Nada chega a este passo.')).toBeTruthy()
  expect(within(alert).getByText('Conecte um passo a este.')).toBeTruthy()
  unmount()
  mount({ tab: 'status', unconnected: true })
  expect(screen.queryByRole('alert')).toBeNull()
})

test('omits the footer without children', () => {
  stubMatchMedia(true)
  render(
    <FlowInspector
      onClose={() => {}}
      onTabChange={() => {}}
      open
      tab="build"
      title="Passo"
    />,
  )
  expect(
    document.querySelector('[data-slot="flow-inspector-footer"]'),
  ).toBeNull()
})

test('takes the labels from the prop', () => {
  stubMatchMedia(true)
  mount({ labels: { close: 'Close step details', title: 'Step details' } })
  expect(
    screen.getByRole('complementary', { name: 'Step details' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('button', { name: 'Close step details' }),
  ).toBeTruthy()
})

test('opens a Sheet with the same content below md', async () => {
  stubMatchMedia(false)
  mount()
  const dialog = await screen.findByRole('dialog', {
    name: 'Detalhes do passo',
  })
  expect(document.querySelector('aside')).toBeNull()
  expect(within(dialog).getByText('Conteúdo do build')).toBeTruthy()
  expect(within(dialog).getAllByRole('tab')).toHaveLength(3)
  expect(
    within(dialog).getByRole('button', { name: 'Salvar passo' }),
  ).toBeTruthy()
})

test('renders nothing below md while closed', () => {
  stubMatchMedia(false)
  mount({ open: false })
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.querySelector('aside')).toBeNull()
})

test('calls onClose when the Sheet is dismissed with Escape', async () => {
  stubMatchMedia(false)
  const onClose = mock(() => {})
  mount({ onClose })
  const dialog = await screen.findByRole('dialog', {
    name: 'Detalhes do passo',
  })
  await act(async () => {
    fireEvent.keyDown(dialog, { key: 'Escape' })
  })
  expect(onClose).toHaveBeenCalled()
})
