import {
  PhoneInput,
  type PhoneInputProps,
} from '@tc96/ui/patterns/properties/display/phone-input/phone-input'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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
      labels={{ ...ptBRPropertyLabels.phoneInput, ...props.labels }}
    />
  )
}

export const ComposedPhoneInput = ({
  labelsCountry,
  labelsCountryEmpty,
  labelsCountryList,
  labelsCountrySearch,
  placeholder,
  value,
  ...props
}: Readonly<PhoneInputControls>) => (
  <StatefulPhoneInput
    {...props}
    key={`${value}-${props.defaultCountry}`}
    labels={{
      country: labelsCountry,
      countryEmpty: labelsCountryEmpty,
      countryList: labelsCountryList,
      countrySearch: labelsCountrySearch,
    }}
    placeholder={placeholder || undefined}
    value={value || null}
  />
)

export function LabelOverFieldPhoneInput({
  message,
  ...args
}: Readonly<PhoneInputControls & { message?: string }>) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="font-medium text-sm">{args.ariaLabel}</span>
      <ComposedPhoneInput {...args} />
      {message ? (
        <p
          className={
            args.invalid
              ? 'text-destructive-foreground text-xs'
              : 'text-muted-foreground text-xs'
          }
          role={args.invalid ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
