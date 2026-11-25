import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import type { GridFormatter } from '../../shared/grid/format'
import {
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import {
  CampaignCell,
  MetricWithDelta,
  RoasCell,
  ShareCell,
  Sparkline,
  SpendCell,
} from './marketing-1-cells'
import {
  marketing1StatusAppearance,
  marketing1Statuses,
} from './marketing-1-options'
import type {
  Marketing1Campaign,
  Marketing1ColumnId,
  Marketing1Labels,
  Marketing1RowAction,
} from './types'

export interface Marketing1ColumnsInput {
  formatter: GridFormatter
  labels: Marketing1Labels
  onRowAction?: (actionId: string, campaignId: string) => void
  rowActions?: Marketing1RowAction[]
}

export function createMarketing1Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<Marketing1ColumnsInput>): UseDataGridOptions<Marketing1Campaign>['columns'] {
  const title = (id: Marketing1ColumnId) => labels.columns[id]
  const statusOptions = dataSelectOptions(
    marketing1Statuses,
    labels.statuses,
    marketing1StatusAppearance,
  )
  const hasRowMenu = Boolean(onRowAction && rowActions?.length)

  const columns: UseDataGridOptions<Marketing1Campaign>['columns'] = [
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
        <DataSelect
          ariaLabel={title('status')}
          options={statusOptions}
          value={row.original.status}
        />
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
