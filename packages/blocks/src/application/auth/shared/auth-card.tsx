'use client'

import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import type { ReactElement, ReactNode, Ref } from 'react'

export interface AuthCardProps {
  alertRef?: Ref<HTMLDivElement>
  children?: ReactNode
  description?: ReactNode
  error?: string
  errorTitle: string
  footer?: ReactNode
  logo?: ReactNode
  notice?: ReactNode
  title: ReactNode
  titleRef?: Ref<HTMLDivElement>
}

export function AuthCard({
  alertRef,
  children,
  description,
  error,
  errorTitle,
  footer,
  logo,
  notice,
  title,
  titleRef,
}: Readonly<AuthCardProps>): ReactElement {
  return (
    <main className="flex min-h-svh items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="justify-items-center text-center">
            {logo ? (
              <div className="mb-2 flex justify-center">{logo}</div>
            ) : null}
            <CardTitle
              ref={titleRef}
              render={(props) => <h1 {...props} />}
              tabIndex={titleRef ? -1 : undefined}
            >
              {title}
            </CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardPanel className="flex flex-col gap-4">
            {error ? (
              <Alert ref={alertRef} tabIndex={-1} variant="error">
                <AlertTitle>{errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            {children}
          </CardPanel>
        </Card>
        {footer ? (
          <div
            className="flex flex-wrap items-center justify-center gap-1 text-muted-foreground text-sm"
            data-slot="auth-footer"
          >
            {footer}
          </div>
        ) : null}
        {notice}
      </div>
    </main>
  )
}
