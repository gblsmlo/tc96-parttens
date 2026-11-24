'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { type ReactElement, useEffect, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultForgotPassword2Labels } from './labels'
import type { ForgotPassword2Props, ForgotPassword2Values } from './types'

function toForgotPassword2Values(
  values: Readonly<Record<string, unknown>>,
): ForgotPassword2Values {
  return { email: String(values.email ?? '') }
}

export function ForgotPassword2({
  destination,
  error,
  fieldErrors,
  labels: labelsProp,
  onSubmit,
  pending = false,
  sent = false,
}: Readonly<ForgotPassword2Props>): ReactElement {
  const labels = resolveAuthLabels(defaultForgotPassword2Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const wasSent = useRef(sent)

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (sent && !wasSent.current) titleRef.current?.focus()
    wasSent.current = sent
  }, [sent])

  if (sent) {
    return (
      <AuthCard
        alertRef={alertRef}
        description={labels.sentDescription(destination)}
        error={error}
        errorTitle={labels.errorTitle}
        title={labels.sentTitle}
        titleRef={titleRef}
      />
    )
  }

  return (
    <AuthCard
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      title={labels.title}
    >
      <Form
        aria-busy={pending}
        className="flex flex-col gap-4"
        errors={errors}
        onFormSubmit={(values) => {
          if (pending) return
          onSubmit(toForgotPassword2Values(values))
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
