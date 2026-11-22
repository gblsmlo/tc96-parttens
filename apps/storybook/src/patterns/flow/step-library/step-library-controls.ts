import type { ArgTypes } from '@storybook/react-vite'
import { defaultFlowStepLibraryLabels } from '@tc96/parttens'
import {
  type StepLibraryRunName,
  stepLibraryRunNames,
} from './step-library-variants.ts'

export interface StepLibraryControls {
  collapsed: boolean
  disabled: boolean
  empty: boolean
  hint: string
  loading: boolean
  run: StepLibraryRunName
  runCard: boolean
  title: string
}

export const stepLibraryControlArgs: StepLibraryControls = {
  collapsed: false,
  disabled: false,
  empty: false,
  hint: defaultFlowStepLibraryLabels.hint,
  loading: false,
  run: 'failed',
  runCard: true,
  title: defaultFlowStepLibraryLabels.title,
}

export const stepLibraryControlArgTypes: Partial<
  ArgTypes<StepLibraryControls>
> = {
  collapsed: {
    control: 'boolean',
    description: 'The `collapsed` of `FlowStepLibrary`: icons only.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `FlowStepLibrary`: every item.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no `groups`: the empty state.',
  },
  hint: {
    control: 'text',
    description:
      'The `hint` of `labels`, under the title; empty falls back to the default.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `FlowStepLibrary`: the skeleton.',
  },
  run: {
    control: 'inline-radio',
    description:
      'The `run` of the `FlowRunCard` in the footer: failed, succeeded or not run.',
    options: stepLibraryRunNames,
  },
  runCard: {
    control: 'boolean',
    description: 'Passes a `FlowRunCard` as `children`, the footer.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of `labels`, the `h2` that names the panel; empty falls back to the default.',
  },
}
