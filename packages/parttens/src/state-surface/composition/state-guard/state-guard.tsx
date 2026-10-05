import { Spinner } from '@tc96/ui/spinner'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { StateGuardProps } from '../../core'
import { StateSurface } from '../state-surface/index'

export function StateGuard(props: StateGuardProps): ReactNode {
  if (props.state === 'data') {
    return props.children
  }

  if (props.state === 'loading') {
    const { className, description, title } = props.surface

    return (
      <output
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-8 text-center',
          className,
        )}
        data-slot="state-guard-loading"
      >
        <span className="text-muted-foreground">
          <Spinner aria-hidden="true" className="size-5" />
        </span>
        <p className="font-medium text-sm">{title}</p>
        {description ? (
          <p className="max-w-md text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
      </output>
    )
  }

  return <StateSurface kind={props.state} {...props.surface} />
}
