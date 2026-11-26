import type { ReactNode } from 'react'
import {
  recordDialogBarShellVariants,
  recordDialogInlineShellVariants,
  recordDialogRowShellVariants,
} from '../../lib/variants'

export function RecordDialogInlineShell({
  children,
  headline,
}: Readonly<{ children?: ReactNode; headline?: ReactNode }>) {
  const hasHeadline = headline !== undefined

  return (
    <div
      className={recordDialogInlineShellVariants({ headline: hasHeadline })}
      data-slot="record-dialog-inline-shell"
    >
      {headline}
      <div className={recordDialogInlineShellVariants({ part: 'properties' })}>
        {children}
      </div>
    </div>
  )
}

export function RecordDialogRowShell({
  children,
  headline,
}: Readonly<{ children?: ReactNode; headline?: ReactNode }>) {
  const hasHeadline = headline !== undefined

  return (
    <div
      className={recordDialogRowShellVariants({ headline: hasHeadline })}
      data-slot="record-dialog-row-shell"
    >
      {headline}
      <div className={recordDialogRowShellVariants({ part: 'rows' })}>
        {children}
      </div>
    </div>
  )
}

export function RecordDialogBarShell({
  bar,
  children,
  headline,
}: Readonly<{
  bar?: ReactNode
  children?: ReactNode
  headline?: ReactNode
}>) {
  return (
    <div
      className={recordDialogBarShellVariants()}
      data-slot="record-dialog-bar-shell"
    >
      {headline}
      <div className={recordDialogBarShellVariants({ part: 'bar' })}>{bar}</div>
      <div className={recordDialogBarShellVariants({ part: 'content' })}>
        {children}
      </div>
    </div>
  )
}
