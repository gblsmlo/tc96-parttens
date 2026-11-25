import { DotsThreeIcon, WarningIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { DataTableCell } from '@tc96/ui/patterns/data-table/data-table-cell'
import type { SelectPropertyOption } from '@tc96/ui/patterns/properties/display/select/select-property'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { DataSelect } from '../../shared/properties/data-properties'
import type {
  Inventory2Labels,
  Inventory2Product,
  Inventory2RowAction,
  Inventory2Status,
} from './types'

export interface Inventory2Row extends Inventory2Product {
  saved: Inventory2Product
}

type Inventory2CellContext = Parameters<
  typeof DataTableCell<Inventory2Row>
>[0]['context']

export function ProductCell({ product }: Readonly<{ product: Inventory2Row }>) {
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
  labels: Inventory2Labels
  options: readonly SelectPropertyOption[]
  status: Inventory2Status
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
  context: Inventory2CellContext
  editable: boolean
  labels: Inventory2Labels
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
          <DataTableCell context={context} />
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
}: Readonly<{ labels: Inventory2Labels }>) {
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
  labels: Inventory2Labels
  onVisibleChange?: (productId: string, visible: boolean) => void
  product: Inventory2Row
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
  actions: Inventory2RowAction[]
  labels: Inventory2Labels
  onRowAction: (actionId: string, productId: string) => void
  product: Inventory2Row
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
