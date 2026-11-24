'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { Fragment, type ReactElement, useMemo, useRef, useState } from 'react'
import { AuthPasswordFeedback } from '../shared/auth-password-feedback'
import { AuthPasswordField } from '../shared/auth-password-field'
import { AuthSplitLayout } from '../shared/auth-split-layout'
import { AuthSplitProviders } from '../shared/auth-split-providers'
import { resolveAuthLabels } from '../shared/labels'
import { defaultPasswordSuggestions } from '../shared/password-suggestions'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultSignup6Labels } from './labels'
import type { Signup6Props, Signup6Values } from './types'

function toSignup6Values(
  values: Readonly<Record<string, unknown>>,
): Signup6Values {
  return {
    email: String(values.email ?? ''),
    name: String(values.name ?? ''),
    password: String(values.password ?? ''),
  }
}

export function Signup6({
  error,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  media,
  onProviderSelect,
  onSubmit,
  passwordMinLength = 8,
  passwordSuggestions = defaultPasswordSuggestions,
  pending = false,
  privacyHref,
  providers,
  renderLink = renderAnchor,
  showProviders = true,
  termsHref,
}: Readonly<Signup6Props>): ReactElement {
  const labels = resolveAuthLabels(defaultSignup6Labels, labelsProp)
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
    <AuthSplitLayout
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
      media={media}
      mediaLabel={labels.mediaLabel}
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
          onSubmit(toSignup6Values(values))
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
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
      <AuthSplitProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={showProviders ? providers : undefined}
      />
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
    </AuthSplitLayout>
  )
}
