import { expect, test } from 'bun:test'
import { adjacentWizardStep, type WizardStep, wizardStepStatus } from './core'

const steps: WizardStep[] = [
  { title: 'Tipo', value: 'type' },
  { title: 'Detalhes', value: 'details' },
  { title: 'Revisão', value: 'review' },
]

test('marks the steps before the value complete and after it upcoming', () => {
  expect(
    steps.map((step) => wizardStepStatus(steps, 'details', step.value)),
  ).toEqual(['complete', 'current', 'upcoming'])
})

test('marks every step upcoming when the value is not a step', () => {
  expect(
    steps.map((step) => wizardStepStatus(steps, 'missing', step.value)),
  ).toEqual(['upcoming', 'upcoming', 'upcoming'])
})

test('finds the step before and after the value', () => {
  expect(adjacentWizardStep(steps, 'details', -1)?.value).toBe('type')
  expect(adjacentWizardStep(steps, 'details', 1)?.value).toBe('review')
})

test('has no step before the first, after the last or around a missing value', () => {
  expect(adjacentWizardStep(steps, 'type', -1)).toBeUndefined()
  expect(adjacentWizardStep(steps, 'review', 1)).toBeUndefined()
  expect(adjacentWizardStep(steps, 'missing', 1)).toBeUndefined()
})
