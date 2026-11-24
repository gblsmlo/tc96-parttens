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
import { defaultLogin6Labels } from './labels'
import { Login6Providers } from './login-6-providers'
import type { Login6Props, Login6Values } from './types'

const defaultValues: Login6Values = { email: '', password: '' }

export function Login6({
  error,
  fieldErrors,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  media,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
  renderLink = renderAnchor,
  signupHref,
}: Readonly<Login6Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin6Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <main className="flex flex-col gap-6 p-6 md:p-10">
        {logo ? <div className="flex">{logo}</div> : null}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-1 text-center">
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
            <Login6Providers
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
        </div>
      </main>
      {media ? (
        <aside
          aria-label={labels.mediaLabel}
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
