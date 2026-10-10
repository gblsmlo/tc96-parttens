'use client'

import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { Kbd } from '@tc96/ui/kbd'
import { Spinner } from '@tc96/ui/spinner'
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { DialogShell } from '../../components/dialog-shell'
import type { RecordDialogProps } from '../../core'
import { useSettledAction } from '../../hooks/use-settled-action'

const FIRST_FIELD =
  'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)'

function useModifierHint(enabled: boolean) {
  const [apple, setApple] = useState(false)

  useEffect(() => {
    if (enabled) setApple(/Mac|iPhone|iPad/.test(navigator.userAgent))
  }, [enabled])

  return apple ? '⌘' : 'Ctrl'
}

export function RecordDialog({
  actions,
  cancelLabel,
  children,
  className,
  description,
  errorMessage,
  footerStart,
  keepOpenOnSuccess = false,
  onOpenChange,
  onSubmit,
  open,
  size,
  stretchBody,
  submitDisabled = false,
  submitLabel,
  submitOnModEnter = false,
  submittingLabel,
  title,
  titleAncestor,
}: RecordDialogProps) {
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const modifier = useModifierHint(submitOnModEnter)
  const { pending, run } = useSettledAction(open, () => {
    restoreFocus.current = null
    if (!keepOpenOnSuccess) return onOpenChange(false)
    formRef.current?.reset()
    formRef.current?.querySelector<HTMLElement>(FIRST_FIELD)?.focus()
  })

  useEffect(() => {
    if (pending) return
    restoreFocus.current?.focus()
    restoreFocus.current = null
  }, [pending])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    restoreFocus.current =
      document.activeElement === submitRef.current ? submitRef.current : null
    void run(() => onSubmit(event))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (!submitOnModEnter || event.key !== 'Enter') return
    if (!event.metaKey && !event.ctrlKey) return
    event.preventDefault()
    if (pending || submitDisabled) return
    event.currentTarget.requestSubmit()
  }

  const form = (
    <Form
      aria-busy={pending || undefined}
      className={stretchBody ? 'flex flex-1 flex-col' : undefined}
      data-slot="record-dialog-form"
      id={formId}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {children}
    </Form>
  )

  return (
    <DialogShell
      actions={actions}
      className={className}
      description={description}
      dismissible={!pending}
      errorMessage={errorMessage}
      footer={
        <>
          {cancelLabel ? (
            <Button
              data-slot="record-dialog-cancel"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              {cancelLabel}
            </Button>
          ) : null}
          <Button
            aria-keyshortcuts={
              submitOnModEnter ? 'Meta+Enter Control+Enter' : undefined
            }
            data-slot="record-dialog-submit"
            disabled={pending || submitDisabled}
            form={formId}
            ref={submitRef}
            type="submit"
          >
            {pending ? <Spinner aria-hidden="true" /> : null}
            {pending ? (submittingLabel ?? submitLabel) : submitLabel}
            {submitOnModEnter ? (
              <Kbd aria-hidden="true" data-slot="record-dialog-submit-hint">
                {modifier} ↵
              </Kbd>
            ) : null}
          </Button>
        </>
      }
      footerStart={footerStart}
      formHost={children ? undefined : form}
      onOpenChange={onOpenChange}
      open={open}
      pending={pending}
      size={size}
      stretchBody={stretchBody}
      title={title}
      titleAncestor={titleAncestor}
    >
      {children ? form : null}
    </DialogShell>
  )
}
