import { DotsThreeIcon, WarningIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { DataGridInputCell } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-input-cell'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type {
  DataGrid4Labels,
  DataGrid4Product,
  DataGrid4RowAction,
  DataGrid4Status,
} from './types'

export interface DataGrid4Row extends DataGrid4Product {
  saved: DataGrid4Product
}

type DataGrid4CellContext = Parameters<
  typeof DataGridInputCell<DataGrid4Row>
>[0]['context']

const statusTones = {
  active: 'success',
  archived: 'error',
  draft: 'warning',
} as const satisfies Record<DataGrid4Status, string>

export function ProductCell({ product }: Readonly<{ product: DataGrid4Row }>) {
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
  status,
}: Readonly<{ labels: DataGrid4Labels; status: DataGrid4Status }>) {
  return <Badge variant={statusTones[status]}>{labels.statuses[status]}</Badge>
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
  context: DataGrid4CellContext
  editable: boolean
  labels: DataGrid4Labels
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
}: Readonly<{ labels: DataGrid4Labels }>) {
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
  labels: DataGrid4Labels
  onVisibleChange?: (productId: string, visible: boolean) => void
  product: DataGrid4Row
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
  actions: DataGrid4RowAction[]
  labels: DataGrid4Labels
  onRowAction: (actionId: string, productId: string) => void
  product: DataGrid4Row
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
