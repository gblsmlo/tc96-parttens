import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { WizardNext } = await import('./wizard-next')

afterEach(cleanup)

test('throws outside a Wizard', () => {
  const error = console.error
  console.error = () => {}

  expect(() => render(<WizardNext>Próximo</WizardNext>)).toThrow(
    'WizardNext must be used inside a Wizard.',
  )

  console.error = error
})
