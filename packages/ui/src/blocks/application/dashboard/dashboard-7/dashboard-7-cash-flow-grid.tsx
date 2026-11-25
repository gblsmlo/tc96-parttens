import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import type { DateFormatter } from '../shared/format-date'
import type { MoneyFormatter } from '../shared/format-money'
import type {
  Dashboard7CashFlowGrid as Dashboard7CashFlowGridData,
  Dashboard7Labels,
} from './types'

const columnVariants = {
  current: 'info',
  forecast: 'outline',
  realized: 'secondary',
} as const

export function Dashboard7CashFlowGrid({
  dates,
  grid,
  labels,
  numbers,
  onCellSelect,
}: Readonly<{
  dates: DateFormatter
  grid: Dashboard7CashFlowGridData
  labels: Dashboard7Labels
  numbers: MoneyFormatter
  onCellSelect?: (rowId: string, month: string) => void
}>) {
  if (grid.months.length === 0) {
    return <p className="text-muted-foreground text-sm">{labels.gridEmpty}</p>
  }

  return (
    <Table
      aria-label={labels.gridTitle}
      render={
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the months overflow sideways, so the scroll container must take keyboard focus
        <section aria-label={labels.gridScroll} tabIndex={0} />
      }
    >
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-40">{labels.columnLine}</TableHead>
          {grid.months.map((month) => (
            <TableHead
              className="min-w-32 text-right"
              data-column={month.column}
              data-month={month.month}
              key={month.month}
            >
              <span className="grid justify-items-end gap-1 py-1">
                <span>{dates.month(month.month)}</span>
                <Badge variant={columnVariants[month.column]}>
                  {labels.monthColumns[month.column]}
                </Badge>
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {grid.rows.map((row) => (
          <TableRow data-kind={row.kind} data-row={row.id} key={row.id}>
            {row.kind === 'section' ? (
              <TableCell colSpan={grid.months.length + 1}>
                <span className="font-medium text-muted-foreground text-xs uppercase">
                  {row.label}
                </span>
              </TableCell>
            ) : (
              <>
                <TableCell
                  className={cn(row.kind === 'total' && 'font-medium')}
                >
                  {row.label}
                </TableCell>
                {grid.months.map((month, index) => {
                  const cents = row.cells[index] ?? null
                  const text = cents === null ? '—' : numbers.cents(cents)
                  const negative = cents !== null && cents < 0
                  return (
                    <TableCell
                      className={cn(
                        'text-right tabular-nums',
                        row.kind === 'total' && 'font-medium',
                      )}
                      data-negative={negative || undefined}
                      key={month.month}
                    >
                      {onCellSelect && row.selectable && cents ? (
                        <Button
                          aria-label={labels.cellEntries(
                            row.label,
                            dates.month(month.month),
                            text,
                          )}
                          className="tabular-nums"
                          onClick={() => onCellSelect(row.id, month.month)}
                          size="sm"
                          variant="ghost"
                        >
                          <span
                            className={cn(
                              negative && 'text-destructive-foreground',
                            )}
                          >
                            {text}
                          </span>
                        </Button>
                      ) : (
                        <span
                          className={cn(
                            negative && 'text-destructive-foreground',
                          )}
                        >
                          {text}
                        </span>
                      )}
                    </TableCell>
                  )
                })}
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
