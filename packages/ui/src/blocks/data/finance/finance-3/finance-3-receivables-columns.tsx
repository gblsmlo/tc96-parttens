import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import {
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import {
  Finance3Amount,
  Finance3DueText,
  Finance3TextField,
} from './finance-3-fields'
import type { Finance3Formatter } from './finance-3-format'
import {
  finance3ChargeAppearance,
  finance3ChargeStatuses,
} from './finance-3-options'
import type {
  Finance3Labels,
  Finance3Receivable,
  Finance3ReceivableColumnId,
} from './types'

export interface Finance3ReceivablesContext {
  format: Finance3Formatter
  labels: Finance3Labels
  onContact?: (receivableId: string) => void
  onIssueCharge?: (receivableId: string) => void
  onMarkCollected?: (receivableIds: string[]) => void
  onReissueCharge?: (receivableId: string) => void
}

type CellProps = Readonly<{
  context: Finance3ReceivablesContext
  item: Finance3Receivable
}>

function ChargeField({ context, item }: CellProps) {
  const { format, labels } = context
  const receivableLabels = labels.receivables
  if (!item.charge && !item.chargeFailedOn)
    return (
      <span className="text-muted-foreground">{receivableLabels.noCharge}</span>
    )
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-2">
      {item.charge ? (
        <DataSelect
          ariaLabel={receivableLabels.columns.charge}
          options={dataSelectOptions(
            finance3ChargeStatuses,
            receivableLabels.chargeStatuses,
            finance3ChargeAppearance,
          )}
          value={item.charge}
        />
      ) : null}
      {item.chargeFailedOn ? (
        <span
          className="text-destructive-foreground"
          data-slot="finance-3-charge-failed"
        >
          {receivableLabels.chargeFailed(format.day(item.chargeFailedOn))}
        </span>
      ) : null}
    </span>
  )
}

function RowActions({ context, item }: CellProps) {
  const { labels, onContact, onIssueCharge, onMarkCollected, onReissueCharge } =
    context
  const receivableLabels = labels.receivables
  return (
    <Menu>
      <MenuTrigger
        aria-label={receivableLabels.rowActions(item.payer, item.installment)}
        render={<Button size="icon-sm" type="button" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {onContact ? (
          <MenuItem
            disabled={!item.canContact}
            onClick={() => onContact(item.id)}
          >
            <span className="grid">
              <span>{receivableLabels.contact}</span>
              {item.canContact ? null : (
                <span className="text-muted-foreground text-xs">
                  {receivableLabels.noPhone}
                </span>
              )}
            </span>
          </MenuItem>
        ) : null}
        {onMarkCollected ? (
          <MenuItem onClick={() => onMarkCollected([item.id])}>
            {receivableLabels.markCollected}
          </MenuItem>
        ) : null}
        {onIssueCharge && item.chargeAction === 'issue' ? (
          <MenuItem onClick={() => onIssueCharge(item.id)}>
            {receivableLabels.issueCharge}
          </MenuItem>
        ) : null}
        {onReissueCharge && item.chargeAction === 'reissue' ? (
          <MenuItem onClick={() => onReissueCharge(item.id)}>
            {receivableLabels.reissueCharge}
          </MenuItem>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}

export function createFinance3ReceivablesColumns(
  context: Finance3ReceivablesContext,
  selectable: boolean,
): DataTableColumnDef<Finance3Receivable>[] {
  const { format, labels } = context
  const receivableLabels = labels.receivables
  const column = (id: Finance3ReceivableColumnId) => ({
    header: receivableLabels.columns[id],
    id,
    meta: { label: receivableLabels.columns[id] },
  })
  const hasRowActions = Boolean(
    context.onContact ||
      context.onMarkCollected ||
      context.onIssueCharge ||
      context.onReissueCharge,
  )

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Finance3Receivable>({
            getRowLabel: (item) =>
              receivableLabels.selectRecord(item.payer, item.installment),
            selectAllLabel: receivableLabels.selectAll,
          }),
        ]
      : []),
    {
      ...column('payer'),
      accessorFn: (item) => item.payer,
      cell: ({ row }) => <DataCollectionTitleCell title={row.original.payer} />,
      size: 240,
    },
    {
      ...column('installment'),
      accessorFn: (item) => item.installment,
      cell: ({ row }) => (
        <Finance3TextField
          ariaLabel={receivableLabels.columns.installment}
          fallback={labels.noValue}
          value={row.original.installment}
        />
      ),
      size: 260,
    },
    {
      ...column('amount'),
      accessorFn: (item) => item.amount,
      cell: ({ row }) => (
        <Finance3Amount cents={row.original.amount} format={format} />
      ),
      meta: { align: 'end', label: receivableLabels.columns.amount },
      size: 140,
    },
    {
      ...column('due'),
      accessorFn: (item) => item.due.label,
      cell: ({ row }) => <Finance3DueText due={row.original.due} />,
      size: 160,
    },
    {
      ...column('lastContact'),
      accessorFn: (item) => item.lastContact,
      cell: ({ row }) => (
        <Finance3TextField
          ariaLabel={receivableLabels.columns.lastContact}
          fallback={labels.noValue}
          value={row.original.lastContact}
        />
      ),
      size: 150,
    },
    {
      ...column('charge'),
      accessorFn: (item) => item.charge,
      cell: ({ row }) => <ChargeField context={context} item={row.original} />,
      size: 260,
    },
    ...(hasRowActions
      ? [
          {
            cell: ({ row }) => (
              <RowActions context={context} item={row.original} />
            ),
            enableHiding: false,
            header: () => (
              <span className="sr-only">
                {receivableLabels.columns.actions}
              </span>
            ),
            id: 'actions',
            meta: { align: 'end', label: receivableLabels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Finance3Receivable>,
        ]
      : []),
  ]
}
