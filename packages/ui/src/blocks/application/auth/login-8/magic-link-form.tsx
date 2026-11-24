'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { type ReactElement, type ReactNode, useMemo, useRef } from 'react'
import { toFormErrors } from '../shared/to-form-errors'
import type { AuthFieldErrors, AuthProvider } from '../shared/types'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { StackedProviders } from './stacked-providers'
import type { Login8Labels, Login8Values } from './types'

const defaultValues: Login8Values = { email: '' }

export interface MagicLinkFormProps {
  error?: string
  fieldErrors?: AuthFieldErrors<Login8Values>
  labels: Login8Labels
  logo?: ReactNode
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login8Values) => void
  pending: boolean
  providers?: AuthProvider[]
}

export function MagicLinkForm({
  error,
  fieldErrors,
  labels,
  logo,
  onProviderSelect,
  onSubmit,
  pending,
  providers,
}: Readonly<MagicLinkFormProps>): ReactElement {
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  })

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {logo ? <div className="flex">{logo}</div> : null}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl">{labels.title}</h1>
        <p className="text-muted-foreground text-sm">{labels.description}</p>
      </div>
      {error ? (
        <Alert ref={alertRef} tabIndex={-1} variant="error">
          <AlertTitle>{labels.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
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
              <FieldDescription>{labels.emailHint}</FieldDescription>
              <FieldError />
            </Field>
          )}
        </form.Field>
        <Button className="w-full" loading={pending} type="submit">
          {labels.submit}
          <ArrowRightIcon aria-hidden />
        </Button>
      </Form>
      <StackedProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={providers}
      />
    </div>
  )
}
