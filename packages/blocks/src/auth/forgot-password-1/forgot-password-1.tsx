'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useEffect, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultForgotPasswordLabels } from './labels'
import type { ForgotPasswordProps, ForgotPasswordValues } from './types'

function toForgotPasswordValues(
  values: Readonly<Record<string, unknown>>,
): ForgotPasswordValues {
  return { email: String(values.email ?? '') }
}

export function ForgotPassword1({
  destination,
  error,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  onResend,
  onSubmit,
  pending = false,
  renderLink = renderAnchor,
  resendIn = 0,
  sent = false,
}: Readonly<ForgotPasswordProps>): ReactElement {
  const labels = resolveAuthLabels(defaultForgotPasswordLabels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const wasSent = useRef(sent)
  const counting = resendIn > 0

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (sent && !wasSent.current) titleRef.current?.focus()
    wasSent.current = sent
  }, [sent])

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

  if (sent) {
    return (
      <AuthCard
        alertRef={alertRef}
        description={labels.sentDescription(destination)}
        error={error}
        errorTitle={labels.errorTitle}
        footer={footer}
        logo={logo}
        title={labels.sentTitle}
        titleRef={titleRef}
      >
        {onResend ? (
          <div className="flex items-center justify-center gap-1 text-sm">
            <span>{labels.didNotReceive}</span>
            <Button
              className="underline"
              disabled={counting || pending}
              onClick={() => {
                if (counting || pending) return
                onResend()
              }}
              size="sm"
              type="button"
              variant="link"
            >
              {counting ? labels.resendIn(resendIn) : labels.resend}
            </Button>
          </div>
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
      <Form
        aria-busy={pending}
        className="flex flex-col gap-4"
        errors={errors}
        onFormSubmit={(values) => {
          if (pending) return
          onSubmit(toForgotPasswordValues(values))
        }}
        ref={formRef}
      >
        <Field name="email">
          <FieldLabel>{labels.email}</FieldLabel>
          <Input autoComplete="email" required type="email" />
          <FieldError />
        </Field>
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )
}
