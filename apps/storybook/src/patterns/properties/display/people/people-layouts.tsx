import { PeopleProperty, type PeoplePropertyProps } from '@tc96/parttens'
import { useState } from 'react'
import type { PeopleControls } from './people-controls.ts'
import { peopleOptions } from './people-data.ts'

type StatefulPeopleProps = Omit<
  PeoplePropertyProps,
  'onValueChange' | 'value'
> & {
  initialValue: readonly string[]
}

export const StatefulPeople = ({
  initialValue,
  ...props
}: Readonly<StatefulPeopleProps>) => {
  const [value, setValue] = useState(initialValue)

  return <PeopleProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedPeople = ({
  value,
  ...props
}: Readonly<PeopleControls>) => (
  <StatefulPeople
    {...props}
    initialValue={value}
    key={value.join()}
    options={peopleOptions}
  />
)
