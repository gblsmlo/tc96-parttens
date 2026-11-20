import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldValidity,
} from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { Textarea } from '@tc96/ui/textarea'
import { type FormEvent, useState } from 'react'
import type { FieldControls } from './field-controls.ts'

export const RequiredMarker = () => (
  <span aria-hidden className="text-destructive-foreground">
    *
  </span>
)

export const ComposedField = ({
  description,
  disabled,
  error,
  invalid,
  label,
  placeholder,
  required,
}: Readonly<FieldControls>) => (
  <Field disabled={disabled} invalid={invalid}>
    {label ? (
      <FieldLabel>
        {label}
        {required ? <RequiredMarker /> : null}
      </FieldLabel>
    ) : null}
    <Input placeholder={placeholder} required={required} type="text" />
    {description ? <FieldDescription>{description}</FieldDescription> : null}
    {error ? (
      <FieldError match={invalid ? true : undefined}>{error}</FieldError>
    ) : null}
  </Field>
)

export const TextareaField = () => (
  <Field>
    <FieldLabel>Notes</FieldLabel>
    <Textarea placeholder="Enter your notes" />
    <FieldDescription>Visible on your profile.</FieldDescription>
  </Field>
)

export const CheckboxInLabelField = () => (
  <Field>
    <FieldLabel>
      <Checkbox />
      Accept terms
    </FieldLabel>
  </Field>
)

export const RadioItemsField = () => (
  <Field name="size">
    <span className="font-medium text-sm" id="field-radio-items-label">
      Size
    </span>
    <RadioGroup aria-labelledby="field-radio-items-label" defaultValue="small">
      <FieldItem>
        <FieldLabel>
          <Radio value="small" />
          Small
        </FieldLabel>
      </FieldItem>
      <FieldItem>
        <FieldLabel>
          <Radio value="medium" />
          Medium
        </FieldLabel>
      </FieldItem>
      <FieldItem>
        <FieldLabel>
          <Radio value="large" />
          Large
        </FieldLabel>
      </FieldItem>
    </RadioGroup>
  </Field>
)

export const FieldControlField = () => (
  <Field>
    <FieldLabel>Volume</FieldLabel>
    <FieldControl className="w-full" defaultValue={50} type="range" />
    <FieldDescription>Drag to set the level.</FieldDescription>
  </Field>
)

export const ValidityField = () => (
  <Field validationMode="onChange">
    <FieldLabel>Email</FieldLabel>
    <Input placeholder="Enter your email" required type="email" />
    <FieldValidity>
      {({ validity }) => (
        <p className="text-muted-foreground text-xs">
          {validity.valid === null
            ? 'Not checked yet.'
            : validity.valid
              ? 'Looks good.'
              : 'Not a valid email yet.'}
        </p>
      )}
    </FieldValidity>
  </Field>
)

export const CreateAccountForm = () => {
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmittedName(String(data.get('fullName') ?? ''))
  }

  return (
    <Form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit}>
      <Field name="fullName">
        <FieldLabel>
          Full name
          <RequiredMarker />
        </FieldLabel>
        <Input placeholder="Ada Lovelace" required type="text" />
        <FieldError>Please enter your full name.</FieldError>
      </Field>

      <Field name="email">
        <FieldLabel>
          Email
          <RequiredMarker />
        </FieldLabel>
        <Input placeholder="ada@example.com" required type="email" />
        <FieldDescription>Used for account notifications.</FieldDescription>
        <FieldError>Please enter a valid email.</FieldError>
      </Field>

      <Field name="team">
        <FieldLabel>Team</FieldLabel>
        <Input placeholder="Analytical Engine" type="text" />
        <FieldDescription>This field is optional.</FieldDescription>
      </Field>

      <Button type="submit">Create account</Button>

      {submittedName ? (
        <output aria-live="polite" className="text-muted-foreground text-sm">
          Account ready for {submittedName}.
        </output>
      ) : null}
    </Form>
  )
}

export const SubscribeForm = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmittedEmail(String(data.get('email') ?? ''))
  }

  return (
    <Form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="you@example.com" required type="email" />
        <FieldDescription>Product updates, once a month.</FieldDescription>
        <FieldError>Please enter a valid email.</FieldError>
      </Field>
      <Button type="submit">Subscribe</Button>
      {submittedEmail ? (
        <output aria-live="polite" className="text-muted-foreground text-sm">
          Subscribed {submittedEmail}.
        </output>
      ) : null}
    </Form>
  )
}

export const EmailConstraintsForm = () => (
  <Form className="flex w-80 flex-col gap-4">
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="you@example.com" required type="email" />
      <FieldError match="valueMissing">Enter an email.</FieldError>
      <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
    </Field>
    <Button type="submit">Save</Button>
  </Form>
)
