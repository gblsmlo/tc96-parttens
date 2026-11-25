import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import {
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  legal9BillingModels,
  legal9StatusAppearance,
  legal9Statuses,
  pickLegal9,
} from './legal-9-options'
import type {
  Legal9BillingModel,
  Legal9Labels,
  Legal9Person,
  Legal9Record,
  Legal9Status,
} from './types'

export interface Legal9FieldContext {
  formatAmount: (cents: number) => string
  labels: Legal9Labels
  onBillingModelChange?: (
    recordId: string,
    billingModel: Legal9BillingModel | null,
  ) => void
  onOpen?: (recordId: string) => void
  onOwnerChange?: (recordId: string, ownerId: string) => void
  owners: readonly Legal9Person[]
}

interface FieldProps {
  context: Legal9FieldContext
  item: Legal9Record
}

export function Legal9HolderField({ context, item }: FieldProps) {
  return (
    <TextProperty
      ariaLabel={context.labels.columns.holder}
      fallback={context.labels.noHolder}
      value={item.holder}
      variant="plain"
    />
  )
}

export function Legal9StatusField({
  context,
  item,
  variant = 'badge',
}: FieldProps & { variant?: DataPropertyVariant }) {
  const { labels } = context
  return (
    <DataSelect<Legal9Status>
      ariaLabel={labels.columns.status}
      options={dataSelectOptions(
        legal9Statuses,
        labels.statuses,
        legal9StatusAppearance,
      )}
      value={item.status}
      variant={variant}
    />
  )
}

export function Legal9BillingModelField({ context, item }: FieldProps) {
  const { labels, onBillingModelChange } = context
  const editable = Boolean(onBillingModelChange) && item.editable
  return (
    <SelectProperty
      ariaLabel={labels.columns.billingModel}
      emptyOptionLabel={editable ? labels.noBillingModel : undefined}
      fallback={labels.noBillingModel}
      onValueChange={
        editable
          ? (value) => {
              const next = pickLegal9(legal9BillingModels, value)
              if (next !== item.billingModel)
                onBillingModelChange?.(item.id, next)
            }
          : undefined
      }
      options={legal9BillingModels.map((model) => ({
        label: labels.billingModels[model],
        value: model,
      }))}
      readOnly={!editable}
      value={item.billingModel}
      variant="plain"
    />
  )
}

export function Legal9AmountField({ context, item }: FieldProps) {
  const { formatAmount, labels } = context
  if (item.amountCents === null)
    return (
      <span className="text-muted-foreground" data-slot="legal-9-amount">
        {labels.noAmount}
      </span>
    )
  return (
    <span className="tabular-nums" data-slot="legal-9-amount">
      {formatAmount(item.amountCents)}
    </span>
  )
}

export function Legal9OwnerField({
  avatarOnly,
  context,
  item,
}: FieldProps & { avatarOnly?: boolean }) {
  const { labels, onOwnerChange, owners } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.owner}
      avatarOnly={avatarOnly}
      onChange={
        onOwnerChange && item.editable
          ? (ownerId) => {
              if (ownerId !== item.ownerId) onOwnerChange(item.id, ownerId)
            }
          : undefined
      }
      owners={owners}
      placeholder={labels.unassigned}
      value={item.ownerId}
      variant="plain"
    />
  )
}
