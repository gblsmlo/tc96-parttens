import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogCreateHandle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from '@tc96/ui/dialog'
import { useState } from 'react'
import {
  type AlertDialogControls,
  alertDialogControlArgs,
} from './alert-dialog-controls.ts'

interface ComposedAlertDialogProps extends AlertDialogControls {
  defaultOpen?: boolean
  onConfirm?: () => void
  onOpenChange?: (open: boolean) => void
}

export const ComposedAlertDialog = ({
  bottomStickOnMobile,
  cancel,
  cancelLabel,
  confirmLabel,
  defaultOpen = true,
  description,
  footerVariant,
  onConfirm,
  onOpenChange,
  title,
  trigger,
}: Readonly<ComposedAlertDialogProps>) => (
  <AlertDialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <AlertDialogTrigger render={<Button variant="outline" />}>
      {trigger}
    </AlertDialogTrigger>
    <AlertDialogPopup bottomStickOnMobile={bottomStickOnMobile}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description ? (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        ) : null}
      </AlertDialogHeader>
      <AlertDialogFooter variant={footerVariant}>
        {cancel ? (
          <AlertDialogClose render={<Button variant="ghost" />}>
            {cancelLabel}
          </AlertDialogClose>
        ) : null}
        <AlertDialogClose
          onClick={onConfirm}
          render={<Button variant="destructive" />}
        >
          {confirmLabel}
        </AlertDialogClose>
      </AlertDialogFooter>
    </AlertDialogPopup>
  </AlertDialog>
)

export const BodyAlertDialog = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger render={<Button variant="outline" />}>
      {alertDialogControlArgs.trigger}
    </AlertDialogTrigger>
    <AlertDialogPopup>
      <AlertDialogHeader>
        <AlertDialogTitle>{alertDialogControlArgs.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {alertDialogControlArgs.description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <ul className="flex list-disc flex-col gap-1 pe-6 ps-10 pb-6 text-sm">
        <li>Describe the first thing it changes.</li>
        <li>Describe the second thing it changes.</li>
      </ul>
      <AlertDialogFooter>
        <AlertDialogClose render={<Button variant="ghost" />}>
          {alertDialogControlArgs.cancelLabel}
        </AlertDialogClose>
        <AlertDialogClose render={<Button variant="destructive" />}>
          {alertDialogControlArgs.confirmLabel}
        </AlertDialogClose>
      </AlertDialogFooter>
    </AlertDialogPopup>
  </AlertDialog>
)

export const DetachedTriggerAlertDialog = () => {
  const [handle] = useState(() => AlertDialogCreateHandle())

  return (
    <div className="flex flex-col items-center gap-3">
      <AlertDialogTrigger handle={handle} render={<Button variant="outline" />}>
        {alertDialogControlArgs.trigger}
      </AlertDialogTrigger>
      <AlertDialog defaultOpen handle={handle}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogControlArgs.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogControlArgs.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              {alertDialogControlArgs.cancelLabel}
            </AlertDialogClose>
            <AlertDialogClose render={<Button variant="destructive" />}>
              {alertDialogControlArgs.confirmLabel}
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  )
}

export const NestedAlertDialog = () => (
  <Dialog defaultOpen>
    <DialogPopup showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Parent dialog</DialogTitle>
        <DialogDescription>
          Describe the task the parent dialog holds.
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 pb-6">
        <ComposedAlertDialog {...alertDialogControlArgs} defaultOpen={false} />
      </div>
    </DialogPopup>
  </Dialog>
)
