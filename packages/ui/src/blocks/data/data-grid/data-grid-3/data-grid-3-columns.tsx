import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { createSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/create-select-column'
import type { GridFormatter } from '../shared/format'
import {
  AccountCell,
  ArrCell,
  dataGrid3RiskRank,
  HealthCell,
  RenewalCell,
  RiskCell,
  StageCell,
} from './data-grid-3-cells'
import type {
  DataGrid3ColumnId,
  DataGrid3Labels,
  DataGrid3Renewal,
  DataGrid3RowAction,
  DataGrid3Stage,
} from './types'

export interface DataGrid3ColumnsInput {
  formatter: GridFormatter
  labels: DataGrid3Labels
  onRowAction?: (actionId: string, renewalId: string) => void
  rowActions?: DataGrid3RowAction[]
}

export const dataGrid3FilterOnlyColumns = ['owner', 'segment'] as const

const stageRank = {
  'commercial-review': 1,
  'legal-review': 2,
  preparing: 0,
  signed: 3,
} as const satisfies Record<DataGrid3Stage, number>

export function createDataGrid3Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<DataGrid3ColumnsInput>): UseDataGridOptions<DataGrid3Renewal>['columns'] {
  const title = (id: DataGrid3ColumnId) => labels.columns[id]

  const columns: UseDataGridOptions<DataGrid3Renewal>['columns'] = [
    createSelectColumn({
      getRowLabel: (renewal) => labels.selectAccount(renewal.account.name),
      selectAllLabel: labels.selectAll,
      showRowNumbers: false,
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
        <StageCell labels={labels} stage={row.original.stage} />
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
      cell: ({ row }) => <RiskCell labels={labels} risk={row.original.risk} />,
      enableColumnFilter: false,
      header: title('risk'),
      id: 'risk',
      meta: { label: title('risk') },
      size: 120,
      sortFn: (left, right) =>
        dataGrid3RiskRank[left.original.risk] -
        dataGrid3RiskRank[right.original.risk],
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
