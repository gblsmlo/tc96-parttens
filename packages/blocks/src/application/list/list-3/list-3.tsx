import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { formatShortDate, parseIsoDate } from '@tc96/helpers/date'
import { List } from '@tc96/parttens/list/composition/list/list'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Amount } from '@tc96/parttens/widgets/shared/amount'
import { Tabs, TabsList, TabsTab } from '@tc96/ui/tabs'
import { cn } from '@tc96/utils'
import { defaultList3Labels } from './labels'
import type { List3Period, List3Props } from './types'

const defaultPeriods: List3Period[] = ['week', 'month', 'year']

function formatDay(value: string, locale: string) {
  const date = parseIsoDate(value)
  return date ? formatShortDate(date, locale, 'UTC') : value
}

export function List3({
  className,
  currency = 'BRL',
  labels: labelsProp,
  locale = 'pt-BR',
  onPeriodChange,
  period,
  periods = defaultPeriods,
  transactions,
}: Readonly<List3Props>) {
  const labels = { ...defaultList3Labels, ...labelsProp }

  return (
    <section aria-label={labels.title} className={cn('grid gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium text-base">{labels.title}</h3>
        <Tabs
          onValueChange={(next) => onPeriodChange?.(next as List3Period)}
          value={period}
        >
          <TabsList aria-label={labels.period}>
            {periods.map((value) => (
              <TabsTab key={value} value={value}>
                {labels.periods[value]}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {transactions.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <ul className="grid list-none gap-2">
          {transactions.map((transaction) => {
            const kind = transaction.amount < 0 ? 'debit' : 'credit'
            const DefaultIcon =
              kind === 'debit' ? ArrowUpRightIcon : ArrowDownLeftIcon

            return (
              <List
                actions={
                  <span
                    className={cn(
                      'text-sm',
                      kind === 'debit'
                        ? 'text-destructive-foreground'
                        : 'text-success-foreground',
                    )}
                    data-kind={kind}
                  >
                    <span className="sr-only">{labels[kind]} </span>
                    <Amount
                      className="font-medium"
                      format={{
                        currency,
                        locale,
                        signDisplay: 'always',
                        style: 'currency',
                      }}
                      value={transaction.amount}
                    />
                  </span>
                }
                description={formatDay(transaction.date, locale)}
                icon={transaction.icon ?? <DefaultIcon aria-hidden="true" />}
                key={transaction.id}
                render={<li data-transaction={transaction.id} />}
                title={transaction.description}
              />
            )
          })}
        </ul>
      )}
    </section>
  )
}
