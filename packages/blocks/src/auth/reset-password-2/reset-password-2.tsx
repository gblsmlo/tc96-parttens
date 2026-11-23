'use client'

import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordFeedback } from '../shared/auth-password-feedback'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { defaultPasswordSuggestions } from '../shared/password-suggestions'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { formatCountdown } from './format-countdown'
import { defaultResetPassword2Labels } from './labels'
import type { ResetPassword2Props, ResetPassword2Values } from './types'

const expiringSoonSeconds = 60

function toResetPassword2Values(
  values: Readonly<Record<string, unknown>>,
): ResetPassword2Values {
  return { password: String(values.password ?? '') }
}

export function ResetPassword2({
  error,
  expiresIn,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  onRequestNewLink,
  onSubmit,
  passwordMinLength = 8,
  passwordSuggestions = defaultPasswordSuggestions,
  pending = false,
  renderLink = renderAnchor,
  requestNewLinkIn = 0,
}: Readonly<ResetPassword2Props>): ReactElement {
  const labels = resolveAuthLabels(defaultResetPassword2Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [password, setPassword] = useState('')
  const [mismatch, setMismatch] = useState(false)
  const errors = useMemo(
    () => ({
      ...toFormErrors(fieldErrors),
      ...(mismatch ? { confirmPassword: labels.passwordMismatch } : undefined),
    }),
    [fieldErrors, labels.passwordMismatch, mismatch],
  )
  const expired = expiresIn !== undefined && !(expiresIn > 0)
  const wasExpired = useRef(expired)
  const cooling = requestNewLinkIn > 0

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (expired && !wasExpired.current) titleRef.current?.focus()
    wasExpired.current = expired
  }, [expired])

  const footer = loginHref ? (
    <Button
      className="underline"
      render={renderLink(loginHref)}
      size="sm"
      variant="link"
    >
      {labels.backToLogin}
    </Button>
  ) : undefined

  if (expired) {
    return (
      <AuthCard
        alertRef={alertRef}
        description={labels.expiredDescription}
        error={error}
        errorTitle={labels.errorTitle}
        footer={footer}
        logo={logo}
        title={labels.expiredTitle}
        titleRef={titleRef}
      >
        {onRequestNewLink ? (
          <Button
            className="w-full"
            disabled={cooling || pending}
            onClick={() => {
              if (cooling || pending) return
              onRequestNewLink()
            }}
            type="button"
          >
            {cooling
              ? labels.requestNewLinkIn(formatCountdown(requestNewLinkIn))
              : labels.requestNewLink}
          </Button>
        ) : null}
      </AuthCard>
    )
  }

  return (
    <AuthCard
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={footer}
      logo={logo}
      title={labels.title}
    >
      {expiresIn === undefined ? null : (
        <>
          <p className="text-muted-foreground text-sm tabular-nums">
            {labels.linkExpiresIn(formatCountdown(expiresIn))}
          </p>
          <span aria-live="polite" className="sr-only">
            {expiresIn <= expiringSoonSeconds ? labels.expiringSoon : ''}
          </span>
        </>
      )}
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
          onSubmit(toResetPassword2Values(values))
        }}
        ref={formRef}
      >
        <AuthPasswordField
          autoComplete="new-password"
          hideLabel={labels.hidePassword}
          label={labels.newPassword}
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
    </AuthCard>
  )
}
