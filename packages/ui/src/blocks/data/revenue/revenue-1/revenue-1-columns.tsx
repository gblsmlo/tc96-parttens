import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { createSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/create-select-column'
import type { GridFormatter } from '../../shared/grid/format'
import { dataSelectOptions } from '../../shared/properties/data-properties'
import {
  AccountCell,
  ArrCell,
  HealthCell,
  RenewalCell,
  RiskCell,
  revenue1RiskRank,
  StageCell,
} from './revenue-1-cells'
import {
  revenue1RiskAppearance,
  revenue1Risks,
  revenue1StageAppearance,
  revenue1Stages,
} from './revenue-1-options'
import type {
  Revenue1ColumnId,
  Revenue1Labels,
  Revenue1Renewal,
  Revenue1RowAction,
  Revenue1Stage,
} from './types'

export interface Revenue1ColumnsInput {
  formatter: GridFormatter
  labels: Revenue1Labels
  onRowAction?: (actionId: string, renewalId: string) => void
  rowActions?: Revenue1RowAction[]
}

export const revenue1FilterOnlyColumns = ['owner', 'segment'] as const

const stageRank = {
  'commercial-review': 1,
  'legal-review': 2,
  preparing: 0,
  signed: 3,
} as const satisfies Record<Revenue1Stage, number>

export function createRevenue1Columns({
  formatter,
  labels,
  onRowAction,
  rowActions,
}: Readonly<Revenue1ColumnsInput>): UseDataGridOptions<Revenue1Renewal>['columns'] {
  const stageOptions = dataSelectOptions(
    revenue1Stages,
    labels.stages,
    revenue1StageAppearance,
  )
  const riskOptions = dataSelectOptions(
    revenue1Risks,
    labels.risks,
    revenue1RiskAppearance,
  )
  const title = (id: Revenue1ColumnId) => labels.columns[id]

  const columns: UseDataGridOptions<Revenue1Renewal>['columns'] = [
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
        revenue1RiskRank[left.original.risk] -
        revenue1RiskRank[right.original.risk],
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
