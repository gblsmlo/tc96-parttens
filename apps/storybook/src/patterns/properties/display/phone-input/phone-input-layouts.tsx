import {
  PhoneInput,
  type PhoneInputProps,
} from '@tc96/parttens/properties/display/phone-input/phone-input'
import { useState } from 'react'
import type { PhoneInputControls } from './phone-input-controls.ts'

type StatefulPhoneInputProps = Omit<PhoneInputProps, 'onValueChange'> & {
  onValueChange?: PhoneInputProps['onValueChange']
}

export function StatefulPhoneInput({
  onValueChange,
  value: initialValue,
  ...props
}: Readonly<StatefulPhoneInputProps>) {
  const [value, setValue] = useState(initialValue)

  return (
    <PhoneInput
      {...props}
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
      value={value}
    />
  )
}

export const ComposedPhoneInput = ({
  placeholder,
  value,
  ...props
}: Readonly<PhoneInputControls>) => (
  <StatefulPhoneInput
    {...props}
    key={`${value}-${props.defaultCountry}`}
    placeholder={placeholder || undefined}
    value={value || null}
  />
)
