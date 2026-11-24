import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import type { ReactElement } from 'react'

export interface FlowConfirmDialogProps {
  cancelLabel: string
  confirmLabel: string
  description: string
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
  title: string
}

export function FlowConfirmDialog({
  cancelLabel,
  confirmLabel,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
}: Readonly<FlowConfirmDialogProps>): ReactElement {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>
            {cancelLabel}
          </AlertDialogClose>
          <AlertDialogClose
            render={<Button onClick={onConfirm} variant="destructive" />}
          >
            {confirmLabel}
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
