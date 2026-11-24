import type { ArgTypes } from '@storybook/react-vite'
import type {
  LookupCreate1Step,
  LookupIdentifierState,
} from '@tc96/blocks/records/lookup-create-1'

export const lookupSourceSets = [
  'searching',
  'answered',
  'failed',
  'none',
] as const

export type LookupSourceSet = (typeof lookupSourceSets)[number]

export interface LookupCreate1Controls {
  alternatives: boolean
  identifierState: LookupIdentifierState
  recordTitle: string
  sources: LookupSourceSet
  step: LookupCreate1Step
  title: string
}

export const lookupCreate1ControlArgs: LookupCreate1Controls = {
  alternatives: true,
  identifierState: 'incomplete',
  recordTitle: '',
  sources: 'searching',
  step: 'origin',
  title: 'Nova empresa',
}

export const lookupCreate1ControlArgTypes: Partial<
  ArgTypes<LookupCreate1Controls>
> = {
  alternatives: {
    control: 'boolean',
    description: 'Passes two `alternatives` under the identifier field.',
  },
  identifierState: {
    control: 'inline-radio',
    description:
      'The `identifierState` of `LookupCreate1`, which sets the origin hint and enables Continuar when `available`.',
    options: ['incomplete', 'checking', 'available', 'taken'],
  },
  recordTitle: {
    control: 'text',
    description: 'The `recordTitle` of the details step; empty disables Criar.',
  },
  sources: {
    control: 'inline-radio',
    description:
      'Which sample `sources` the details step lists: still searching, all answered, one failed, or none.',
    options: lookupSourceSets,
  },
  step: {
    control: 'inline-radio',
    description: 'The `step` of `LookupCreate1`.',
    options: ['origin', 'details'],
  },
  title: {
    control: 'text',
    description: 'The `title` label, which names the dialog.',
  },
}
