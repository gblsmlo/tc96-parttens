import { BellSlashIcon } from '@phosphor-icons/react'
import {
  StateGuard,
  type StateGuardState,
  type StateSurfaceProps,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import type { ReactNode } from 'react'
import type { StateControls } from './state-controls.ts'
import type { StateIconMode } from './state-variants.ts'

interface ComposedStateProps extends StateControls {
  className?: string
}

const iconFor = (mode: StateIconMode): ReactNode => {
  if (mode === 'custom') {
    return <BellSlashIcon aria-hidden="true" />
  }

  return mode === 'none' ? null : undefined
}

export const ComposedState = ({
  actionLabel,
  actions,
  className,
  content,
  description,
  icon,
  state,
  title,
}: Readonly<ComposedStateProps>) => {
  const child = <p className="text-sm">{content}</p>

  if (state === 'data') {
    return <StateGuard state="data">{child}</StateGuard>
  }

  if (state === 'loading') {
    return (
      <StateGuard
        state="loading"
        surface={{ className, description: description || undefined, title }}
      >
        {child}
      </StateGuard>
    )
  }

  const surface: Omit<StateSurfaceProps, 'kind'> = {
    actions: actions ? (
      <Button variant="outline">{actionLabel}</Button>
    ) : undefined,
    className,
    description,
    icon: iconFor(icon),
    title,
  }

  return (
    <StateGuard state={state} surface={surface}>
      {child}
    </StateGuard>
  )
}

export const TwoActionsState = ({
  state,
}: Readonly<{ state: Exclude<StateGuardState, 'data' | 'loading'> }>) => (
  <StateGuard
    state={state}
    surface={{
      actions: (
        <>
          <Button>Try again</Button>
          <Button variant="outline">Contact support</Button>
        </>
      ),
      description: 'The records could not be loaded.',
      title: 'Something went wrong',
    }}
  >
    <p className="text-sm">Confidential record</p>
  </StateGuard>
)
