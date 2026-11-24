'use client'

import { EnvelopeSimpleIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useEffect, useMemo, useRef } from 'react'
import { AuthCard } from '../shared/auth-card'
import { AuthPasswordField } from '../shared/auth-password-field'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin5Labels } from './labels'
import type { Login5Props, Login5Values } from './types'

const defaultValues: Login5Values = { email: '', password: '' }

export function Login5({
  error,
  fieldErrors,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  method,
  methods,
  onMethod,
  onMethodChange,
  onSubmit,
  pending = false,
  renderLink = renderAnchor,
  signupHref,
}: Readonly<Login5Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin5Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const emailMethodRef = useRef<HTMLButtonElement>(null)
  const wasEmail = useRef(method === 'email')
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const emailOpen = method === 'email'
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (emailOpen && !wasEmail.current)
      formRef.current
        ?.querySelector<HTMLElement>('input[name="email"]')
        ?.focus()
    if (!emailOpen && wasEmail.current) emailMethodRef.current?.focus()
    wasEmail.current = emailOpen
  }, [emailOpen])

  const footer = signupHref ? (
    <>
      <span>{labels.noAccount}</span>
      <Button
        className="underline"
        render={renderLink(signupHref)}
        size="sm"
        variant="link"
      >
        {labels.signup}
      </Button>
    </>
  ) : undefined

  if (emailOpen) {
    return (
      <AuthCard
        alertRef={alertRef}
        description={labels.emailDescription}
        error={error}
        errorTitle={labels.errorTitle}
        footer={footer}
        logo={logo}
        title={labels.emailTitle}
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
                  autoComplete="username"
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
          <form.Field name="password">
            {(field) => (
              <AuthPasswordField
                autoComplete="current-password"
                hideLabel={labels.hidePassword}
                label={labels.password}
                name={field.name}
                onValueChange={(value) => field.handleChange(value)}
                showLabel={labels.showPassword}
              />
            )}
          </form.Field>
          {forgotPasswordHref ? (
            <Button
              className="self-end underline"
              render={renderLink(forgotPasswordHref)}
              size="sm"
              variant="link"
            >
              {labels.forgotPassword}
            </Button>
          ) : null}
          <Button className="w-full" loading={pending} type="submit">
            {labels.submit}
          </Button>
          <Button
            className="w-full"
            disabled={pending}
            onClick={() => {
              if (!pending) onMethodChange?.(undefined)
            }}
            type="button"
            variant="ghost"
          >
            {labels.backToMethods}
          </Button>
        </Form>
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
      <fieldset aria-busy={pending} className="flex min-w-0 flex-col gap-2">
        <legend className="sr-only">{labels.methodsGroup}</legend>
        {methods.map((item) => (
          <Button
            className="w-full"
            disabled={pending}
            key={item.id}
            onClick={() => {
              if (!pending) onMethod(item.id)
            }}
            type="button"
            variant="outline"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
        <Button
          className="w-full"
          disabled={pending}
          onClick={() => {
            if (!pending) onMethodChange?.('email')
          }}
          ref={emailMethodRef}
          type="button"
          variant="outline"
        >
          <EnvelopeSimpleIcon aria-hidden />
          {labels.emailMethod}
        </Button>
      </fieldset>
    </AuthCard>
  )
}
