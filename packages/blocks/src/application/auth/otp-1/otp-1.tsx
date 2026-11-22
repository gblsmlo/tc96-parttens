'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { OTPField, OTPFieldInput } from '@tc96/ui/otp-field'
import { type ReactElement, useId, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultOtpLabels } from './labels'
import type { OtpProps } from './types'

export function Otp1({
  destination,
  error,
  fieldErrors,
  labels: labelsProp,
  length = 6,
  logo,
  onComplete,
  onResend,
  onSubmit,
  pending = false,
  resendIn = 0,
}: Readonly<OtpProps>): ReactElement {
  const labels = resolveAuthLabels(defaultOtpLabels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const firstDigitLabelId = useId()
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const positions = useMemo(
    () => Array.from({ length }, (_, index) => index + 1),
    [length],
  )
  const counting = resendIn > 0

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <AuthCard
      alertRef={alertRef}
      description={labels.description(length, destination)}
      error={error}
      errorTitle={labels.errorTitle}
      footer={
        onResend ? (
          <>
            <span>{labels.didNotReceive}</span>
            <Button
              className="underline"
              disabled={counting || pending}
              onClick={() => onResend()}
              size="sm"
              variant="link"
            >
              {counting ? labels.resendIn(resendIn) : labels.resend}
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
          const code = String(values.code ?? '')
          if (pending || code.length < length) return
          onSubmit({ code })
        }}
        ref={formRef}
      >
        <Field className="items-center" name="code">
          <FieldLabel>{labels.code}</FieldLabel>
          <OTPField
            length={length}
            onValueComplete={(code) => onComplete?.(code)}
            required
          >
            {positions.map((position) => (
              <OTPFieldInput
                aria-label={labels.digit(position, length)}
                aria-labelledby={position === 1 ? firstDigitLabelId : undefined}
                key={position}
              />
            ))}
          </OTPField>
          <span hidden id={firstDigitLabelId}>
            {labels.digit(1, length)}
          </span>
          <FieldError />
        </Field>
        <Button className="w-full" disabled={pending} type="submit">
          {pending ? labels.submitPending : labels.submit}
        </Button>
      </Form>
    </AuthCard>
  )
}
