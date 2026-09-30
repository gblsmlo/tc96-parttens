import * as React from 'react'

import { cn } from './lib/utils'

export interface DetailRowProps extends React.ComponentProps<'div'> {
  description?: React.ReactNode
  label: React.ReactNode
  leading?: React.ReactNode
  value?: React.ReactNode
}

export function DetailRow({
  className,
  description,
  label,
  leading,
  value,
  ...props
}: Readonly<DetailRowProps>): React.ReactElement {
  return (
    <div
      className={cn(
        'flex min-h-12 items-center gap-3 border-t p-4 first:border-t-0',
        className,
      )}
      data-slot="detail-sheet-row"
      {...props}
    >
      {leading ? (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {React.isValidElement(leading)
            ? React.cloneElement(leading as React.ReactElement<{ size?: number }>, {
                size: 16,
              })
            : leading}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="text-sm">{label}</div>
        {description ? (
          <div className="mt-0.5 text-muted-foreground text-xs">{description}</div>
        ) : null}
      </div>

      {value ? <div className="shrink-0 text-right font-medium text-sm">{value}</div> : null}
    </div>
  )
}
