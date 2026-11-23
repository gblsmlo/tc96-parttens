'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { type ReactElement, useMemo, useRef, useState } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordFeedback } from '../shared/auth-password-feedback'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { defaultPasswordSuggestions } from '../shared/password-suggestions'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultSignup2Labels } from './labels'
import type { Signup2Props, Signup2Values } from './types'

function toSignup2Values(
  values: Readonly<Record<string, unknown>>,
): Signup2Values {
  return {
    email: String(values.email ?? ''),
    name: String(values.name ?? ''),
    password: String(values.password ?? ''),
  }
}

export function Signup2({
  error,
  fieldErrors,
  labels: labelsProp,
  onSubmit,
  passwordMinLength = 8,
  passwordSuggestions = defaultPasswordSuggestions,
  pending = false,
}: Readonly<Signup2Props>): ReactElement {
  const labels = resolveAuthLabels(defaultSignup2Labels, labelsProp)
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
          if (values.password !== values.confirmPassword) {
            setMismatch(true)
            return
          }
          onSubmit(toSignup2Values(values))
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
    </AuthCard>
  )
}
