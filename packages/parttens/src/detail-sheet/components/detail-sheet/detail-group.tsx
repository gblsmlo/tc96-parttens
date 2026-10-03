import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type * as React from 'react'

export interface DetailGroupProps
  extends Omit<React.ComponentProps<'section'>, 'title'> {
  action?: React.ReactNode
  children?: React.ReactNode
  description?: React.ReactNode
  title?: React.ReactNode
}

export function DetailGroup({
  action,
  children,
  className,
  description,
  title,
  ...props
}: Readonly<DetailGroupProps>): React.ReactElement {
  return (
    <section className={cn('space-y-2', className)} {...props}>
      {title || description || action ? (
        <div className="flex items-start justify-between gap-4 px-1">
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h3 className="font-medium text-muted-foreground text-sm">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <Card
        className="shadow-none before:hidden"
        data-slot="detail-group-content"
      >
        {children}
      </Card>
    </section>
  )
}
