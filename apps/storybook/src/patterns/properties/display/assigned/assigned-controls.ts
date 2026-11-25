import type { ArgTypes } from '@storybook/react-vite'
import type { PersonPropertyOption, PropertyVariant } from '@tc96/ui/patterns'

export type Assignee = 'ana' | 'gabriel' | 'marina'

export const assignees: PersonPropertyOption<Assignee>[] = [
  {
    fallback: 'AM',
    label: 'Ana Martins',
    supportingLabel: 'Operações',
    value: 'ana',
  },
  {
    fallback: 'GM',
    label: 'Gabriel Melo',
    supportingLabel: 'Dono',
    value: 'gabriel',
  },
  {
    fallback: 'MS',
    label: 'Marina Souza',
    supportingLabel: 'Vendas',
    value: 'marina',
  },
]

export interface AssignedControls {
  ariaLabel: string
  disabled: boolean
  placeholder: string
  readOnly: boolean
  value: Assignee | null
  variant: PropertyVariant
}

export const assignedControlArgs: AssignedControls = {
  ariaLabel: 'Responsável',
  disabled: false,
  placeholder: 'Sem responsável',
  readOnly: false,
  value: 'gabriel',
  variant: 'badge',
}

export const assignedControlArgTypes: Partial<ArgTypes<AssignedControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel`; the trigger is named `<ariaLabel>: <assignee or placeholder>`.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of the trigger.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder`, shown while `value` is `null`.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly`: the value renders as a labelled image, with no list to open.',
  },
  value: {
    control: 'select',
    description:
      'The `value`: one of the option values, or `null` for no assignee.',
    mapping: { none: null },
    options: ['gabriel', 'ana', 'marina', 'none'],
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of the surface.',
    options: ['badge', 'plain'],
  },
}
