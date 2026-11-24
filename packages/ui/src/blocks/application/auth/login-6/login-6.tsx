'use client'

import { useForm } from '@tanstack/react-form'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useMemo, useRef } from 'react'
import { AuthPasswordField } from '../shared/auth-password-field'
import { AuthSplitLayout } from '../shared/auth-split-layout'
import { AuthSplitProviders } from '../shared/auth-split-providers'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultLogin6Labels } from './labels'
import type { Login6Props, Login6Values } from './types'

const defaultValues: Login6Values = { email: '', password: '' }

export function Login6({
  error,
  fieldErrors,
  forgotPasswordHref,
  labels: labelsProp,
  logo,
  media,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
  renderLink = renderAnchor,
  showProviders = true,
  signupHref,
}: Readonly<Login6Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin6Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <AuthSplitLayout
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={
        signupHref ? (
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
              labelAction={
                forgotPasswordHref ? (
                  <Button
                    className="underline"
                    render={renderLink(forgotPasswordHref)}
                    size="sm"
                    variant="link"
                  >
                    {labels.forgotPassword}
                  </Button>
                ) : undefined
              }
              name={field.name}
              onValueChange={(value) => field.handleChange(value)}
              showLabel={labels.showPassword}
            />
          )}
        </form.Field>
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
        </Button>
      </Form>
      <AuthSplitProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={showProviders ? providers : undefined}
      />
    </AuthSplitLayout>
  )
}
