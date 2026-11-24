import { ScatterChart, type ScatterChartProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { type Account, accounts } from './fixtures/accounts'

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

const percent = new Intl.NumberFormat('en-US', { style: 'percent' })

export const accountKey = (account: Account) => account.id
export const monthlyRevenue = (account: Account) => account.monthlyRevenue
export const retention = (account: Account) => account.retention
export const seats = (account: Account) => account.seats
export const segment = (account: Account) => account.segment

export const formatAccount = (account: Account) =>
  `${account.name} (${account.segment}): ${currency.format(account.monthlyRevenue)}, ${percent.format(account.retention)} retention, ${account.seats} seats`

export type AccountScatterProps = Partial<ScatterChartProps<Account>>

export function AccountScatter(props: AccountScatterProps) {
  return (
    <ScatterChart
      ariaLabel="Account retention by monthly revenue"
      color={segment}
      colorLabel="Segment"
      data={accounts}
      getKey={accountKey}
      size={seats}
      x={monthlyRevenue}
      xLabel="Monthly revenue"
      y={retention}
      yLabel="Retention"
      {...props}
    />
  )
}

export function AccountScatterWithDetail() {
  const [selected, setSelected] = useState<Account | null>(null)

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
      <AccountScatter formatTooltip={formatAccount} onSelect={setSelected} />
      {selected ? (
        <dl className="grid content-start gap-2 text-sm">
          <dt className="text-muted-foreground">Account</dt>
          <dd className="font-medium">{selected.name}</dd>
          <dt className="text-muted-foreground">Segment</dt>
          <dd>{selected.segment}</dd>
          <dt className="text-muted-foreground">Monthly revenue</dt>
          <dd>{currency.format(selected.monthlyRevenue)}</dd>
          <dt className="text-muted-foreground">Retention</dt>
          <dd>{percent.format(selected.retention)}</dd>
          <dt className="text-muted-foreground">Seats</dt>
          <dd>{selected.seats}</dd>
        </dl>
      ) : (
        <p className="text-muted-foreground text-sm">Select a point</p>
      )}
    </div>
  )
}
