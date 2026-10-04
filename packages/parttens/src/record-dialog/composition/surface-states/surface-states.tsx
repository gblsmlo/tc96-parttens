'use client'

import { Button } from '@tc96/ui/button'
import { Spinner } from '@tc96/ui/spinner'
import { DialogShell } from '../../components/dialog-shell'
import type { SurfaceStatesProps } from '../../core'
import { useSettledAction } from '../../hooks/use-settled-action'

export function SurfaceStates({
  cancelLabel,
  className,
  confirmLabel,
  confirmingLabel,
  description,
  destructive = false,
  errorMessage,
  onConfirm,
  onOpenChange,
  open,
  size = 'small',
  title,
  titleAncestor,
}: SurfaceStatesProps) {
  const { pending, run } = useSettledAction(open, () => onOpenChange(false))

  return (
    <DialogShell
      className={className}
      description={description}
      destructive={destructive}
      dismissible={!pending}
      errorMessage={errorMessage}
      footer={
        <>
          <Button
            data-slot="surface-states-cancel"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="ghost"
          >
            {cancelLabel}
          </Button>
          <Button
            data-slot="surface-states-confirm"
            disabled={pending}
            onClick={() => void run(onConfirm)}
            type="button"
            variant={destructive ? 'destructive' : 'default'}
          >
            {pending ? <Spinner aria-hidden="true" /> : null}
            {pending ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </Button>
        </>
      }
      onOpenChange={onOpenChange}
      open={open}
      pending={pending}
      role="alertdialog"
      size={size}
      title={title}
      titleAncestor={titleAncestor}
    />
  )
}
