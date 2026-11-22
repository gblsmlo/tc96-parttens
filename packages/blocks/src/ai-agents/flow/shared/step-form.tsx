'use client'

import type { FlowStepType } from '@tc96/parttens/flow/canvas/core'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Textarea } from '@tc96/ui/textarea'
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import type { FlowOwner, FlowPageLabels, FlowStepValues } from './types'

export interface StepFormProps {
  autoFocus?: boolean
  formId: string
  icons?: Record<string, ReactNode>
  labels: FlowPageLabels
  onSubmit: (values: FlowStepValues) => void
  owners?: readonly FlowOwner[]
  stepTypes: readonly FlowStepType[]
  values: FlowStepValues
  variant: 'owner' | 'path'
}

const noOwner = '__none__'

export function StepForm({
  autoFocus = false,
  formId,
  icons,
  labels,
  onSubmit,
  owners = [],
  stepTypes,
  values,
  variant,
}: Readonly<StepFormProps>): ReactElement {
  const [draft, setDraft] = useState(values)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const typeOptions = stepTypes.map((type) => ({
    label: type.label,
    value: type.id,
  }))
  const ownerOptions = [
    { label: labels.formOwnerNone, value: noOwner },
    ...owners.map((owner) => ({ label: owner.name, value: owner.id })),
  ]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (draft.name.trim() === '') {
      setError(labels.formNameRequired)
      nameRef.current?.focus()
      return
    }
    setError(null)
    onSubmit({ ...draft, name: draft.name.trim() })
  }

  return (
    <form
      className="flex flex-col gap-4"
      data-slot="flow-step-form"
      id={formId}
      noValidate
      onSubmit={submit}
    >
      <Field>
        <FieldLabel>{labels.formType}</FieldLabel>
        <Select
          items={typeOptions}
          onValueChange={(value) => {
            if (typeof value === 'string')
              setDraft((current) => ({ ...current, type: value }))
          }}
          value={draft.type}
        >
          <SelectTrigger autoFocus={autoFocus}>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {stepTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <span className="flex items-center gap-2">
                  {icons?.[type.id]}
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>
      <Field invalid={error !== null}>
        <FieldLabel>{labels.formName}</FieldLabel>
        <Input
          aria-invalid={error !== null || undefined}
          onChange={(event) => {
            setDraft((current) => ({ ...current, name: event.target.value }))
            if (error) setError(null)
          }}
          ref={nameRef}
          required
          value={draft.name}
        />
        {error ? <FieldError match>{error}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel>{labels.formDescription}</FieldLabel>
        <Textarea
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          value={draft.description}
        />
      </Field>
      {variant === 'owner' ? (
        <Field>
          <FieldLabel>{labels.formOwner}</FieldLabel>
          <Select
            items={ownerOptions}
            onValueChange={(value) => {
              if (typeof value === 'string')
                setDraft((current) => ({
                  ...current,
                  ownerId: value === noOwner ? undefined : value,
                }))
            }}
            value={draft.ownerId ?? noOwner}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup alignItemWithTrigger={false}>
              {ownerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
      ) : (
        <Field>
          <FieldLabel>{labels.formPath}</FieldLabel>
          <Input
            onChange={(event) =>
              setDraft((current) => ({ ...current, path: event.target.value }))
            }
            value={draft.path ?? ''}
          />
        </Field>
      )}
    </form>
  )
}
