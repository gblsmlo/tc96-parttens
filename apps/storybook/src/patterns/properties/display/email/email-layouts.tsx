import { EmailProperty, type EmailPropertyProps } from '@tc96/parttens'
import { useState } from 'react'
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

  return <EmailProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedEmail = ({
  addTrigger,
  errorMessage,
  value,
  ...props
}: Readonly<EmailControls>) => (
  <StatefulEmail
    {...props}
    addDisabled={!addTrigger}
    errorMessage={errorMessage || null}
    initialValue={value}
    key={value.join()}
  />
)
