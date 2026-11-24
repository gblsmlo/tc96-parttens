'use client'

import { useForm } from '@tanstack/react-form'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useMemo, useRef } from 'react'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin10Labels } from './labels'
import { Login10Providers } from './login-10-providers'
import { Login10Testimonials } from './login-10-testimonials'
import type { Login10Props, Login10Values } from './types'

const defaultValues: Login10Values = { email: '', password: '' }

export function Login10({
  copyright,
  error,
  fieldErrors,
  footerLinks,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  onProviderSelect,
  onSubmit,
  pending = false,
  proof,
  providers,
  rating,
  renderLink = renderAnchor,
  signupHref,
  testimonials,
}: Readonly<Login10Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin10Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside
        aria-label={labels.asideLabel}
        className="hidden min-w-0 flex-col gap-10 bg-muted p-10 lg:flex"
      >
        {logo ? <div className="flex">{logo}</div> : null}
        <div className="flex flex-1 flex-col justify-center gap-10">
          <div className="flex max-w-lg flex-col gap-3">
            <h2 className="font-semibold text-4xl tracking-tight">
              {labels.asideHeading}
            </h2>
            <p className="text-lg text-muted-foreground">
              {labels.asideDescription}
            </p>
          </div>
          {testimonials?.length ? (
            <Login10Testimonials labels={labels} testimonials={testimonials} />
          ) : null}
          {rating || proof ? (
            <div className="flex flex-col items-center gap-2 text-center">
              {rating}
              {proof ? (
                <p className="text-muted-foreground text-sm">{proof}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <div className="flex w-full max-w-sm flex-col gap-6">
            {logo ? <div className="flex lg:hidden">{logo}</div> : null}
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-2xl">{labels.title}</h1>
              <p className="text-muted-foreground text-sm">
                {labels.description}
              </p>
            </div>
            {error ? (
              <Alert ref={alertRef} tabIndex={-1} variant="error">
                <AlertTitle>{labels.errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Form
              aria-busy={pending}
              className="flex flex-col gap-4"
              errors={errors}
              onFormSubmit={() => {
                if (pending) return
                void form.handleSubmit()
              }}
              ref={formRef}
            >
              <form.Field name="email">
                {(field) => (
                  <Field name={field.name}>
                    <FieldLabel>{labels.email}</FieldLabel>
                    <Input
                      autoComplete="username"
                      onBlur={field.handleBlur}
                      onValueChange={(value) => field.handleChange(value)}
                      required
                      type="email"
                      value={field.state.value}
                    />
                    <FieldError />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <AuthPasswordField
                    autoComplete="current-password"
                    hideLabel={labels.hidePassword}
                    label={labels.password}
                    labelAction={
                      forgotPasswordHref ? (
                        <Button
                          className="underline"
                          render={renderLink(forgotPasswordHref)}
                          size="sm"
                          variant="link"
                        >
                          {labels.forgotPassword}
                        </Button>
                      ) : undefined
                    }
                    name={field.name}
                    onValueChange={(value) => field.handleChange(value)}
                    showLabel={labels.showPassword}
                  />
                )}
              </form.Field>
              <Button className="w-full" loading={pending} type="submit">
                {labels.submit}
              </Button>
            </Form>
            <Login10Providers
              labels={labels}
              onSelect={onProviderSelect}
              pending={pending}
              providers={providers}
            />
            {signupHref ? (
              <div
                className="flex flex-wrap items-center justify-center gap-1 text-muted-foreground text-sm"
                data-slot="auth-footer"
              >
                <span>{labels.noAccount}</span>
                <Button
                  className="underline"
                  render={renderLink(signupHref)}
                  size="sm"
                  variant="link"
                >
                  {labels.signup}
                </Button>
              </div>
            ) : null}
          </div>
        </main>
        {footerLinks?.length || copyright ? (
          <footer className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 px-4 pb-4 text-muted-foreground text-xs sm:px-6">
            {footerLinks?.length ? (
              <nav aria-label={labels.footerLinks}>
                <ul className="flex flex-wrap items-center gap-x-1">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <Button
                        render={renderLink(link.href)}
                        size="sm"
                        variant="link"
                      >
                        {link.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            {copyright ? <p>{copyright}</p> : null}
          </footer>
        ) : null}
      </div>
    </div>
  )
}
