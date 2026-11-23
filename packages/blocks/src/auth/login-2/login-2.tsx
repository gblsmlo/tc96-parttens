'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { type ReactElement, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin2Labels } from './labels'
import type { Login2Props, Login2Values } from './types'

function toLogin2Values(
  values: Readonly<Record<string, unknown>>,
): Login2Values {
  return {
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  }
}

export function Login2({
  error,
  fieldErrors,
  labels: labelsProp,
  onSubmit,
  pending = false,
}: Readonly<Login2Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin2Labels, labelsProp)
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
      title={labels.title}
    >
      <Form
        aria-busy={pending}
        className="flex flex-col gap-4"
        errors={errors}
        onFormSubmit={(values) => {
          if (pending) return
          onSubmit(toLogin2Values(values))
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
          name="password"
          showLabel={labels.showPassword}
        />
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )
}
