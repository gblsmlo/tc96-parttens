import { PeopleProperty, type PeoplePropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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

  return (
    <PeopleProperty
      ariaLabel="Pessoas"
      placeholder="Adicionar pessoa"
      {...props}
      onValueChange={setValue}
      value={value}
      labels={{ ...ptBRPropertyLabels.people, ...props.labels }}
    />
  )
}

export const ComposedPeople = ({
  display,
  labelsAdd,
  labelsEmpty,
  labelsLoading,
  labelsRemove,
  value,
  ...props
}: Readonly<PeopleControls> & { display?: 'chips' | 'stack' }) => (
  <StatefulPeople
    {...props}
    display={display}
    initialValue={value}
    key={`${display ?? 'chips'}:${value.join()}`}
    labels={{
      add: labelsAdd,
      empty: labelsEmpty,
      loading: labelsLoading,
      remove: labelsRemove,
    }}
    options={peopleOptions}
  />
)
