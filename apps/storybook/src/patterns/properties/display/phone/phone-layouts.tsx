import { PhoneProperty, type PhonePropertyProps } from '@tc96/parttens'
import { useState } from 'react'
import type { PhoneControls } from './phone-controls.ts'

type StatefulPhoneProps = Omit<
  PhonePropertyProps,
  'onValueChange' | 'value'
> & {
  initialValue: readonly string[]
}

export const StatefulPhone = ({
  initialValue,
  ...props
}: Readonly<StatefulPhoneProps>) => {
  const [value, setValue] = useState(initialValue)

  return <PhoneProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedPhone = ({
  addTrigger,
  errorMessage,
  inputPlaceholder,
  value,
  ...props
}: Readonly<PhoneControls>) => (
  <StatefulPhone
    {...props}
    addDisabled={!addTrigger}
    errorMessage={errorMessage || null}
    initialValue={value}
    inputPlaceholder={inputPlaceholder || undefined}
    key={`${value.join()}-${props.defaultCountry}`}
  />
)

export function PrimaryNumberPhone({
  initialValue,
}: Readonly<{ initialValue: readonly string[] }>) {
  const [value, setValue] = useState(initialValue)

  return (
    <PhoneProperty
      addDisabled={value.length > 0}
      addLabel="Adicionar telefone principal"
      ariaLabel="Telefone principal"
      entryLabels={['Principal']}
      onValueChange={setValue}
      value={value}
    />
  )
}
