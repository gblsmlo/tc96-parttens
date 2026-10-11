'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { RecordGroupLinkProps } from '../../core'

export function RecordGroupLink({
  children,
  className,
  leading,
  meta,
  render,
  ...props
}: Readonly<RecordGroupLinkProps>): ReactElement {
  const defaultProps = {
    children: (
      <>
        {leading ? (
          <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
            {leading}
          </span>
        ) : null}
        <span
          className="min-w-0 flex-1 truncate"
          data-slot="record-group-link-name"
        >
          {children}
        </span>
        {meta ? (
          <span
            className="min-w-0 max-w-1/2 shrink-0 truncate text-muted-foreground"
            data-slot="record-group-link-meta"
          >
            {meta}
          </span>
        ) : null}
      </>
    ),
    className: cn(
      'flex min-h-9 min-w-0 items-center gap-2 rounded-md px-2 text-start text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
      className,
    ),
    'data-slot': 'record-group-link',
  }

  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(defaultProps, props),
    render,
  })
}
