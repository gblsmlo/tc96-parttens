import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogCreateHandle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@tc96/ui/dialog'
import { useState } from 'react'
import { type DialogControls, dialogControlArgs } from './dialog-controls.ts'

interface ComposedDialogProps extends DialogControls {
  defaultOpen?: boolean
  onAction?: () => void
  onOpenChange?: (open: boolean) => void
}

export const ComposedDialog = ({
  actionLabel,
  body,
  bottomStickOnMobile,
  cancelLabel,
  defaultOpen = true,
  description,
  footer,
  footerVariant,
  onAction,
  onOpenChange,
  showCloseButton,
  title,
  trigger,
}: Readonly<ComposedDialogProps>) => (
  <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <DialogTrigger render={<Button variant="outline" />}>
      {trigger}
    </DialogTrigger>
    <DialogPopup
      bottomStickOnMobile={bottomStickOnMobile}
      showCloseButton={showCloseButton}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? (
          <DialogDescription>{description}</DialogDescription>
        ) : null}
      </DialogHeader>
      {body ? (
        <DialogPanel>
          <p className="text-sm">{body}</p>
        </DialogPanel>
      ) : null}
      {footer ? (
        <DialogFooter variant={footerVariant}>
          <DialogClose render={<Button variant="ghost" />}>
            {cancelLabel}
          </DialogClose>
          <Button onClick={onAction}>{actionLabel}</Button>
        </DialogFooter>
      ) : null}
    </DialogPopup>
  </Dialog>
)

const sections = Array.from({ length: 30 }, (_, index) => index + 1)

interface ScrollingPanelDialogProps {
  scrollFade?: boolean
}

export const ScrollingPanelDialog = ({
  scrollFade = true,
}: Readonly<ScrollingPanelDialogProps>) => (
  <Dialog defaultOpen>
    <DialogTrigger render={<Button variant="outline" />}>
      {dialogControlArgs.trigger}
    </DialogTrigger>
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>{dialogControlArgs.title}</DialogTitle>
        <DialogDescription>{dialogControlArgs.description}</DialogDescription>
      </DialogHeader>
      <DialogPanel scrollFade={scrollFade}>
        <div className="flex flex-col gap-4 text-sm">
          {sections.map((section) => (
            <p key={section}>
              Section {section} of a long content. The panel scrolls while the
              header and the footer stay in place.
            </p>
          ))}
        </div>
      </DialogPanel>
      <DialogFooter>
        <DialogClose render={<Button variant="ghost" />}>
          {dialogControlArgs.cancelLabel}
        </DialogClose>
        <Button>{dialogControlArgs.actionLabel}</Button>
      </DialogFooter>
    </DialogPopup>
  </Dialog>
)

export const DetachedTriggerDialog = () => {
  const [handle] = useState(() => DialogCreateHandle())

  return (
    <div className="flex flex-col items-center gap-3">
      <DialogTrigger handle={handle} render={<Button variant="outline" />}>
        {dialogControlArgs.trigger}
      </DialogTrigger>
      <Dialog defaultOpen handle={handle}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>{dialogControlArgs.title}</DialogTitle>
            <DialogDescription>
              {dialogControlArgs.description}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel>
            <p className="text-sm">{dialogControlArgs.body}</p>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              {dialogControlArgs.cancelLabel}
            </DialogClose>
            <Button>{dialogControlArgs.actionLabel}</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  )
}

export const NestedDialog = () => (
  <Dialog defaultOpen>
    <DialogTrigger render={<Button variant="outline" />}>
      Open parent dialog
    </DialogTrigger>
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>Parent dialog</DialogTitle>
        <DialogDescription>
          Describe the task the parent dialog holds.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <ComposedDialog {...dialogControlArgs} defaultOpen={false} />
      </DialogFooter>
    </DialogPopup>
  </Dialog>
)
