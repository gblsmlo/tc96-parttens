'use client'

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import { Spinner } from '@tc96/ui/spinner'
import { useRef } from 'react'
import { DialogError } from '../../components/dialog-error'
import type { RecordConfirmDialogProps } from '../../core'
import { useSettledAction } from '../../hooks/use-settled-action'

export function RecordConfirmDialog({
  cancelLabel,
  children,
  className,
  confirmDisabled = false,
  confirmLabel,
  confirmingLabel,
  description,
  errorMessage,
  onConfirm,
  onOpenChange,
  open,
  title,
  tone = 'destructive',
}: RecordConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const { pending, run } = useSettledAction(open, () => onOpenChange(false))

  const handleOpenChange = (next: boolean) => {
    if (!next && pending) return
    onOpenChange(next)
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogPopup
        aria-busy={pending || undefined}
        className={className}
        data-pending={pending ? '' : undefined}
        data-tone={tone}
        initialFocus={tone === 'destructive' ? cancelRef : confirmRef}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        {children ? (
          <div className="px-6 pb-6" data-slot="record-confirm-dialog-body">
            {children}
          </div>
        ) : null}
        {errorMessage ? <DialogError>{errorMessage}</DialogError> : null}
        <AlertDialogFooter>
          <Button
            data-slot="record-confirm-dialog-cancel"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            ref={cancelRef}
            type="button"
            variant="ghost"
          >
            {cancelLabel}
          </Button>
          <Button
            data-slot="record-confirm-dialog-confirm"
            disabled={pending || confirmDisabled}
            onClick={() => void run(onConfirm, confirmRef.current)}
            ref={confirmRef}
            type="button"
            variant={tone === 'destructive' ? 'destructive' : 'default'}
          >
            {pending ? <Spinner aria-hidden="true" /> : null}
            {pending ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
