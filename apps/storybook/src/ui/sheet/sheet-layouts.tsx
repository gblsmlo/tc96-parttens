import { Button } from '@tc96/ui/button'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetPrimitive,
  SheetTitle,
  SheetTrigger,
} from '@tc96/ui/sheet'
import { useState } from 'react'
import {
  type SheetControls,
  type SheetSide,
  type SheetVariant,
  sheetControlArgs,
} from './sheet-controls.ts'

interface ComposedSheetProps extends SheetControls {
  defaultOpen?: boolean
  onAction?: () => void
  onOpenChange?: (open: boolean) => void
}

export const ComposedSheet = ({
  actionLabel,
  body,
  cancelLabel,
  defaultOpen = true,
  description,
  footer,
  footerVariant,
  onAction,
  onOpenChange,
  showCloseButton,
  side,
  title,
  trigger,
  variant,
}: Readonly<ComposedSheetProps>) => (
  <Sheet defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <SheetTrigger render={<Button variant="outline" />}>{trigger}</SheetTrigger>
    <SheetPopup showCloseButton={showCloseButton} side={side} variant={variant}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        {description ? (
          <SheetDescription>{description}</SheetDescription>
        ) : null}
      </SheetHeader>
      {body ? (
        <SheetPanel>
          <p className="text-sm">{body}</p>
        </SheetPanel>
      ) : null}
      {footer ? (
        <SheetFooter variant={footerVariant}>
          <SheetClose render={<Button variant="ghost" />}>
            {cancelLabel}
          </SheetClose>
          <Button onClick={onAction}>{actionLabel}</Button>
        </SheetFooter>
      ) : null}
    </SheetPopup>
  </Sheet>
)

const sections = Array.from({ length: 30 }, (_, index) => index + 1)

interface ScrollingPanelSheetProps {
  scrollFade?: boolean
  side?: SheetSide
  variant?: SheetVariant
}

export const ScrollingPanelSheet = ({
  scrollFade = true,
  side = 'right',
  variant = 'default',
}: Readonly<ScrollingPanelSheetProps>) => (
  <Sheet defaultOpen>
    <SheetTrigger render={<Button variant="outline" />}>
      {sheetControlArgs.trigger}
    </SheetTrigger>
    <SheetPopup side={side} variant={variant}>
      <SheetHeader>
        <SheetTitle>{sheetControlArgs.title}</SheetTitle>
        <SheetDescription>{sheetControlArgs.description}</SheetDescription>
      </SheetHeader>
      <SheetPanel scrollFade={scrollFade}>
        <div className="flex flex-col gap-4 text-sm">
          {sections.map((section) => (
            <p key={section}>
              Section {section} of a long content. The panel scrolls while the
              header and the footer stay in place.
            </p>
          ))}
        </div>
      </SheetPanel>
      <SheetFooter>
        <SheetClose render={<Button variant="ghost" />}>
          {sheetControlArgs.cancelLabel}
        </SheetClose>
        <Button>{sheetControlArgs.actionLabel}</Button>
      </SheetFooter>
    </SheetPopup>
  </Sheet>
)

export const DetachedTriggerSheet = () => {
  const [handle] = useState(() => SheetPrimitive.createHandle())

  return (
    <div className="flex flex-col items-center gap-3">
      <SheetTrigger handle={handle} render={<Button variant="outline" />}>
        {sheetControlArgs.trigger}
      </SheetTrigger>
      <Sheet defaultOpen handle={handle}>
        <SheetPopup>
          <SheetHeader>
            <SheetTitle>{sheetControlArgs.title}</SheetTitle>
            <SheetDescription>{sheetControlArgs.description}</SheetDescription>
          </SheetHeader>
          <SheetPanel>
            <p className="text-sm">{sheetControlArgs.body}</p>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>
              {sheetControlArgs.cancelLabel}
            </SheetClose>
            <Button>{sheetControlArgs.actionLabel}</Button>
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    </div>
  )
}
