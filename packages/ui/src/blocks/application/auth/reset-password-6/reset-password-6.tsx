'use client'

import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useMemo, useRef, useState } from 'react'
import { AuthPasswordFeedback } from '../shared/auth-password-feedback'
import { AuthPasswordField } from '../shared/auth-password-field'
import { AuthSplitLayout } from '../shared/auth-split-layout'
import { resolveAuthLabels } from '../shared/labels'
import { defaultPasswordSuggestions } from '../shared/password-suggestions'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultResetPassword6Labels } from './labels'
import type { ResetPassword6Props, ResetPassword6Values } from './types'

function toResetPassword6Values(
  values: Readonly<Record<string, unknown>>,
): ResetPassword6Values {
  return { password: String(values.password ?? '') }
}

export function ResetPassword6({
  error,
  fieldErrors,
  labels: labelsProp,
  loginHref,
  logo,
  media,
  onSubmit,
  passwordMinLength = 8,
  passwordSuggestions = defaultPasswordSuggestions,
  pending = false,
  renderLink = renderAnchor,
}: Readonly<ResetPassword6Props>): ReactElement {
  const labels = resolveAuthLabels(defaultResetPassword6Labels, labelsProp)
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
    <AuthSplitLayout
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={
        loginHref ? (
          <Button
            className="underline"
            render={renderLink(loginHref)}
            size="sm"
            variant="link"
          >
            {labels.backToLogin}
          </Button>
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
          onSubmit(toResetPassword6Values(values))
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
    </AuthSplitLayout>
  )
}
