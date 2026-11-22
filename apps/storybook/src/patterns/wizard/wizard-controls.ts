import type { ArgTypes } from '@storybook/react-vite'
import { dealSteps } from './fixtures/deal.tsx'

export const wizardStepValues: string[] = dealSteps.map((step) => step.value)

export interface WizardControls {
  descriptions: boolean
  footer: boolean
  icons: boolean
  label: string
  lockedSteps: boolean
  nextLabel: string
  previousLabel: string
  value: string
}

export const wizardControlArgs: WizardControls = {
  descriptions: true,
  footer: true,
  icons: true,
  label: 'Etapas do cupom',
  lockedSteps: false,
  nextLabel: 'Próximo',
  previousLabel: 'Anterior',
  value: 'details',
}

export const wizardControlArgTypes: Partial<ArgTypes<WizardControls>> = {
  descriptions: {
    control: 'boolean',
    description: 'Gives every step a `description`, shown under its title.',
  },
  footer: {
    control: 'boolean',
    description:
      'Adds a `WizardFooter` with `WizardPrevious` and `WizardNext` after the content.',
  },
  icons: {
    control: 'boolean',
    description:
      'Gives every step an `icon`; without it the indicator shows a check or the step number.',
  },
  label: {
    control: 'text',
    description:
      'The `label` of `Wizard`, which names the `nav`; empty falls back to the default so the `nav` stays named.',
  },
  lockedSteps: {
    control: 'boolean',
    description:
      'Marks the steps after the second as `disabled`: the nav cannot reach them, but `WizardNext` still moves onto them.',
  },
  nextLabel: {
    control: 'text',
    description: 'Text of `WizardNext`; empty falls back to the default.',
  },
  previousLabel: {
    control: 'text',
    description: 'Text of `WizardPrevious`; empty falls back to the default.',
  },
  value: {
    control: 'inline-radio',
    description:
      'The `value` of `Wizard`, the current step. The story keeps its own step once you move, and starts from the control again when it changes.',
    options: wizardStepValues,
  },
}
