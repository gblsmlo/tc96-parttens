'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { type ReactElement, useEffect, useMemo, useRef } from 'react'
import { AuthSplitLayout } from '../shared/auth-split-layout'
import { AuthSplitProviders } from '../shared/auth-split-providers'
import { resolveAuthLabels } from '../shared/labels'
import { toFormErrors } from '../shared/to-form-errors'
import { useFocusFirstInvalid } from '../shared/use-focus-first-invalid'
import { defaultMagicLink6Labels } from './labels'
import type { MagicLink6Props, MagicLink6Values } from './types'

function toMagicLink6Values(
  values: Readonly<Record<string, unknown>>,
): MagicLink6Values {
  return { email: String(values.email ?? '') }
}

export function MagicLink6({
  destination,
  error,
  fieldErrors,
  labels: labelsProp,
  logo,
  media,
  onProviderSelect,
  onResend,
  onReset,
  onSubmit,
  pending = false,
  providers,
  renderLink = renderAnchor,
  showProviders = true,
  signupHref,
  resendIn = 0,
  sent = false,
}: Readonly<MagicLink6Props>): ReactElement {
  const labels = resolveAuthLabels(defaultMagicLink6Labels, labelsProp)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const errors = useMemo(() => toFormErrors(fieldErrors), [fieldErrors])
  const wasSent = useRef(sent)
  const counting = resendIn > 0

  useFocusFirstInvalid({ alertRef, error, fieldErrors, formRef })

  useEffect(() => {
    if (sent && !wasSent.current) titleRef.current?.focus()
    wasSent.current = sent
  }, [sent])

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

  if (sent) {
    return (
      <AuthSplitLayout
        alertRef={alertRef}
        description={labels.sentDescription(destination)}
        error={error}
        errorTitle={labels.errorTitle}
        footer={footer}
        logo={logo}
        media={media}
        mediaLabel={labels.mediaLabel}
        title={labels.sentTitle}
        titleRef={titleRef}
      >
        {onResend ? (
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span>{labels.didNotReceive}</span>
            <Button
              className="underline"
              disabled={counting || pending}
              onClick={() => {
                if (counting || pending) return
                onResend()
              }}
              size="sm"
              type="button"
              variant="link"
            >
              {counting ? labels.resendIn(resendIn) : labels.resend}
            </Button>
          </div>
        ) : null}
        {onReset ? (
          <Button
            className="w-full"
            disabled={pending}
            onClick={onReset}
            type="button"
            variant="outline"
          >
            {labels.useAnotherEmail}
          </Button>
        ) : null}
      </AuthSplitLayout>
    )
  }

  return (
    <AuthSplitLayout
      alertRef={alertRef}
      description={labels.description}
      error={error}
      errorTitle={labels.errorTitle}
      footer={footer}
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
          onSubmit(toMagicLink6Values(values))
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
      <AuthSplitProviders
        labels={labels}
        onSelect={onProviderSelect}
        pending={pending}
        providers={showProviders ? providers : undefined}
      />
    </AuthSplitLayout>
  )
}
