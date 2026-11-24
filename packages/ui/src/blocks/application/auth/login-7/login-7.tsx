'use client'

import { useForm } from '@tanstack/react-form'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
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
import { type ReactElement, useMemo, useRef } from 'react'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin7Labels } from './labels'
import { Login7Providers } from './login-7-providers'
import type { Login7Props, Login7Values } from './types'

const defaultValues: Login7Values = { email: '', password: '' }

export function Login7({
  error,
  fieldErrors,
  footerLinks,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
  renderLink = renderAnchor,
  signupHref,
}: Readonly<Login7Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin7Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {logo ? <div className="flex justify-center">{logo}</div> : null}
          <Card>
            <CardHeader className="gap-1">
              <CardTitle render={(props) => <h1 {...props} />}>
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
              <Login7Providers
                labels={labels}
                onSelect={onProviderSelect}
                pending={pending}
                providers={providers}
              />
            </CardPanel>
          </Card>
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
      {footerLinks?.length ? (
        <footer className="p-4 sm:p-6">
          <nav aria-label={labels.footerLinksLabel}>
            <ul className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-xs">
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
        </footer>
      ) : null}
    </div>
  )
}
