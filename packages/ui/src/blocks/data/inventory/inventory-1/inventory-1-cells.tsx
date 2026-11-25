import { DotsThreeIcon, WarningIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { DataGridInputCell } from '@tc96/ui/patterns/data-grid/components/data-grid-input-cell'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { DataSelect } from '../../shared/properties/data-properties'
import type {
  Inventory1Labels,
  Inventory1Product,
  Inventory1RowAction,
  Inventory1Status,
} from './types'

export interface Inventory1Row extends Inventory1Product {
  saved: Inventory1Product
}

type Inventory1CellContext = Parameters<
  typeof DataGridInputCell<Inventory1Row>
>[0]['context']

export function ProductCell({ product }: Readonly<{ product: Inventory1Row }>) {
  return (
    <span className="grid min-w-0 gap-0.5">
      <span className="truncate font-medium">{product.name}</span>
      <span className="truncate font-mono text-muted-foreground text-xs">
        {product.sku}
      </span>
    </span>
  )
}

export function StatusCell({
  labels,
  options,
  status,
}: Readonly<{
  labels: Inventory1Labels
  options: readonly PropertyOption[]
  status: Inventory1Status
}>) {
  return (
    <DataSelect
      ariaLabel={labels.columns.status}
      options={options}
      value={status}
    />
  )
}

export function EditableNumberCell({
  adornment,
  changed,
  context,
  editable,
  labels,
  text,
}: Readonly<{
  adornment?: ReactNode
  changed: boolean
  context: Inventory1CellContext
  editable: boolean
  labels: Inventory1Labels
  text: string
}>) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-start justify-end gap-1.5 rounded-sm',
        changed && 'bg-warning/8',
      )}
      data-changed={changed || undefined}
    >
      {adornment}
      {editable ? (
        <span className="min-w-0 flex-1">
          <DataGridInputCell context={context} numeric />
        </span>
      ) : (
        <span className="px-1 tabular-nums">{text}</span>
      )}
      {changed ? <span className="sr-only">{labels.changed}</span> : null}
    </div>
  )
}

export function LowStockIcon({
  labels,
}: Readonly<{ labels: Inventory1Labels }>) {
  return (
    <span className="inline-flex shrink-0 items-center" data-low-stock="">
      <WarningIcon
        aria-hidden="true"
        className="size-4 text-warning-foreground"
      />
      <span className="sr-only">{labels.lowStock}</span>
    </span>
  )
}

export function VisibleCell({
  labels,
  onVisibleChange,
  product,
}: Readonly<{
  labels: Inventory1Labels
  onVisibleChange?: (productId: string, visible: boolean) => void
  product: Inventory1Row
}>) {
  return (
    <Switch
      aria-label={labels.visibleFor(product.name)}
      checked={product.visible}
      disabled={!onVisibleChange}
      onCheckedChange={(checked) => onVisibleChange?.(product.id, checked)}
    />
  )
}

export function RowActionsCell({
  actions,
  labels,
  onRowAction,
  product,
}: Readonly<{
  actions: Inventory1RowAction[]
  labels: Inventory1Labels
  onRowAction: (actionId: string, productId: string) => void
  product: Inventory1Row
}>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.rowActionsFor(product.name)}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => onRowAction(action.id, product.id)}
            variant={action.destructive ? 'destructive' : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
