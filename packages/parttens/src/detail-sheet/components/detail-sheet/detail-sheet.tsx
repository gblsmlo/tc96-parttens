'use client'

import type { Dialog } from '@base-ui/react/dialog'
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

export interface DetailSheetProps extends Omit<Dialog.Root.Props, 'children'> {
  actions?: React.ReactNode
  children?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  title?: React.ReactNode
}

export function DetailSheet({
  actions,
  children,
  description,
  footer,
  showCloseButton = true,
  title,
  ...props
}: Readonly<DetailSheetProps>): React.ReactElement {
  return (
    <Sheet {...props}>
      <SheetPopup showCloseButton={false} side="right">
        {title || description || actions || showCloseButton ? (
          <SheetHeader className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-0.5">
                {title ? <SheetTitle>{title}</SheetTitle> : null}
                {description ? (
                  <SheetDescription>{description}</SheetDescription>
                ) : null}
              </div>

              {actions || showCloseButton ? (
                <div className="flex shrink-0 items-start gap-1 self-start">
                  {actions ? (
                    <div className="flex items-center gap-1">{actions}</div>
                  ) : null}
                  {showCloseButton ? (
                    <SheetClose
                      aria-label="Fechar detalhes"
                      render={<Button size="icon-sm" variant="ghost" />}
                    >
                      <XIcon aria-hidden="true" />
                    </SheetClose>
                  ) : null}
                </div>
              ) : null}
            </div>
          </SheetHeader>
        ) : null}

        <SheetPanel className="p-4 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-4">
          {children}
        </SheetPanel>

        {footer ? <SheetFooter className="px-4">{footer}</SheetFooter> : null}
      </SheetPopup>
    </Sheet>
  )
}
