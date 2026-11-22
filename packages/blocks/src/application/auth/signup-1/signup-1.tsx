'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { Fragment, type ReactElement, useMemo, useRef, useState } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordFeedback } from '../shared/auth-password-feedback'
import { AuthPasswordField } from '../shared/auth-password-field'
import { AuthProviders } from '../shared/auth-providers'
import { resolveAuthLabels } from '../shared/labels'
import { defaultPasswordSuggestions } from '../shared/password-suggestions'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultSignupLabels } from './labels'
import type { SignupProps, SignupValues } from './types'

function toSignupValues(
  values: Readonly<Record<string, unknown>>,
): SignupValues {
  return {
    email: String(values.email ?? ''),
    name: String(values.name ?? ''),
    password: String(values.password ?? ''),
  }
}

export function Signup1({
  error,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  onProviderSelect,
  onSubmit,
  passwordMinLength = 8,
  passwordSuggestions = defaultPasswordSuggestions,
  pending = false,
  privacyHref,
  providers,
  renderLink = renderAnchor,
  termsHref,
}: Readonly<SignupProps>): ReactElement {
  const labels = resolveAuthLabels(defaultSignupLabels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const [password, setPassword] = useState('')
  const [mismatch, setMismatch] = useState(false)
  const errors = useMemo(
    () => ({
      ...toFormErrors(fieldErrors),
      ...(mismatch ? { confirmPassword: labels.passwordMismatch } : undefined),
    }),
    [fieldErrors, labels.passwordMismatch, mismatch],
  )

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  const legalLinks: { href: string; label: string }[] = []
  if (termsHref) legalLinks.push({ href: termsHref, label: labels.terms })
  if (privacyHref) legalLinks.push({ href: privacyHref, label: labels.privacy })

  return (
    <AuthCard
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={
        loginHref ? (
          <>
            <span>{labels.hasAccount}</span>
            <Button
              className="underline"
              render={renderLink(loginHref)}
              size="sm"
              variant="link"
            >
              {labels.login}
            </Button>
          </>
        ) : undefined
      }
      logo={logo}
      title={labels.title}
    >
      <Form
        aria-busy={pending}
        className="flex flex-col gap-4"
        errors={errors}
        onFormSubmit={(values) => {
          if (pending) return
          if (values.password !== values.confirmPassword) {
            setMismatch(true)
            return
          }
          onSubmit(toSignupValues(values))
        }}
        ref={formRef}
      >
        <Field name="name">
          <FieldLabel>{labels.name}</FieldLabel>
          <Input autoComplete="name" required />
          <FieldError />
        </Field>
        <Field name="email">
          <FieldLabel>{labels.email}</FieldLabel>
          <Input autoComplete="email" required type="email" />
          <FieldError />
        </Field>
        <AuthPasswordField
          autoComplete="new-password"
          hideLabel={labels.hidePassword}
          label={labels.password}
          minLength={passwordMinLength}
          name="password"
          onValueChange={(value) => {
            setPassword(value)
            setMismatch(false)
          }}
          showLabel={labels.showPassword}
        >
          <AuthPasswordFeedback
            labels={labels}
            minLength={passwordMinLength}
            password={password}
            suggestions={passwordSuggestions}
          />
        </AuthPasswordField>
        <AuthPasswordField
          autoComplete="new-password"
          hideLabel={labels.hidePassword}
          label={labels.confirmPassword}
          name="confirmPassword"
          onValueChange={() => setMismatch(false)}
          showLabel={labels.showPassword}
        />
        <Button className="w-full" disabled={pending} type="submit">
          {pending ? labels.submitPending : labels.submit}
        </Button>
      </Form>
      <AuthProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={providers}
      />
      {legalLinks.length ? (
        <p className="flex flex-wrap items-center justify-center gap-x-1 text-center text-muted-foreground text-xs">
          <span>{labels.termsLead}</span>
          {legalLinks.map((link, index) => (
            <Fragment key={link.href}>
              {index > 0 ? <span>{labels.termsAnd}</span> : null}
              <Button
                className="px-0 underline"
                render={renderLink(link.href)}
                size="xs"
                variant="link"
              >
                {link.label}
              </Button>
            </Fragment>
          ))}
        </p>
      ) : null}
    </AuthCard>
  )
}
