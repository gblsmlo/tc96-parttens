'use client'

import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import type { ReactElement, ReactNode, Ref } from 'react'

export interface AuthSplitLayoutProps {
  alertRef?: Ref<HTMLDivElement>
  children: ReactNode
  description?: ReactNode
  error?: string
  errorTitle: string
  footer?: ReactNode
  logo?: ReactNode
  media?: ReactNode
  mediaLabel: string
  title: ReactNode
  titleRef?: Ref<HTMLHeadingElement>
}

export function AuthSplitLayout({
  alertRef,
  children,
  description,
  error,
  errorTitle,
  footer,
  logo,
  media,
  mediaLabel,
  title,
  titleRef,
}: Readonly<AuthSplitLayoutProps>): ReactElement {
  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <main className="flex flex-col gap-6 p-6 md:p-10">
        {logo ? <div className="flex">{logo}</div> : null}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1
                className="font-semibold text-2xl outline-none"
                ref={titleRef}
                tabIndex={titleRef ? -1 : undefined}
              >
                {title}
              </h1>
              {description ? (
                <p className="text-muted-foreground text-sm">{description}</p>
              ) : null}
            </div>
            {error ? (
              <Alert ref={alertRef} tabIndex={-1} variant="error">
                <AlertTitle>{errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            {children}
            {footer ? (
              <div
                className="mt-6 flex flex-wrap items-center gap-1 text-muted-foreground text-sm"
                data-slot="auth-footer"
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      {media ? (
        <aside
          aria-label={mediaLabel}
          className="hidden p-4 md:flex md:flex-col"
        >
          <div className="flex-1 overflow-hidden rounded-xl border">
            {media}
          </div>
        </aside>
      ) : null}
    </div>
  )
}
