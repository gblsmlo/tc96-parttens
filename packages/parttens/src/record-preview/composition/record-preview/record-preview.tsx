'use client'

import { Button } from '@tc96/ui/button'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@tc96/ui/sheet'
import { XIcon } from 'lucide-react'
import type * as React from 'react'
import { useRef } from 'react'
import type { RecordPreviewProps } from '../../core'

export function RecordPreview({
  actions,
  children,
  className,
  closeLabel,
  description,
  finalFocus,
  footer,
  onOpenChange,
  open,
  title,
}: Readonly<RecordPreviewProps>): React.ReactElement {
  const popupRef = useRef<HTMLDivElement | null>(null)

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup
        className={className}
        finalFocus={finalFocus}
        initialFocus={popupRef}
        ref={popupRef}
        showCloseButton={false}
        side="right"
        tabIndex={-1}
        variant="inset"
      >
        <SheetHeader className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-0.5">
              <SheetTitle className="text-base leading-snug">
                {title}
              </SheetTitle>
              {description ? (
                <SheetDescription>{description}</SheetDescription>
              ) : null}
            </div>
            <div className="flex shrink-0 items-start gap-0.5 self-start">
              {actions ? (
                <div
                  className="flex items-center gap-0.5"
                  data-slot="record-preview-header-actions"
                >
                  {actions}
                </div>
              ) : null}
              <SheetClose
                aria-label={closeLabel}
                render={<Button size="icon-sm" variant="ghost" />}
              >
                <XIcon aria-hidden="true" />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <SheetPanel className="p-4 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-4">
          {children}
        </SheetPanel>
        {footer ? <SheetFooter className="px-4">{footer}</SheetFooter> : null}
      </SheetPopup>
    </Sheet>
  )
}
