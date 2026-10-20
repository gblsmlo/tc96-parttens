import { afterEach, expect, mock, test } from 'bun:test'
import { useState } from 'react'
import type { WizardNextProps, WizardStep } from '../../core'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { Wizard } = await import('../wizard/wizard')
const { WizardFooter } = await import('./wizard-footer')
const { WizardNext } = await import('./wizard-next')
const { WizardPrevious } = await import('./wizard-previous')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const steps: WizardStep[] = [
  { title: 'Tipo', value: 'type' },
  { title: 'Detalhes', value: 'details' },
  { disabled: true, title: 'Revisão', value: 'review' },
]

function ControlledWizard({
  defaultValue = 'type',
  nextProps,
  onValueChange,
}: {
  defaultValue?: string
  nextProps?: WizardNextProps
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  return (
    <Wizard
      label="Etapas"
      onValueChange={(next) => {
        onValueChange?.(next)
        setValue(next)
      }}
      steps={steps}
      value={value}
    >
      <WizardFooter>
        <WizardPrevious>Anterior</WizardPrevious>
        <WizardNext {...nextProps}>Próximo</WizardNext>
      </WizardFooter>
    </Wizard>
  )
}

const previousButton = () =>
  screen.getByRole('button', { name: 'Anterior' }) as HTMLButtonElement
const nextButton = () =>
  screen.getByRole('button', { name: 'Próximo' }) as HTMLButtonElement
const panel = () => document.querySelector('[data-slot="wizard-panel"]')

test('lays out the actions in a footer', () => {
  render(<ControlledWizard />)

  const footer = document.querySelector('[data-slot="wizard-footer"]')

  expect(footer?.contains(previousButton())).toBe(true)
  expect(previousButton().getAttribute('data-slot')).toBe('wizard-previous')
  expect(nextButton().getAttribute('data-slot')).toBe('wizard-next')
})

test('disables previous on the first step and next on the last', () => {
  const { unmount } = render(<ControlledWizard />)

  expect(previousButton().disabled).toBe(true)
  expect(nextButton().disabled).toBe(false)

  unmount()
  render(<ControlledWizard defaultValue="review" />)

  expect(previousButton().disabled).toBe(false)
  expect(nextButton().disabled).toBe(true)
})

test('moves to the adjacent steps, including one disabled in the nav', () => {
  const onValueChange = mock((_value: string) => {})
  render(<ControlledWizard onValueChange={onValueChange} />)

  fireEvent.click(nextButton())
  fireEvent.click(nextButton())
  fireEvent.click(previousButton())

  expect(onValueChange.mock.calls).toEqual([
    ['details'],
    ['review'],
    ['details'],
  ])
})

test('moves focus to the panel after a move', async () => {
  render(<ControlledWizard />)

  nextButton().focus()
  await act(async () => {
    fireEvent.click(nextButton())
  })

  expect(document.activeElement).toBe(panel())
  expect(panel()?.getAttribute('aria-labelledby')).toBeTruthy()
})

test('stays on the step when the consumer prevents the click', () => {
  const onValueChange = mock((_value: string) => {})
  render(
    <ControlledWizard
      nextProps={{ onClick: (event) => event.preventDefault() }}
      onValueChange={onValueChange}
    />,
  )

  fireEvent.click(nextButton())

  expect(onValueChange).not.toHaveBeenCalled()
})

test('keeps the consumer disabled on next', () => {
  render(<ControlledWizard nextProps={{ disabled: true }} />)

  expect(nextButton().disabled).toBe(true)
})

test('throws outside a Wizard', () => {
  const error = console.error
  console.error = () => {}

  expect(() => render(<WizardNext>Próximo</WizardNext>)).toThrow(
    'WizardNext must be used inside a Wizard.',
  )

  console.error = error
})
