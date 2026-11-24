'use client'

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
import { defaultLoginLabels } from './labels'
import type { LoginProps, LoginValues } from './types'

function toLoginValues(values: Readonly<Record<string, unknown>>): LoginValues {
  return {
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
    remember: values.remember === true,
  }
}

export function Login1({
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
}: Readonly<LoginProps>): ReactElement {
  const labels = resolveAuthLabels(defaultLoginLabels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
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
        onFormSubmit={(values) => {
          if (pending) return
          onSubmit(toLoginValues(values))
        }}
        ref={formRef}
      >
        <Field name="email">
          <FieldLabel>{labels.email}</FieldLabel>
          <Input autoComplete="username" required type="email" />
          <FieldError />
        </Field>
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
          name="password"
          showLabel={labels.showPassword}
        />
        <Field name="remember">
          <FieldLabel>
            <Checkbox />
            {labels.remember}
          </FieldLabel>
        </Field>
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )
}
