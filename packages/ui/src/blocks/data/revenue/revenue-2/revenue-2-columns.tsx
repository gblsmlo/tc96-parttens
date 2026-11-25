import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-select-column'
import { dataSelectOptions } from '../../shared/properties/data-properties'
import type { TableFormatter } from '../../shared/table/format'
import {
  AccountCell,
  ArrCell,
  HealthCell,
  RenewalCell,
  RiskCell,
  revenue2RiskRank,
  StageCell,
} from './revenue-2-cells'
import {
  revenue2RiskAppearance,
  revenue2Risks,
  revenue2StageAppearance,
  revenue2Stages,
} from './revenue-2-options'
import type {
  Revenue2ColumnId,
  Revenue2Labels,
  Revenue2Renewal,
  Revenue2RowAction,
  Revenue2Stage,
} from './types'

export interface Revenue2ColumnsInput {
  formatter: TableFormatter
  labels: Revenue2Labels
  onRowAction?: (actionId: string, renewalId: string) => void
  rowActions?: Revenue2RowAction[]
}

export const revenue2FilterOnlyColumns = ['owner', 'segment'] as const

const stageRank = {
  'commercial-review': 1,
  'legal-review': 2,
  preparing: 0,
  signed: 3,
} as const satisfies Record<Revenue2Stage, number>

export function createRevenue2Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<Revenue2ColumnsInput>): DataTableColumnDef<Revenue2Renewal>[] {
  const stageOptions = dataSelectOptions(
    revenue2Stages,
    labels.stages,
    revenue2StageAppearance,
  )
  const riskOptions = dataSelectOptions(
    revenue2Risks,
    labels.risks,
    revenue2RiskAppearance,
  )
  const title = (id: Revenue2ColumnId) => labels.columns[id]

  const columns: DataTableColumnDef<Revenue2Renewal>[] = [
    createDataTableSelectColumn<Revenue2Renewal>({
      getRowLabel: (renewal) => labels.selectAccount(renewal.account.name),
      selectAllLabel: labels.selectAll,
    }),
    {
      accessorFn: (renewal) => renewal.account.name,
      cell: ({ row }) => <AccountCell labels={labels} renewal={row.original} />,
      enableColumnFilter: false,
      enableHiding: false,
      header: title('account'),
      id: 'account',
      meta: { label: title('account') },
      size: 300,
    },
    {
      accessorFn: (renewal) => renewal.renewalDate,
      cell: ({ row }) => (
        <RenewalCell
          formatter={formatter}
          labels={labels}
          renewal={row.original}
        />
      ),
      enableColumnFilter: false,
      header: title('renewal'),
      id: 'renewal',
      meta: { label: title('renewal') },
      size: 150,
    },
    {
      accessorFn: (renewal) => renewal.arr,
      cell: ({ row }) => (
        <ArrCell formatter={formatter} labels={labels} renewal={row.original} />
      ),
      enableColumnFilter: false,
      header: title('arr'),
      id: 'arr',
      meta: { label: title('arr') },
      size: 190,
    },
    {
      accessorFn: (renewal) => Math.round(renewal.health * 100),
      cell: ({ row }) => (
        <HealthCell
          formatter={formatter}
          health={row.original.health}
          labels={labels}
        />
      ),
      enableColumnFilter: false,
      header: title('health'),
      id: 'health',
      meta: { label: title('health') },
      size: 150,
    },
    {
      accessorFn: (renewal) => renewal.stage,
      cell: ({ row }) => (
        <StageCell
          labels={labels}
          options={stageOptions}
          stage={row.original.stage}
        />
      ),
      enableColumnFilter: false,
      header: title('stage'),
      id: 'stage',
      meta: { label: title('stage') },
      size: 180,
      sortFn: (left, right) =>
        stageRank[left.original.stage] - stageRank[right.original.stage],
    },
    {
      accessorFn: (renewal) => renewal.risk,
      cell: ({ row }) => (
        <RiskCell
          labels={labels}
          options={riskOptions}
          risk={row.original.risk}
        />
      ),
      enableColumnFilter: false,
      header: title('risk'),
      id: 'risk',
      meta: { label: title('risk') },
      size: 120,
      sortFn: (left, right) =>
        revenue2RiskRank[left.original.risk] -
        revenue2RiskRank[right.original.risk],
    },
    {
      accessorFn: (renewal) => renewal.owner.id,
      enableColumnFilter: false,
      enableHiding: false,
      enableSorting: false,
      header: labels.fields.owner,
      id: 'owner',
    },
    {
      accessorFn: (renewal) => renewal.account.segment,
      enableColumnFilter: false,
      enableHiding: false,
      enableSorting: false,
      header: labels.fields.segment,
      id: 'segment',
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <Menu>
          <MenuTrigger
            aria-label={labels.rowActionsFor(row.original.account.name)}
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
