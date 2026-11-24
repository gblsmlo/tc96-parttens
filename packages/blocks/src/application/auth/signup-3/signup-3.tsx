'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { Fragment, type ReactElement, useMemo, useRef } from 'react'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultSignup3Labels } from './labels'
import { Signup3PasswordField } from './signup-3-password-field'
import { Signup3Providers } from './signup-3-providers'
import type { Signup3Props, Signup3Values } from './types'

function toSignup3Values(
  values: Readonly<Record<string, unknown>>,
): Signup3Values {
  return {
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  }
}

export function Signup3({
  badge,
  brands,
  brandsLabel,
  error,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  onProviderSelect,
  onSubmit,
  passwordMinLength = 8,
  pending = false,
  privacyHref,
  providers,
  renderLink = renderAnchor,
  termsHref,
}: Readonly<Signup3Props>): ReactElement {
  const labels = resolveAuthLabels(defaultSignup3Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  const legalLinks: { href: string; label: string }[] = []
  if (termsHref) legalLinks.push({ href: termsHref, label: labels.terms })
  if (privacyHref) legalLinks.push({ href: privacyHref, label: labels.privacy })

  return (
    <div className="flex min-h-svh flex-col">
      {logo || loginHref ? (
        <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex">{logo}</div>
          {loginHref ? (
            <div className="flex flex-wrap items-center gap-1 text-muted-foreground text-sm">
              <span>{labels.hasAccount}</span>
              <Button
                className="underline"
                render={renderLink(loginHref)}
                size="sm"
                variant="link"
              >
                {labels.login}
              </Button>
            </div>
          ) : null}
        </header>
      ) : null}
      <main className="flex flex-1 flex-col justify-center gap-12 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            {badge ? <Badge variant="outline">{badge}</Badge> : null}
            <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">
              {labels.heading}
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              {labels.pitch}
            </p>
          </div>
          <Card className="w-full max-w-md lg:justify-self-end">
            <CardHeader className="gap-1">
              <CardTitle render={(props) => <h2 {...props} />}>
                {labels.title}
              </CardTitle>
              <CardDescription>{labels.description}</CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-4">
              {error ? (
                <Alert ref={alertRef} tabIndex={-1} variant="error">
                  <AlertTitle>{labels.errorTitle}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Signup3Providers
                labels={labels}
                onSelect={onProviderSelect}
                pending={pending}
                providers={providers}
              />
              <Form
                aria-busy={pending}
                className="flex flex-col gap-4"
                errors={errors}
                onFormSubmit={(values) => {
                  if (pending) return
                  onSubmit(toSignup3Values(values))
                }}
                ref={formRef}
              >
                <Field name="email">
                  <FieldLabel>{labels.email}</FieldLabel>
                  <Input autoComplete="email" required type="email" />
                  <FieldError />
                </Field>
                <Signup3PasswordField
                  hideLabel={labels.hidePassword}
                  label={labels.password}
                  minLength={passwordMinLength}
                  name="password"
                  placeholder={labels.passwordPlaceholder}
                  showLabel={labels.showPassword}
                />
                <Button className="w-full" loading={pending} type="submit">
                  {labels.submit}
                  <ArrowRightIcon aria-hidden />
                </Button>
              </Form>
              {legalLinks.length ? (
                <p className="flex flex-wrap items-center gap-x-1 text-muted-foreground text-xs">
                  <span>{labels.termsLead}</span>
                  {legalLinks.map((link, index) => (
                    <Fragment key={link.href}>
                      {index > 0 ? <span>{labels.termsAnd}</span> : null}
                      <Button
                        className="px-0 underline"
                        render={renderLink(link.href)}
                        size="sm"
                        variant="link"
                      >
                        {link.label}
                      </Button>
                    </Fragment>
                  ))}
                </p>
              ) : null}
            </CardPanel>
          </Card>
        </div>
        {brands ? (
          <section
            aria-label={brandsLabel ?? labels.brandsGroup}
            className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4"
          >
            {brandsLabel ? (
              <p className="text-muted-foreground text-sm">{brandsLabel}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground">
              {brands}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
