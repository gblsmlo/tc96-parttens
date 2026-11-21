import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { OTPField, OTPFieldInput, OTPFieldSeparator } from '@tc96/ui/otp-field'
import { type ComponentProps, useState } from 'react'
import type { OTPFieldControls } from './otp-field-controls.ts'
import { otpFieldLength, slotLabel } from './otp-field-variants.ts'

type OTPFieldProps = ComponentProps<typeof OTPField>

type ComposedOTPFieldProps = OTPFieldControls &
  Partial<Omit<OTPFieldProps, keyof OTPFieldControls | 'children'>>

interface OTPSlotsProps {
  length: number
  placeholder?: string
  separator?: boolean
}

interface CodeCheckOTPFieldProps {
  code: string
  initialValue?: string
}

interface TwoFactorFormProps {
  onVerify?: (code: string) => void
}

const hiddenLabel = 'Verification code'

const slotKeys = (length: number) =>
  Array.from({ length }, (_, index) => `otp-slot-${index}`)

export const OTPSlots = ({
  length,
  placeholder,
  separator,
}: Readonly<OTPSlotsProps>) => {
  const keys = slotKeys(length)
  const half = Math.ceil(length / 2)
  const renderSlot = (key: string, index: number) => (
    <OTPFieldInput
      aria-label={index === 0 ? undefined : slotLabel(index, length)}
      key={key}
      placeholder={placeholder || undefined}
    />
  )
  return (
    <>
      {keys.slice(0, half).map((key, index) => renderSlot(key, index))}
      {separator ? <OTPFieldSeparator /> : null}
      {keys.slice(half).map((key, index) => renderSlot(key, index + half))}
    </>
  )
}

export const ComposedOTPField = ({
  defaultValue,
  description,
  disabled,
  invalid,
  label,
  length = otpFieldLength,
  mask,
  placeholder,
  readOnly,
  separator,
  size,
  ...props
}: Readonly<ComposedOTPFieldProps>) => (
  <Field invalid={invalid}>
    <FieldLabel className={label ? undefined : 'sr-only'}>
      {label || hiddenLabel}
    </FieldLabel>
    <OTPField
      defaultValue={defaultValue || undefined}
      disabled={disabled}
      key={defaultValue}
      length={length}
      mask={mask}
      readOnly={readOnly}
      size={size}
      {...props}
    >
      <OTPSlots
        length={length}
        placeholder={placeholder}
        separator={separator}
      />
    </OTPField>
    {description ? <FieldDescription>{description}</FieldDescription> : null}
  </Field>
)

export const CodeCheckOTPField = ({
  code,
  initialValue = '',
}: Readonly<CodeCheckOTPFieldProps>) => {
  const [value, setValue] = useState(initialValue)
  const complete = value.length === code.length
  const invalid = complete && value !== code
  return (
    <Field invalid={invalid}>
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={code.length} onValueChange={setValue} value={value}>
        <OTPSlots length={code.length} />
      </OTPField>
      {invalid ? (
        <FieldError match>
          That code is incorrect. Check the latest email and try again.
        </FieldError>
      ) : (
        <FieldDescription>
          {complete
            ? 'Code verified.'
            : `Enter the ${code.length}-digit code we sent to ana@example.com.`}
        </FieldDescription>
      )}
    </Field>
  )
}

export const TwoFactorForm = ({ onVerify }: Readonly<TwoFactorFormProps>) => (
  <Form
    className="flex w-full flex-col gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onVerify?.(String(new FormData(event.currentTarget).get('code') ?? ''))
    }}
  >
    <Field name="code">
      <FieldLabel>Authentication code</FieldLabel>
      <OTPField autoSubmit length={otpFieldLength}>
        <OTPSlots length={otpFieldLength} />
      </OTPField>
      <FieldDescription>
        Open your authenticator app and enter the code it shows for tc96.
      </FieldDescription>
    </Field>
    <div>
      <Button type="submit">Verify</Button>
    </div>
  </Form>
)

const recoveryCodeLength = 8

const toUpperCase = (value: string) => value.toUpperCase()

export const RecoveryCodeField = () => (
  <Field>
    <FieldLabel>Recovery code</FieldLabel>
    <OTPField
      length={recoveryCodeLength}
      normalizeValue={toUpperCase}
      validationType="alphanumeric"
    >
      <OTPSlots length={recoveryCodeLength} separator />
    </OTPField>
    <FieldDescription>
      Use one of the backup codes you saved when you turned on two-step
      verification.
    </FieldDescription>
  </Field>
)
