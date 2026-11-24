'use client'

import { useForm } from '@tanstack/react-form'
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
import { defaultLogin4Labels } from './labels'
import type { Login4Props, Login4Values } from './types'

const defaultValues: Login4Values = { email: '' }

export function Login4({
  destination,
  error,
  fieldErrors,
  labels: labelsProp,
  logo,
  onResend,
  onSubmit,
  passwordLoginHref,
  pending = false,
  renderLink = renderAnchor,
  resendIn = 0,
  sent = false,
}: Readonly<Login4Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin4Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const wasSent = useRef(sent)
  const counting = resendIn > 0
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (sent && !wasSent.current) titleRef.current?.focus()
    wasSent.current = sent
  }, [sent])

  const footer = passwordLoginHref ? (
    <Button
      className="underline"
      render={renderLink(passwordLoginHref)}
      size="sm"
      variant="link"
    >
      {labels.passwordLogin}
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
                autoComplete="email"
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
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )
}
