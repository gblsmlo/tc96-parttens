import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { formatAmount } from '@tc96/ui/helpers/format'
import { getInitials } from '@tc96/ui/helpers/initials'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { listLoadState } from '../shared/list-load-state'
import { defaultList6Labels } from './labels'
import { List6Skeleton } from './list-6-skeleton'
import type { List6MoverStatus, List6Props } from './types'

const statusVariant = {
  delayed: 'warning',
  halted: 'error',
  live: 'success',
} as const satisfies Record<List6MoverStatus, string>

const trendClassName = (change: number) =>
  change > 0
    ? 'text-success-foreground'
    : change < 0
      ? 'text-destructive-foreground'
      : 'text-muted-foreground'

export function List6({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  labels: labelsProp,
  locale = 'pt-BR',
  movers,
  onQueryChange,
  query,
}: Readonly<List6Props>) {
  const labels = { ...defaultList6Labels, ...labelsProp }
  const loadState = listLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <List6Skeleton label={labels.loading} />,
  })

  return (
    <div className={cn('grid gap-3', className)}>
      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label={labels.search}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={labels.searchPlaceholder}
          type="search"
          value={query}
        />
      </InputGroup>
      {loadState ??
        (movers.length === 0 ? (
          <StateSurface
            description={
              query ? labels.noResultDescription : labels.emptyDescription
            }
            kind={query ? 'no-result' : 'empty'}
            title={query ? labels.noResultTitle : labels.emptyTitle}
          />
        ) : (
          <Table>
            <TableCaption className="sr-only">{labels.title}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.columnName}</TableHead>
                <TableHead>{labels.columnStatus}</TableHead>
                <TableHead className="text-end">{labels.columnPrice}</TableHead>
                <TableHead className="text-end">
                  {labels.columnChange}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movers.map((mover) => (
                <TableRow data-mover={mover.id} key={mover.id}>
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <IconFrame aria-hidden="true" shape="rounded" size="sm">
                        <span className="font-medium text-xs">
                          {getInitials(mover.name)}
                        </span>
                      </IconFrame>
                      <span className="font-medium">{mover.name}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[mover.status]}>
                      {labels.statuses[mover.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatAmount(mover.price, { currency, locale })}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    <span
                      className={trendClassName(mover.change)}
                      data-trend={
                        mover.change > 0
                          ? 'up'
                          : mover.change < 0
                            ? 'down'
                            : 'flat'
                      }
                    >
                      {formatAmount(mover.change, {
                        locale,
                        signDisplay: 'exceptZero',
                        style: 'percent',
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
    </div>
  )
}
