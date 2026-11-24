import { createRowDragColumn } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-row-drag-handle'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import type { GridFormatter } from '../shared/format'
import {
  ClauseCell,
  EnabledCell,
  MatchesCell,
  RankCell,
  RowActionsCell,
  RuleCell,
  ScopeCell,
} from './data-grid-7-cells'
import type {
  DataGrid7ColumnId,
  DataGrid7Labels,
  DataGrid7RowAction,
  DataGrid7Rule,
} from './types'

export interface DataGrid7ColumnsInput {
  formatter: GridFormatter
  labels: DataGrid7Labels
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onRowAction?: (actionId: string, ruleId: string) => void
  rowActions?: DataGrid7RowAction[]
}

export function createDataGrid7Columns({
  formatter,
  labels,
  onEnabledChange,
  onRowAction,
  rowActions,
}: Readonly<DataGrid7ColumnsInput>): UseDataGridOptions<DataGrid7Rule>['columns'] {
  const title = (id: DataGrid7ColumnId) => labels.columns[id]

  const columns: UseDataGridOptions<DataGrid7Rule>['columns'] = [
    createRowDragColumn<DataGrid7Rule>({
      getHandleLabel: (rule) => labels.dragHandle(rule.name),
      headerLabel: title('drag'),
    }),
    {
      cell: ({ row }) => (
        <RankCell position={row.index + 1} rule={row.original} />
      ),
      enableResizing: false,
      header: title('rank'),
      id: 'rank',
      meta: { label: title('rank') },
      size: 56,
    },
    {
      accessorFn: (rule) => `${rule.name} ${rule.description}`,
      cell: ({ row }) => <RuleCell rule={row.original} />,
      enableHiding: false,
      header: title('rule'),
      id: 'rule',
      meta: { label: title('rule') },
      size: 280,
    },
    {
      accessorFn: (rule) => rule.scope.label,
      cell: ({ row }) => <ScopeCell rule={row.original} />,
      header: title('scope'),
      id: 'scope',
      meta: { label: title('scope') },
      size: 130,
    },
    {
      accessorFn: (rule) => rule.condition,
      cell: ({ row }) => <ClauseCell kind="condition" rule={row.original} />,
      header: title('condition'),
      id: 'condition',
      meta: { label: title('condition') },
      size: 200,
    },
    {
      accessorFn: (rule) => rule.effect,
      cell: ({ row }) => <ClauseCell kind="effect" rule={row.original} />,
      header: title('effect'),
      id: 'effect',
      meta: { label: title('effect') },
      size: 200,
    },
    {
      accessorFn: (rule) => rule.matches,
      cell: ({ row }) => (
        <MatchesCell
          formatter={formatter}
          labels={labels}
          rule={row.original}
        />
      ),
      header: title('matches'),
      id: 'matches',
      meta: { label: title('matches') },
      size: 150,
    },
    {
      accessorFn: (rule) => rule.enabled,
      cell: ({ row }) => (
        <EnabledCell
          labels={labels}
          onEnabledChange={onEnabledChange}
          rule={row.original}
        />
      ),
      header: title('enabled'),
      id: 'enabled',
      meta: { label: title('enabled') },
      size: 100,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <RowActionsCell
          actions={rowActions}
          labels={labels}
          onRowAction={onRowAction}
          rule={row.original}
        />
      ),
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
