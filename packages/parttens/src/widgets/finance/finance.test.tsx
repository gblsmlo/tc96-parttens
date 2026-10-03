import { afterEach, expect, test } from 'bun:test'

await import('../../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { cleanup, fireEvent, render, screen, within } = await import(
  '@testing-library/react'
)
const {
  BudgetWidget,
  CashFlowWidget,
  InvoiceStatusWidget,
  TransactionsWidget,
} = await import('./index')

afterEach(cleanup)

test('budget widget sums the categories and flags the one over its limit', () => {
  const { container } = render(
    <BudgetWidget
      categories={[
        { id: 'food', label: 'Groceries', limit: 600, spent: 420 },
        { id: 'fun', label: 'Entertainment', limit: 200, spent: 260 },
      ]}
      title="Monthly budget"
    />,
  )
  const region = screen.getByRole('region', { name: 'Monthly budget' })
  expect(region.textContent).toContain('$680.00')
  expect(region.textContent).toContain('Limite $800.00')
  expect(region.textContent).toContain('70.00%')
  expect(
    screen
      .getByRole('meter', { name: 'Groceries' })
      .getAttribute('aria-valuenow'),
  ).toBe('420')
  expect(
    screen
      .getByRole('meter', { name: 'Entertainment' })
      .getAttribute('aria-valuenow'),
  ).toBe('200')
  const over = container.querySelector('[data-over="true"]')
  expect(over?.textContent).toContain('Entertainment')
  expect(over?.querySelector('.bg-destructive')).toBeTruthy()
})

test('cash flow widget totals income, expenses and net and describes its chart', () => {
  const periods: string[] = []
  render(
    <CashFlowWidget
      chartLabel="Cash flow over the quarter"
      data={[
        { expenses: 800, income: 1200, label: 'Jan' },
        { expenses: 1500, income: 1000, label: 'Feb' },
      ]}
      expensesLabel="Expenses"
      incomeLabel="Income"
      netLabel="Net"
      onPeriodChange={(period) => periods.push(period)}
      period="q"
      periods={[
        { label: 'Quarter', value: 'q' },
        { label: 'Year', value: 'y' },
      ]}
      title="Cash flow"
    />,
  )
  const region = screen.getByRole('region', { name: 'Cash flow' })
  expect(region.textContent).toContain('Income$2,200.00')
  expect(region.textContent).toContain('Expenses$2,300.00')
  expect(region.textContent).toContain('Net-$100.00')
  expect(
    region.querySelector('.text-destructive-foreground')?.textContent,
  ).toBe('-$100.00')
  expect(
    screen.getByRole('img', { name: 'Cash flow over the quarter' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Year' }))
  expect(periods).toEqual(['y'])
})

test('transactions widget signs credits and shows the empty state', () => {
  const { container, rerender } = render(
    <TransactionsWidget
      title="Recent transactions"
      transactions={[
        {
          amount: 2500,
          id: 'salary',
          meta: 'Salary · Jun 1',
          name: 'Acme Inc.',
        },
        {
          amount: -42.9,
          id: 'coffee',
          meta: 'Food · Jun 2',
          name: 'Coffee shop',
        },
      ]}
    />,
  )
  const list = screen.getByRole('list', { name: 'Recent transactions' })
  const amounts = [...list.querySelectorAll('[data-slot="transaction-amount"]')]
  expect(amounts.map((node) => node.textContent)).toEqual([
    '+$2,500.00',
    '-$42.90',
  ])
  expect(amounts[0]?.className).toContain('text-success-foreground')
  expect(container.querySelector('[data-kind="debit"]')?.textContent).toContain(
    'Coffee shop',
  )
  rerender(
    <TransactionsWidget
      emptyLabel="Nothing yet"
      title="Recent transactions"
      transactions={[]}
    />,
  )
  expect(screen.getByText('Nothing yet')).toBeTruthy()
})

test('invoice status widget totals the statuses and derives each share', () => {
  const { container } = render(
    <InvoiceStatusWidget
      countLabel={(count) => `${count} invoices`}
      statuses={[
        { count: 12, id: 'paid', label: 'Paid', tone: 'success', value: 6000 },
        { count: 3, id: 'due', label: 'Due', tone: 'warning', value: 3000 },
        {
          count: 1,
          id: 'late',
          label: 'Overdue',
          tone: 'destructive',
          value: 1000,
        },
      ]}
      title="Receivables"
      totalLabel="Outstanding"
    />,
  )
  const region = screen.getByRole('region', { name: 'Receivables' })
  expect(region.textContent).toContain('Outstanding')
  expect(region.textContent).toContain('$10,000.00')
  expect(region.textContent).toContain('Paid: 60.00%')
  expect(region.textContent).toContain('Overdue: 10.00%')
  expect(region.textContent).toContain('12 invoices')
  expect(
    container.querySelector(
      '[data-slot="invoice-status-item"][data-tone="warning"]',
    )?.textContent,
  ).toContain('$3,000.00')
})

test('budget widget paints the category icon circle and bar with the same color', () => {
  const { container } = render(
    <BudgetWidget
      categories={[
        {
          color: '#2563eb',
          icon: <svg aria-hidden="true" />,
          id: 'housing',
          label: 'Housing',
          limit: 1800,
          spent: 900,
        },
        { id: 'fallback', label: 'Fallback', limit: 100, spent: 10 },
      ]}
      title="Budget"
    />,
  )
  const rows = [...container.querySelectorAll('[data-slot="budget-category"]')]
  const circle = rows[0]?.querySelector('[data-slot="icon-frame"]')
  const bar = rows[0]?.querySelector(
    '[data-slot="meter-indicator"], [style*="background-color"]',
  )
  expect(circle?.getAttribute('style')).toContain('color: rgb(37, 99, 235)')
  expect(bar?.getAttribute('style')).toContain('rgb(37, 99, 235)')
  expect(rows[1]?.querySelector('[data-slot="icon-frame"]')).toBeNull()
})

test('transactions widget collapses past the visible count and expands into a scroll area', () => {
  const changes: boolean[] = []
  const { container } = render(
    <TransactionsWidget
      onExpandedChange={(next) => changes.push(next)}
      title="Transactions"
      transactions={Array.from({ length: 12 }, (_, index) => ({
        amount: -(index + 1),
        id: `t${index}`,
        name: `Item ${index + 1}`,
      }))}
      visibleCount={5}
    />,
  )
  const region = screen.getByRole('region', { name: 'Transactions' })
  expect(region.getAttribute('data-expanded')).toBe('false')
  expect(within(region).getAllByRole('listitem').length).toBe(5)
  fireEvent.click(
    within(region).getByRole('button', { name: 'Ver todas (+7)' }),
  )
  expect(changes).toEqual([true])
  expect(region.getAttribute('data-expanded')).toBe('true')
  expect(within(region).getAllByRole('listitem').length).toBe(12)
  expect(
    container.querySelector('[data-slot="transactions-scroll"]'),
  ).toBeTruthy()
  fireEvent.click(within(region).getByRole('button', { name: 'Ver menos' }))
  expect(within(region).getAllByRole('listitem').length).toBe(5)
})
