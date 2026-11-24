import { CardAction, CardHeader, CardPanel, CardTitle } from '@tc96/ui/card'
import {
  Amount,
  ExpandableList,
  TrendIndicator,
  WidgetPeriodToggle,
  WidgetShell,
} from '@tc96/ui/patterns'
import { useId, useState } from 'react'
import type { WidgetsControls } from './widgets-controls.ts'
import {
  type Order,
  orders,
  periodMultiplier,
  periodOptions,
  type RevenuePeriod,
} from './widgets-data.ts'

export const OrderList = ({
  orders: shown,
}: Readonly<{ orders: readonly Order[] }>) => (
  <ul className="divide-y divide-border/40">
    {shown.map((order) => (
      <li
        className="flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
        key={order.id}
      >
        <span className="grid">
          <span className="font-medium">Order #{order.id}</span>
          <span className="text-muted-foreground text-xs">
            {order.customer}
          </span>
        </span>
        <Amount className="font-medium" value={order.total} />
      </li>
    ))}
  </ul>
)

export const ComposedWidget = ({
  amount,
  change,
  dimFraction,
  expanded,
  list,
  periods,
  title,
  trend,
  trendVariant,
  value,
  visibleCount,
}: Readonly<WidgetsControls>) => {
  const titleId = useId()
  const [period, setPeriod] = useState<RevenuePeriod>('month')

  return (
    <WidgetShell
      {...(title ? { 'aria-labelledby': titleId } : { 'aria-label': 'Widget' })}
      data-widget="shared-parts"
    >
      {title || periods ? (
        <CardHeader className="grid-rows-1 items-center p-5">
          {title ? (
            <CardTitle className="font-semibold text-base" id={titleId}>
              {title}
            </CardTitle>
          ) : null}
          {periods ? (
            <CardAction className="row-span-1 self-center">
              <WidgetPeriodToggle
                aria-label="Revenue period"
                onValueChange={setPeriod}
                options={periodOptions}
                value={period}
              />
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}
      <CardPanel
        className={`grid gap-5 px-5 pb-5${title || periods ? '' : ' pt-5'}`}
      >
        {amount ? (
          <div className="flex flex-wrap items-center gap-3">
            <Amount
              className="font-medium text-4xl leading-tight tracking-tight"
              dimFraction={dimFraction}
              value={value * periodMultiplier[period]}
            />
            {trend ? (
              <TrendIndicator value={change} variant={trendVariant} />
            ) : null}
          </div>
        ) : null}
        {list ? (
          <ExpandableList
            defaultExpanded={expanded}
            items={orders}
            key={String(expanded)}
            visibleCount={visibleCount}
          >
            {(shown) => <OrderList orders={shown} />}
          </ExpandableList>
        ) : null}
      </CardPanel>
    </WidgetShell>
  )
}

export const RevenueSummary = () => {
  const titleId = useId()
  const [period, setPeriod] = useState<RevenuePeriod>('month')

  return (
    <WidgetShell aria-labelledby={titleId} data-widget="revenue-summary">
      <CardHeader className="grid-rows-1 items-center p-5">
        <CardTitle className="font-semibold text-base" id={titleId}>
          Store revenue
        </CardTitle>
        <CardAction className="row-span-1 self-center">
          <WidgetPeriodToggle
            aria-label="Revenue period"
            onValueChange={setPeriod}
            options={periodOptions}
            value={period}
          />
        </CardAction>
      </CardHeader>
      <CardPanel className="flex flex-wrap items-center gap-3 px-5 pb-5">
        <Amount
          className="font-medium text-4xl leading-tight tracking-tight"
          dimFraction
          value={48250.75 * periodMultiplier[period]}
        />
        <TrendIndicator value={0.124} />
      </CardPanel>
    </WidgetShell>
  )
}

export const RecentOrders = () => {
  const titleId = useId()

  return (
    <WidgetShell aria-labelledby={titleId} data-widget="recent-orders">
      <CardHeader className="grid-rows-1 items-center p-5">
        <CardTitle className="font-semibold text-base" id={titleId}>
          Recent orders
        </CardTitle>
      </CardHeader>
      <CardPanel className="px-5 pb-5">
        <ExpandableList items={orders}>
          {(shown) => <OrderList orders={shown} />}
        </ExpandableList>
      </CardPanel>
    </WidgetShell>
  )
}
