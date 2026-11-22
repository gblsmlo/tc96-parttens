import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'
import { peopleOptionLabels, peopleOptions } from './people-data.ts'

export const peopleVariants = ['badge', 'plain'] as const

export interface PeopleControls {
  ariaLabel: string
  disabled: boolean
  isLoading: boolean
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const peopleControlArgs: PeopleControls = {
  ariaLabel: 'Participantes',
  disabled: false,
  isLoading: false,
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
      'The people of `value`; the story keeps the edits in its own state until this control changes.',
    options: peopleOptions.map((option) => option.value),
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `PeopleProperty`.',
    options: peopleVariants,
  },
}
