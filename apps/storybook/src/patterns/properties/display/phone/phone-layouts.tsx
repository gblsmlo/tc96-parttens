import { PhoneProperty, type PhonePropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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

  return (
    <PhoneProperty
      ariaLabel="Telefones"
      placeholder="Sem telefone"
      {...props}
      onValueChange={setValue}
      value={value}
      labels={{ ...ptBRPropertyLabels.phone, ...props.labels }}
    />
  )
}

type ComposedPhoneProps = PhoneControls & Pick<PhonePropertyProps, 'display'>

export const ComposedPhone = ({
  addTrigger,
  errorMessage,
  labelsAdd,
  labelsInputPlaceholder,
  value,
  ...props
}: Readonly<ComposedPhoneProps>) => (
  <StatefulPhone
    {...props}
    addDisabled={!addTrigger}
    errorMessage={errorMessage || null}
    initialValue={value}
    key={`${value.join()}-${props.defaultCountry}`}
    labels={{
      add: labelsAdd,
      inputPlaceholder: labelsInputPlaceholder || undefined,
    }}
  />
)

export const ListInPopoverPhone = (args: Readonly<PhoneControls>) => (
  <ComposedPhone {...args} display="trigger" />
)

export function PrimaryNumberPhone({
  initialValue,
}: Readonly<{ initialValue: readonly string[] }>) {
  const [value, setValue] = useState(initialValue)

  return (
    <PhoneProperty
      placeholder="Sem telefone"
      addDisabled={value.length > 0}
      ariaLabel="Telefone principal"
      onValueChange={setValue}
      value={value}
      labels={{
        ...ptBRPropertyLabels.phone,
        add: 'Adicionar telefone principal',
        entries: ['Principal'],
      }}
    />
  )
}
