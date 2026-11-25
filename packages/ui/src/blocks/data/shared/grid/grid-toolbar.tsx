import { Button, type ButtonProps } from '@tc96/ui/button'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'

export interface GridToolbarProps {
  'aria-label': string
  left?: ReactNode
  right?: ReactNode
}

export function GridToolbar(props: Readonly<GridToolbarProps>) {
  return <CollectionToolbar className="min-h-14 flex-wrap gap-y-3" {...props} />
}

export interface GridToolbarButtonProps {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  variant?: ButtonProps['variant']
}

export function GridToolbarButton({
  children,
  disabled,
  onClick,
  variant = 'outline',
}: Readonly<GridToolbarButtonProps>) {
  return (
    <ToolbarButton
      disabled={disabled}
      onClick={onClick}
      render={<Button type="button" variant={variant} />}
    >
      {children}
    </ToolbarButton>
  )
}
