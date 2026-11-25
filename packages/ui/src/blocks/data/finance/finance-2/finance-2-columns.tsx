import {
  AppleLogoIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  GlobeIcon,
  GoogleLogoIcon,
  type Icon,
  LightningIcon,
  PaypalLogoIcon,
  StorefrontIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { getInitials } from '@tc96/ui/helpers/initials'
import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-select-column'
import { cn } from '@tc96/utils'
import {
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { TableFormatter } from '../../shared/table/format'
import { finance2StatusAppearance, finance2Statuses } from './finance-2-options'
import type {
  Finance2Channel,
  Finance2ColumnId,
  Finance2Labels,
  Finance2Method,
  Finance2RiskBand,
  Finance2Transaction,
} from './types'

export const finance2MethodIcons = {
  'apple-pay': AppleLogoIcon,
  card: CreditCardIcon,
  'google-pay': GoogleLogoIcon,
  paypal: PaypalLogoIcon,
} as const satisfies Record<Finance2Method, Icon>

export const finance2ChannelIcons = {
  api: LightningIcon,
  mobile: DeviceMobileIcon,
  pos: StorefrontIcon,
  web: GlobeIcon,
} as const satisfies Record<Finance2Channel, Icon>

const riskDot = {
  high: 'bg-destructive',
  low: 'bg-success',
  medium: 'bg-warning',
} as const satisfies Record<Finance2RiskBand, string>

const secondaryLine =
  'truncate text-muted-foreground text-xs/4 group-data-[state=selected]:text-foreground/72 in-data-[density=medium]:hidden in-data-[density=short]:hidden'

export function finance2RiskBand(score: number): Finance2RiskBand {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

interface ColumnsInput {
  formatter: TableFormatter
  labels: Finance2Labels
}

export function createFinance2Columns({
  formatter,
  labels,
}: Readonly<ColumnsInput>): DataTableColumnDef<Finance2Transaction>[] {
  const title = (id: Finance2ColumnId) => labels.columns[id]
  const statusOptions = dataSelectOptions(
    finance2Statuses,
    labels.statuses,
    finance2StatusAppearance,
  )

  return [
    createDataTableSelectColumn<Finance2Transaction>({
      getRowLabel: (transaction) => labels.selectRow(transaction.id),
      selectAllLabel: labels.selectAll,
    }),
    {
      accessorFn: (transaction) => transaction.id,
      cell: ({ row }) => (
        <span className="grid min-w-0 gap-0.5">
          <span className="truncate font-medium font-mono text-sm/4">
            {row.original.id}
          </span>
          <span className={`${secondaryLine} font-mono`}>
            {row.original.chargeId}
          </span>
        </span>
      ),
      enableHiding: false,
      header: title('transaction'),
      id: 'transaction',
      meta: { label: title('transaction') },
      size: 170,
    },
    {
      accessorFn: (transaction) => transaction.customer.name,
      cell: ({ row }) => {
        const { customer } = row.original
        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar>
              {customer.imageUrl ? (
                <AvatarImage alt="" src={customer.imageUrl} />
              ) : null}
              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 gap-0.5">
              <span className="truncate font-medium text-sm/4">
                {customer.name}
              </span>
              <span className={secondaryLine}>{customer.email}</span>
            </span>
          </div>
        )
      },
      header: title('customer'),
      id: 'customer',
      meta: { label: title('customer') },
      size: 250,
    },
    {
      accessorFn: (transaction) => transaction.amount,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatter.money(row.original.amount, 2)}
        </span>
      ),
      header: title('amount'),
      id: 'amount',
      meta: { align: 'end', label: title('amount') },
      size: 130,
    },
    {
      accessorFn: (transaction) => transaction.status,
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('status')}
          options={statusOptions}
          value={row.original.status}
        />
      ),
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 120,
    },
    {
      accessorFn: (transaction) => transaction.method,
      cell: ({ row }) => {
        const MethodIcon = finance2MethodIcons[row.original.method]
        return (
          <span className="flex items-center gap-2">
            <MethodIcon aria-hidden="true" className="size-4 shrink-0" />
            <span aria-hidden="true" className="tabular-nums">
              •••• {row.original.lastFour}
            </span>
            <span className="sr-only">
              {labels.methodEnding(
                labels.methods[row.original.method],
                row.original.lastFour,
              )}
            </span>
          </span>
        )
      },
      enableSorting: false,
      header: title('method'),
      id: 'method',
      meta: { label: title('method') },
      size: 150,
    },
    {
      accessorFn: (transaction) => transaction.channel,
      cell: ({ row }) => {
        const ChannelIcon = finance2ChannelIcons[row.original.channel]
        return (
          <span className="flex items-center gap-2">
            <ChannelIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            {labels.channels[row.original.channel]}
          </span>
        )
      },
      enableSorting: false,
      header: title('channel'),
      id: 'channel',
      meta: { label: title('channel') },
      size: 130,
    },
    {
      accessorFn: (transaction) => transaction.risk,
      cell: ({ row }) => {
        const band = finance2RiskBand(row.original.risk)
        const score = formatter.number(row.original.risk)
        return (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn('size-2 shrink-0 rounded-full', riskDot[band])}
              data-risk={band}
            />
            <span aria-hidden="true" className="tabular-nums">
              {score}
            </span>
            <span className="sr-only">
              {labels.risk(labels.riskBands[band], score)}
            </span>
          </span>
        )
      },
      header: title('risk'),
      id: 'risk',
      meta: { label: title('risk') },
      size: 100,
    },
    {
      accessorFn: (transaction) => transaction.createdAt,
      cell: ({ row }) => (
        <span className="grid min-w-0 gap-0.5">
          <span className="truncate text-sm/4">
            {formatter.shortDate(row.original.createdAt)}
          </span>
          <span className={`${secondaryLine} tabular-nums`}>
            {formatter.date(row.original.createdAt, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </span>
      ),
      header: title('date'),
      id: 'date',
      meta: { label: title('date') },
      size: 120,
    },
  ]
}
