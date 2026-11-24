import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import type { TableFormatter } from '../shared/format'
import {
  CampaignCell,
  MetricWithDelta,
  RoasCell,
  ShareCell,
  Sparkline,
  SpendCell,
  StatusCell,
} from './table-9-cells'
import type {
  Table9Campaign,
  Table9ColumnId,
  Table9Labels,
  Table9RowAction,
} from './types'

export interface Table9ColumnsInput {
  formatter: TableFormatter
  labels: Table9Labels
  onRowAction?: (actionId: string, campaignId: string) => void
  rowActions?: Table9RowAction[]
}

export function createTable9Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<Table9ColumnsInput>): DataTableColumnDef<Table9Campaign>[] {
  const title = (id: Table9ColumnId) => labels.columns[id]
  const hasRowMenu = Boolean(onRowAction && rowActions?.length)

  const columns: DataTableColumnDef<Table9Campaign>[] = [
    {
      accessorFn: (campaign) => campaign.name,
      cell: ({ row }) => (
        <CampaignCell campaign={row.original} labels={labels} />
      ),
      enableHiding: false,
      filterFn: 'includesString',
      header: title('campaign'),
      id: 'campaign',
      meta: { label: title('campaign') },
      size: 300,
    },
    {
      accessorFn: (campaign) => labels.statuses[campaign.status],
      cell: ({ row }) => (
        <StatusCell labels={labels} status={row.original.status} />
      ),
      filterFn: (row, _columnId, value) => row.original.status === value,
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 150,
    },
    {
      accessorFn: (campaign) => campaign.spend,
      cell: ({ row }) => (
        <SpendCell
          campaign={row.original}
          formatter={formatter}
          labels={labels}
        />
      ),
      enableColumnFilter: false,
      header: title('spend'),
      id: 'spend',
      meta: { align: 'end', label: title('spend') },
      size: 170,
    },
    {
      accessorFn: (campaign) => campaign.conversions,
      cell: ({ row }) => (
        <MetricWithDelta
          delta={row.original.conversionsDelta}
          favorableWhen="up"
          formatter={formatter}
          labels={labels}
          value={formatter.number(row.original.conversions)}
        />
      ),
      enableColumnFilter: false,
      header: title('conversions'),
      id: 'conversions',
      meta: { align: 'end', label: title('conversions') },
      size: 140,
    },
    {
      accessorFn: (campaign) => campaign.trend.at(-1) ?? 0,
      cell: ({ row }) => (
        <Sparkline
          formatter={formatter}
          labels={labels}
          points={row.original.trend}
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      header: title('trend'),
      id: 'trend',
      meta: { label: title('trend') },
      size: 130,
    },
    {
      accessorFn: (campaign) => campaign.cpa,
      cell: ({ row }) => (
        <MetricWithDelta
          delta={row.original.cpaDelta}
          favorableWhen="down"
          formatter={formatter}
          labels={labels}
          value={formatter.money(row.original.cpa, 2)}
        />
      ),
      enableColumnFilter: false,
      header: title('cpa'),
      id: 'cpa',
      meta: { align: 'end', label: title('cpa') },
      size: 130,
    },
    {
      accessorFn: (campaign) => campaign.roas,
      cell: ({ row }) => (
        <RoasCell
          campaign={row.original}
          formatter={formatter}
          labels={labels}
        />
      ),
      enableColumnFilter: false,
      header: title('roas'),
      id: 'roas',
      meta: { label: title('roas') },
      size: 170,
    },
    {
      accessorFn: (campaign) => campaign.newBuyers,
      cell: ({ row }) => (
        <ShareCell
          formatter={formatter}
          labels={labels}
          ratio={row.original.newBuyers}
        />
      ),
      enableColumnFilter: false,
      header: title('newBuyers'),
      id: 'newBuyers',
      meta: { label: title('newBuyers') },
      size: 190,
    },
  ]

  if (hasRowMenu && rowActions && onRowAction) {
    columns.push({
      cell: ({ row }) => (
        <Menu>
          <MenuTrigger
            aria-label={labels.rowActionsFor(row.original.name)}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <DotsThreeIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="end">
            {rowActions.map((action) => (
              <MenuItem
                key={action.id}
                onClick={() => onRowAction(action.id, row.original.id)}
                variant={action.destructive ? 'destructive' : undefined}
              >
                {action.label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      ),
      enableColumnFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
