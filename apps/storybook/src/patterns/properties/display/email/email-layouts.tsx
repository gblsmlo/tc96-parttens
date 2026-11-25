import { EmailProperty, type EmailPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import type { EmailControls } from './email-controls.ts'

type StatefulEmailProps = Omit<
  EmailPropertyProps,
  'onValueChange' | 'value'
> & {
  initialValue: readonly string[]
}

export const StatefulEmail = ({
  initialValue,
  ...props
}: Readonly<StatefulEmailProps>) => {
  const [value, setValue] = useState(initialValue)

  return (
    <EmailProperty
      ariaLabel="E-mails"
      placeholder="Sem e-mail"
      {...props}
      onValueChange={setValue}
      value={value}
      labels={{ ...ptBRPropertyLabels.email, ...props.labels }}
    />
  )
}

type ComposedEmailProps = EmailControls &
  Pick<EmailPropertyProps, 'display' | 'editing'>

export const ComposedEmail = ({
  addTrigger,
  errorMessage,
  labelsAdd,
  labelsInputPlaceholder,
  value,
  ...props
}: Readonly<ComposedEmailProps>) => (
  <StatefulEmail
    {...props}
    addDisabled={!addTrigger}
    errorMessage={errorMessage || null}
    initialValue={value}
    key={value.join()}
    labels={{ add: labelsAdd, inputPlaceholder: labelsInputPlaceholder }}
  />
)

export const ListInPopoverEmail = (args: Readonly<EmailControls>) => (
  <ComposedEmail {...args} display="trigger" />
)

export const InlineFieldEmail = (args: Readonly<EmailControls>) => (
  <ComposedEmail {...args} editing="inline" />
)
