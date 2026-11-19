import { Badge } from '@tc96/ui/badge'
import type { ReactElement } from 'react'
import type { RecordStatusBadgeProps } from '../../core'

export function RecordStatusBadge({
  children,
  className,
  color,
}: Readonly<RecordStatusBadgeProps>): ReactElement {
  return (
    <Badge
      className={className}
      data-color={color ? 'custom' : 'neutral'}
      style={
        color
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
              color: `color-mix(in srgb, ${color} 90%, var(--foreground))`,
            }
          : undefined
      }
      variant="secondary"
    >
      {children}
    </Badge>
  )
}
