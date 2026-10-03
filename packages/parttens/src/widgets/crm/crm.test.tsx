import { afterEach, expect, test } from 'bun:test'

await import('../../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ActivityFeedWidget, ContactWidget, DealsWidget, PipelineWidget } =
  await import('./index')

afterEach(cleanup)

test('pipeline widget sums the stages and scales each bar to the largest', () => {
  const periods: string[] = []
  const { container } = render(
    <PipelineWidget
      onPeriodChange={(period) => periods.push(period)}
      period="quarter"
      periods={[
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
      ]}
      stages={[
        { count: 12, id: 'lead', label: 'Lead', value: 40000 },
        { count: 6, id: 'proposal', label: 'Proposal', value: 50000 },
        { count: 2, id: 'won', label: 'Won', value: 10000 },
      ]}
      title="Sales pipeline"
    />,
  )
  const region = screen.getByRole('region', { name: 'Sales pipeline' })
  expect(region.textContent).toContain('$100,000.00')
  expect(region.textContent).toContain('Total no funil')
  expect(region.textContent).toContain('50.00%')
  const bars = [
    ...container.querySelectorAll<HTMLElement>(
      '[data-slot="pipeline-stage"] [aria-hidden] > div',
    ),
  ]
  expect(bars.map((bar) => bar.style.width)).toEqual(['80%', '100%', '20%'])
  expect(bars[1]?.style.backgroundColor).toBe('var(--chart-2)')
  expect(screen.getByRole('list', { name: 'Sales pipeline' }).tagName).toBe(
    'OL',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Month' }))
  expect(periods).toEqual(['month'])
})

test('deals widget lists each deal with stage, owner and value', () => {
  const { container } = render(
    <DealsWidget
      deals={[
        {
          closeLabel: 'Closes Jun 30',
          company: 'Acme Corp',
          id: 'acme',
          name: 'Website redesign',
          owner: { id: 'ana', label: 'Ana Martins' },
          stage: { label: 'Negotiation', tone: 'warning' },
          value: 48000,
        },
        {
          id: 'globex',
          name: 'Annual license',
          stage: { label: 'Won', tone: 'success' },
          value: 12500.5,
        },
      ]}
      title="Top deals"
    />,
  )
  const list = screen.getByRole('list', { name: 'Top deals' })
  expect(list.getAttribute('data-slot')).toBe('deal-list')
  expect(list.querySelectorAll('[data-slot="deal-list-item"]').length).toBe(2)
  expect(list.textContent).toContain('$48,000.00')
  expect(list.textContent).toContain('$12,500.50')
  expect(list.textContent).toContain('Acme Corp')
  expect(list.textContent).toContain('Closes Jun 30')
  const stages = [...container.querySelectorAll('[data-slot="deal-stage"]')]
  expect(stages.map((stage) => stage.textContent)).toEqual([
    'Negotiation',
    'Won',
  ])
  expect(stages[0]?.className).toContain('text-warning-foreground')
  expect(screen.getByRole('list', { name: 'Responsável' }).textContent).toBe(
    'AMAna Martins',
  )
})

test('deals widget shows the empty label without a list', () => {
  render(<DealsWidget deals={[]} emptyLabel="Nothing open" title="Deals" />)
  expect(screen.queryByRole('list')).toBeNull()
  expect(screen.getByText('Nothing open').getAttribute('data-slot')).toBe(
    'deals-empty',
  )
})

test('activity feed names the person before the action and tones only the icon', () => {
  const { container } = render(
    <ActivityFeedWidget
      activities={[
        {
          description: 'Discussed renewal terms.',
          icon: <svg aria-hidden="true" />,
          id: 'call',
          person: { id: 'ana', label: 'Ana Martins' },
          timeLabel: '2h ago',
          title: 'called Acme Corp',
          tone: 'success',
        },
        {
          id: 'mail',
          person: { id: 'gabriel', label: 'Gabriel Melo' },
          timeLabel: 'Yesterday',
          title: 'sent a proposal',
        },
      ]}
      title="Recent activity"
    />,
  )
  const items = [
    ...container.querySelectorAll('[data-slot="activity-feed-item"]'),
  ]
  expect(items.length).toBe(2)
  expect(items[0]?.textContent).toContain('Ana Martins called Acme Corp')
  expect(items[0]?.textContent).toContain('Discussed renewal terms.')
  expect(items[0]?.textContent).toContain('2h ago')
  expect(
    container.querySelector('[data-slot="activity-feed-icon"]')?.className,
  ).toContain('text-success-foreground')
  expect(items[1]?.querySelector('[data-slot="activity-feed-icon"]')).toBeNull()
  expect(screen.getByRole('list', { name: 'Recent activity' }).tagName).toBe(
    'OL',
  )
})

test('contact widget links each channel it has and reuses the activity timeline', () => {
  const { container } = render(
    <ContactWidget
      activities={[
        {
          id: 'call',
          person: { id: 'ana', label: 'Ana Martins' },
          timeLabel: '2h ago',
          title: 'called about the renewal',
        },
      ]}
      company="Acme Corp"
      email="ana@acme.com"
      person={{ id: 'ana', label: 'Ana Martins' }}
      jobTitle="Head of Ops"
      tags={[{ id: 'vip', label: 'VIP' }]}
      whatsapp="+55 (11) 98765-4321"
    />,
  )
  const region = screen.getByRole('region', { name: 'Ana Martins' })
  expect(region.textContent).toContain('Head of Ops · Acme Corp')
  expect(region.textContent).toContain('VIP')
  expect(
    screen.getByRole('link', { name: 'E-mail' }).getAttribute('href'),
  ).toBe('mailto:ana@acme.com')
  expect(
    screen.getByRole('link', { name: 'WhatsApp' }).getAttribute('href'),
  ).toBe('https://wa.me/5511987654321')
  expect(screen.queryByRole('link', { name: 'Ligar' })).toBeNull()
  expect(
    screen.getByRole('list', { name: 'Atividade recente' }).textContent,
  ).toContain('Ana Martins called about the renewal')
  expect(
    container.querySelectorAll('[data-slot="activity-feed-item"]').length,
  ).toBe(1)
})

test('contact widget shows the empty label when there is no activity', () => {
  render(
    <ContactWidget
      activities={[]}
      emptyLabel="Nenhum contato ainda"
      person={{ id: 'joao', label: 'João Lima' }}
      phone="+5511912345678"
    />,
  )
  expect(screen.getByRole('link', { name: 'Ligar' }).getAttribute('href')).toBe(
    'tel:+5511912345678',
  )
  expect(screen.getByText('Nenhum contato ainda')).toBeTruthy()
})
