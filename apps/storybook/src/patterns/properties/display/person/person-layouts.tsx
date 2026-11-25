import { PersonProperty, type PersonPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import type { PersonControls } from './person-controls.ts'
import { personOptions } from './person-data.ts'

type StatefulPersonProps<TValue extends string> = Omit<
  PersonPropertyProps<TValue>,
  'onValueChange' | 'value'
> & {
  initialValue: TValue | null
}

export const StatefulPerson = <TValue extends string>({
  initialValue,
  ...props
}: Readonly<StatefulPersonProps<TValue>>) => {
  const [value, setValue] = useState(initialValue)

  return (
    <PersonProperty
      placeholder="Sem responsável"
      {...props}
      onValueChange={setValue}
      value={value}
    />
  )
}

export const ComposedPerson = ({
  value,
  ...props
}: Readonly<PersonControls>) => (
  <StatefulPerson
    {...props}
    initialValue={value === 'none' ? null : value}
    key={value}
    options={personOptions}
  />
)
