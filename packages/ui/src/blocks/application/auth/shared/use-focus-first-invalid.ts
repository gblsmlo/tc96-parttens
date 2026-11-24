'use client'

import { type RefObject, useEffect, useRef } from 'react'
import { toFormErrors } from './to-form-errors'

export interface UseFocusFirstInvalidOptions {
  alertRef: RefObject<HTMLElement | null>
  error?: string
  fieldErrors?: Readonly<Partial<Record<string, string>>>
  formRef: RefObject<HTMLFormElement | null>
}

function findFirstNamedControl(
  form: HTMLFormElement | null,
  names: readonly string[],
): HTMLElement | undefined {
  return Array.from(form?.elements ?? []).find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      !(element instanceof HTMLInputElement && element.type === 'hidden') &&
      names.includes(element.getAttribute('name') ?? ''),
  )
}

export function useFocusFirstInvalid({
  alertRef,
  error,
  fieldErrors,
  formRef,
}: UseFocusFirstInvalidOptions): void {
  const invalidNames = Object.keys(toFormErrors(fieldErrors)).join('\n')
  const hasError = Boolean(error)
  const previous = useRef({ hasError, invalidNames })

  useEffect(() => {
    const before = previous.current
    previous.current = { hasError, invalidNames }
    const hasFieldErrors = invalidNames !== ''
    const filled =
      (hasFieldErrors && before.invalidNames === '') ||
      (hasError && !before.hasError)
    if (!filled) return
    const field = hasFieldErrors
      ? findFirstNamedControl(formRef.current, invalidNames.split('\n'))
      : undefined
    if (field) field.focus()
    else if (hasError) alertRef.current?.focus()
  }, [alertRef, formRef, hasError, invalidNames])
}
