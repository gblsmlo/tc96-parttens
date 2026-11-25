import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { peopleOptionLabels, peopleOptions } from './people-data.ts'

export const peopleVariants = ['badge', 'plain'] as const

export interface PeopleControls {
  ariaLabel: string
  disabled: boolean
  isLoading: boolean
  labelsAdd: string
  labelsEmpty: string
  labelsLoading: string
  labelsRemove: string
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const peopleControlArgs: PeopleControls = {
  ariaLabel: 'Participantes',
  disabled: false,
  isLoading: false,
  labelsAdd: ptBRPropertyLabels.people.add,
  labelsEmpty: ptBRPropertyLabels.people.empty,
  labelsLoading: ptBRPropertyLabels.people.loading,
  labelsRemove: ptBRPropertyLabels.people.remove,
  placeholder: 'Adicionar pessoa',
  readOnly: false,
  value: ['person-1'],
  variant: 'plain',
}

export const peopleControlArgTypes: Partial<ArgTypes<PeopleControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `PeopleProperty`: names the row and the list.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `PeopleProperty`.',
  },
  isLoading: {
    control: 'boolean',
    description:
      'The `isLoading` of `PeopleProperty`: a status line at the top of the open list.',
  },
  labelsAdd: {
    control: 'text',
    description:
      '`labels.add` of `PeopleProperty`: the name of the `+` chip once someone is applied.',
  },
  labelsEmpty: {
    control: 'text',
    description:
      '`labels.empty` of `PeopleProperty`: the message of an open list with no option.',
  },
  labelsLoading: {
    control: 'text',
    description:
      '`labels.loading` of `PeopleProperty`: the status line `isLoading` shows at the top of the open list.',
  },
  labelsRemove: {
    control: 'text',
    description:
      '`labels.remove` of `PeopleProperty`: the name of each remove button, before the name of its person.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `PeopleProperty`, shown while no one is applied.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `PeopleProperty`.',
  },
  value: {
    control: { labels: peopleOptionLabels, type: 'check' },
    description:
      'The people of `value`; none applied shows the empty add chip.',
    options: peopleOptions.map((option) => option.value),
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `PeopleProperty`.',
    options: peopleVariants,
  },
}
