'use client'

import { useForm } from '@tanstack/react-form'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordField } from '../shared/auth-password-field'
import { AuthProviders } from '../shared/auth-providers'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin3Labels } from './labels'
import type { Login3Props, Login3Values } from './types'

const defaultValues: Login3Values = { email: '', password: '', remember: false }

export function Login3({
  aside,
  error,
  fieldErrors,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
  renderLink = renderAnchor,
  signupHref,
}: Readonly<Login3Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin3Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  const card = (
    <AuthCard
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={
        signupHref ? (
          <>
            <span>{labels.noAccount}</span>
            <Button
              className="underline"
              render={renderLink(signupHref)}
              size="sm"
              variant="link"
            >
              {labels.signup}
            </Button>
          </>
        ) : undefined
      }
      logo={logo}
      title={labels.title}
    >
      <AuthProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={providers}
      />
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
        <form.Field name="remember">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
                {labels.remember}
              </FieldLabel>
            </Field>
          )}
        </form.Field>
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )

  if (!aside) return card

  return (
    <div className="grid min-h-svh md:grid-cols-2">
      {card}
      <aside
        aria-label={labels.asideLabel}
        className="hidden bg-muted md:flex md:items-center md:justify-center md:p-10"
      >
        {aside}
      </aside>
    </div>
  )
}
