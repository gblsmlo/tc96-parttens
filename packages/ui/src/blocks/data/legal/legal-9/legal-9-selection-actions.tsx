import { ReceiptIcon, UserIcon } from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { legal9BillingModels } from './legal-9-options'
import type {
  Legal9BillingModel,
  Legal9Labels,
  Legal9Person,
  Legal9Record,
} from './types'

export interface Legal9SelectionActionsOptions {
  labels: Legal9Labels
  onBulkBillingModelChange?: (
    recordIds: string[],
    billingModel: Legal9BillingModel,
  ) => void
  onBulkOwnerChange?: (recordIds: string[], ownerId: string) => void
  onDone: () => void
  owners: readonly Legal9Person[]
  selectedRows: readonly Legal9Record[]
}

export function createLegal9SelectionActions({
  labels,
  onBulkBillingModelChange,
  onBulkOwnerChange,
  onDone,
  owners,
  selectedRows,
}: Legal9SelectionActionsOptions): ActionBarGroup<Legal9Record>[] {
  const ids = selectedRows.filter((item) => item.editable).map(({ id }) => id)
  const choices = <TValue extends string>(
    options: readonly { id: TValue; label: string }[],
    apply: (recordIds: string[], value: TValue) => void,
  ): ActionBarItem<Legal9Record>[] =>
    options.map((option) => ({
      id: option.id,
      label: option.label,
      onSelect: () => {
        apply(ids, option.id)
        onDone()
      },
    }))

  const items: ActionBarItem<Legal9Record>[] = []
  if (onBulkOwnerChange && owners.length)
    items.push({
      disabled: ids.length === 0,
      icon: <UserIcon aria-hidden="true" />,
      id: 'owner',
      label: labels.columns.owner,
      submenu: [{ id: 'owner', items: choices(owners, onBulkOwnerChange) }],
    })
  if (onBulkBillingModelChange)
    items.push({
      disabled: ids.length === 0,
      icon: <ReceiptIcon aria-hidden="true" />,
      id: 'billing-model',
      label: labels.columns.billingModel,
      submenu: [
        {
          id: 'billing-model',
          items: choices(
            legal9BillingModels.map((model) => ({
              id: model,
              label: labels.billingModels[model],
            })),
            onBulkBillingModelChange,
          ),
        },
      ],
    })

  return items.length ? [{ id: 'bulk', items }] : []
}
