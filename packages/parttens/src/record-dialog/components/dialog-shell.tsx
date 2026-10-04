'use client'

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '@tc96/ui/dialog'
import { cn } from '@tc96/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { RecordDialogSize } from '../core'

const SIZE_CLASS: Record<RecordDialogSize, string> = {
  small: 'max-w-md',
  default: 'max-w-2xl',
  large: 'max-w-4xl sm:min-h-136',
}

const STRETCH_MIN_HEIGHT: Record<RecordDialogSize, string | undefined> = {
  small: undefined,
  default: 'sm:min-h-96',
  large: undefined,
}

const TITLE_CLASS = 'font-medium font-sans text-foreground text-sm'

type DialogShellRole = 'dialog' | 'alertdialog'

interface DialogShellProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  description?: ReactNode
  destructive?: boolean
  dismissible?: boolean
  errorMessage?: ReactNode
  footer?: ReactNode
  footerStart?: ReactNode
  formHost?: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  pending?: boolean
  role?: DialogShellRole
  size?: RecordDialogSize
  stretchBody?: boolean
  title: ReactNode
  titleAncestor?: string
}

function TitleTrail({
  ancestor,
  children,
}: Readonly<{ ancestor?: string; children: ReactNode }>) {
  if (!ancestor) return children

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 text-sm"
      data-slot="dialog-title-trail"
    >
      <span className="text-muted-foreground">{ancestor}</span>
      <ChevronRightIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      {children}
    </div>
  )
}

function ErrorMessage({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p
      className="px-6 pb-4 text-destructive-foreground text-sm"
      data-slot="dialog-error"
      role="alert"
    >
      {children}
    </p>
  )
}

export function DialogShell({
  actions,
  children,
  className,
  description,
  destructive = false,
  dismissible = true,
  errorMessage,
  footer,
  footerStart,
  formHost,
  onOpenChange,
  open,
  pending,
  role = 'dialog',
  size = 'default',
  stretchBody = false,
  title,
  titleAncestor,
}: DialogShellProps) {
  const handleOpenChange = (next: boolean) => {
    if (!next && !dismissible) return
    onOpenChange(next)
  }

  const actionsRow = actions ? (
    <div
      className={cn(
        'absolute top-2 flex items-center gap-1',
        role === 'alertdialog' ? 'end-2' : 'end-11',
      )}
      data-slot="dialog-actions"
    >
      {actions}
    </div>
  ) : null

  const footerContent = footer ? (
    <>
      {footerStart ? (
        <div
          className="flex items-center gap-2 sm:me-2"
          data-slot="dialog-footer-start"
        >
          {footerStart}
        </div>
      ) : null}
      {footer}
    </>
  ) : null

  const footerClassName = footerStart ? 'sm:items-center' : undefined

  if (role === 'alertdialog') {
    return (
      <AlertDialog onOpenChange={handleOpenChange} open={open}>
        <AlertDialogPopup
          className={cn(SIZE_CLASS[size], className)}
          data-destructive={destructive ? '' : undefined}
          data-size={size}
          data-pending={pending ? '' : undefined}
        >
          {actionsRow}
          <AlertDialogHeader>
            <TitleTrail ancestor={titleAncestor}>
              <AlertDialogTitle className={TITLE_CLASS}>
                {title}
              </AlertDialogTitle>
            </TitleTrail>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          {children ? (
            <div className="px-6 pb-2 text-sm">{children}</div>
          ) : null}
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
          {footerContent ? (
            <AlertDialogFooter className={footerClassName}>
              {footerContent}
            </AlertDialogFooter>
          ) : null}
        </AlertDialogPopup>
      </AlertDialog>
    )
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogPopup
        className={cn(
          SIZE_CLASS[size],
          stretchBody && STRETCH_MIN_HEIGHT[size],
          className,
        )}
        closeProps={{ disabled: !dismissible }}
        data-size={size}
        data-pending={pending ? '' : undefined}
      >
        {actionsRow}
        <DialogHeader>
          <TitleTrail ancestor={titleAncestor}>
            <DialogTitle className={TITLE_CLASS}>{title}</DialogTitle>
          </TitleTrail>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {formHost}
        {children ? (
          stretchBody ? (
            <div
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-1 pb-6"
              data-slot="dialog-panel"
              data-stretch=""
            >
              {children}
            </div>
          ) : (
            <DialogPanel>{children}</DialogPanel>
          )
        ) : null}
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        {footerContent ? (
          <DialogFooter className={footerClassName}>
            {footerContent}
          </DialogFooter>
        ) : null}
      </DialogPopup>
    </Dialog>
  )
}
